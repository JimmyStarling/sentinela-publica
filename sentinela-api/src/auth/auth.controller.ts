  import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { AuthService } from './auth.service';
  import { RegisterDto } from './dto/register.dto/register.dto';
  import { LoginDto } from './dto/login.dto/login.dto';
  import { RefreshTokenDto } from './dto/refresh-token.dto/refresh-token.dto';
  import type { IAuthenticatedRequest } from './auth.interface';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    // Register a new user
    @Post('register')
    async register(@Body() dto: RegisterDto) {
      return this.authService.register(dto);
    }

    // Authenticate user
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto) {
      return this.authService.login(dto);
    }

    // Refresh access token
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Body() dto: RefreshTokenDto) {
      return this.authService.refreshToken(dto.refreshToken);
    }

    // Logout user
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    async logout(@Req() req: IAuthenticatedRequest) {
      return this.authService.logout({ sub: req.user.id });
    }

    // Get authenticated user's profile
    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Req() req: IAuthenticatedRequest) {
      return this.authService.getProfile({ sub: req.user.id });
    }

    // Request password reset
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body('email') email: string) {
      return this.authService.forgotPassword(email);
    }

    // Reset password using a token
    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(
      @Body('token') token: string,
      @Body('newPassword') newPassword: string,
    ) {
      return this.authService.resetPassword(token, newPassword);
    }

    // Change password for authenticated user
    @Post('change-password')
    @UseGuards(AuthGuard('jwt'))
    async changePassword(
      @Req() req: IAuthenticatedRequest,
      @Body('currentPassword') currentPassword: string,
      @Body('newPassword') newPassword: string,
    ) {
      return this.authService.changePassword(
        { sub: req.user.id },
        currentPassword,
        newPassword,
      );
    }
    // Verify email address
    @Post('verify-email')
    @HttpCode(HttpStatus.OK)
    async verifyEmail(@Body('token') token: string) {
      return this.authService.verifyEmail(token);
    }

    // Resend email verification
    @Post('resend-verification')
    @HttpCode(HttpStatus.OK)
    async resendVerification(@Body('email') email: string) {
      return this.authService.resendVerification(email);
    }	
  }
