
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';

import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto/register.dto';
import { LoginDto } from './dto/login.dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    // Inject your email-delivery service here.
  ) {}

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private async createTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(
      { ...payload, type: 'refresh' },
      {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    user.refreshTokenHash = this.hashToken(refreshToken);
    await this.usersRepository.save(user);

    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const user = this.usersRepository.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      password: await bcrypt.hash(dto.password, 12),
      isEmailVerified: false,
    });

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      // Also handle concurrent registration attempts via the unique constraint.
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === '23505'
      ) {
        throw new ConflictException('Email is already registered');
      }
      throw error;
    }

    // Generate and email a verification token here.
    // Do not return the password or password hash.
    return {
      message: 'Registration successful. Verify your email to continue.',
      user: this.toPublicUser(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const tokens = await this.createTokens(user);

    return {
      user: this.toPublicUser(user),
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    let payload: { sub: string; email: string; type?: string };

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow<string>(
          'JWT_REFRESH_SECRET',
        ),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });

    if (
      !user ||
      !user.refreshTokenHash ||
      this.hashToken(refreshToken) !== user.refreshTokenHash
    ) {
      throw new UnauthorizedException('Refresh token revoked or invalid');
    }

    // Rotate the refresh token on every successful refresh.
    const tokens = await this.createTokens(user);

    return tokens;
  }

  async logout(authUser: { sub: string }) {
    const user = await this.usersRepository.findOne({
      where: { id: authUser.sub },
    });

    if (user) {
      user.refreshTokenHash = null;
      await this.usersRepository.save(user);
    }

    return { message: 'Logged out successfully' };
  }

  async getProfile(authUser: { sub: string }) {
    const user = await this.usersRepository.findOne({
      where: { id: authUser.sub },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toPublicUser(user);
  }

  async forgotPassword(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    // Use the same response whether or not the email exists.
    if (user) {
      const token = randomBytes(32).toString('hex');

      user.passwordResetTokenHash = this.hashToken(token);
      user.passwordResetExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await this.usersRepository.save(user);

      // Send token in a password-reset link through your email service.
      // Example: await this.emailService.sendPasswordReset(user.email, token);
      // Never log or return the token in production.
    }

    return {
      message: 'If the account exists, password-reset instructions will be sent.',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = this.hashToken(token);

    const user = await this.usersRepository.findOne({
      where: { passwordResetTokenHash: tokenHash },
    });

    if (
      !user ||
      !user.passwordResetExpiresAt ||
      user.passwordResetExpiresAt.getTime() < Date.now()
    ) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordResetTokenHash = null;
    user.passwordResetExpiresAt = null;
    user.refreshTokenHash = null;

    await this.usersRepository.save(user);

    return { message: 'Password reset successfully. Please log in again.' };
  }

  async changePassword(
    authUser: { sub: string },
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersRepository.findOne({
      where: { id: authUser.sub },
    });

    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.refreshTokenHash = null;

    await this.usersRepository.save(user);

    return { message: 'Password changed successfully. Please log in again.' };
  }

  async verifyEmail(token: string) {
    const tokenHash = this.hashToken(token);

    const user = await this.usersRepository.findOne({
      where: { emailVerificationTokenHash: tokenHash },
    });

    if (
      !user ||
      !user.emailVerificationExpiresAt ||
      user.emailVerificationExpiresAt.getTime() < Date.now()
    ) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    user.isEmailVerified = true;
    user.emailVerificationTokenHash = null;
    user.emailVerificationExpiresAt = null;

    await this.usersRepository.save(user);

    return { message: 'Email verified successfully' };
  }

  async resendVerification(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    // Avoid disclosing whether an account exists or is verified.
    if (user && !user.isEmailVerified) {
      const token = randomBytes(32).toString('hex');

      user.emailVerificationTokenHash = this.hashToken(token);
      user.emailVerificationExpiresAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      );

      await this.usersRepository.save(user);

      // Send the verification link through your email service.
      // Example: await this.emailService.sendVerification(user.email, token);
    }

    return {
      message: 'If verification is needed, instructions will be sent.',
    };
  }

  private toPublicUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    };
  }
}
