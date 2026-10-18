import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';

// O bcrypt é lento e imprevisível (gera um hash diferente a cada vez), então
// trocamos ele por um falso: hash e compare devolvem o que a gente mandar.
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));
const bcryptMock = jest.requireMock('bcrypt') as {
  hash: jest.Mock;
  compare: jest.Mock;
};

// Mesma conta que o service faz para guardar o refresh token
const sha256 = (texto: string) =>
  createHash('sha256').update(texto).digest('hex');

// Cria um usuário novo a cada chamada (assim um teste não suja o outro).
// Passe só os campos que quer mudar.
const criarUsuario = (campos: Partial<User> = {}): User =>
  ({
    id: 'user-1',
    name: 'Ana Souza',
    email: 'ana@teste.com',
    password: 'hash-da-senha',
    isEmailVerified: true,
    refreshTokenHash: null,
    passwordResetTokenHash: null,
    passwordResetExpiresAt: null,
    emailVerificationTokenHash: null,
    emailVerificationExpiresAt: null,
    ...campos,
  }) as User;

describe('AuthService', () => {
  let service: AuthService;

  // Dependências falsas
  const usersRepo = { findOne: jest.fn(), create: jest.fn(), save: jest.fn() };
  const jwtService = { signAsync: jest.fn(), verifyAsync: jest.fn() };
  const configService = { getOrThrow: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    configService.getOrThrow.mockReturnValue('segredo-de-teste');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: usersRepo },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('deve cadastrar um usuário novo sem devolver a senha', async () => {
      const novo = criarUsuario({ isEmailVerified: false });
      usersRepo.findOne.mockResolvedValue(null); // e-mail ainda livre
      bcryptMock.hash.mockResolvedValue('hash-da-senha');
      usersRepo.create.mockReturnValue(novo);
      usersRepo.save.mockResolvedValue(novo);

      const resultado = await service.register({
        name: 'Ana Souza',
        email: 'Ana@Teste.com', // maiúsculas: o service deve minusculizar
        password: 'senha-bem-grande-123',
      });

      expect(usersRepo.create).toHaveBeenCalledWith({
        name: 'Ana Souza',
        email: 'ana@teste.com',
        password: 'hash-da-senha',
        isEmailVerified: false,
      });
      expect(usersRepo.save).toHaveBeenCalledWith(novo);
      expect(resultado.user.email).toBe('ana@teste.com');
      expect(resultado.user).not.toHaveProperty('password');
    });

    it('deve lançar ConflictException se o e-mail já está cadastrado', async () => {
      usersRepo.findOne.mockResolvedValue(criarUsuario());

      await expect(
        service.register({
          name: 'Ana',
          email: 'ana@teste.com',
          password: 'senha-bem-grande-123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('deve devolver o usuário e os dois tokens quando os dados estão certos', async () => {
      usersRepo.findOne.mockResolvedValue(criarUsuario());
      bcryptMock.compare.mockResolvedValue(true);
      jwtService.signAsync
        .mockResolvedValueOnce('token-acesso')
        .mockResolvedValueOnce('token-refresh');

      const resultado = await service.login({
        email: 'ana@teste.com',
        password: 'senha-certa',
      });

      expect(resultado.accessToken).toBe('token-acesso');
      expect(resultado.refreshToken).toBe('token-refresh');
      expect(resultado.user.email).toBe('ana@teste.com');
      expect(resultado.user).not.toHaveProperty('password');
    });

    it('deve lançar UnauthorizedException se a senha está errada', async () => {
      usersRepo.findOne.mockResolvedValue(criarUsuario());
      bcryptMock.compare.mockResolvedValue(false);

      await expect(
        service.login({ email: 'ana@teste.com', password: 'senha-errada' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException se o e-mail não foi verificado', async () => {
      usersRepo.findOne.mockResolvedValue(
        criarUsuario({ isEmailVerified: false }),
      );
      bcryptMock.compare.mockResolvedValue(true);

      await expect(
        service.login({ email: 'ana@teste.com', password: 'senha-certa' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('deve gerar tokens novos quando o refresh token é válido', async () => {
      jwtService.verifyAsync.mockResolvedValue({
        sub: 'user-1',
        email: 'ana@teste.com',
        type: 'refresh',
      });
      usersRepo.findOne.mockResolvedValue(
        criarUsuario({ refreshTokenHash: sha256('refresh-antigo') }),
      );
      jwtService.signAsync
        .mockResolvedValueOnce('novo-acesso')
        .mockResolvedValueOnce('novo-refresh');

      const resultado = await service.refreshToken('refresh-antigo');

      expect(resultado).toEqual({
        accessToken: 'novo-acesso',
        refreshToken: 'novo-refresh',
      });
    });

    it('deve lançar UnauthorizedException se o token é inválido', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('token inválido'));

      await expect(service.refreshToken('lixo')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('deve apagar o refresh token do usuário', async () => {
      const usuario = criarUsuario({ refreshTokenHash: 'algum-hash' });
      usersRepo.findOne.mockResolvedValue(usuario);

      const resultado = await service.logout({ sub: 'user-1' });

      expect(usuario.refreshTokenHash).toBeNull();
      expect(usersRepo.save).toHaveBeenCalledWith(usuario);
      expect(resultado.message).toBe('Logged out successfully');
    });
  });

  describe('getProfile', () => {
    it('deve devolver o perfil público do usuário', async () => {
      usersRepo.findOne.mockResolvedValue(criarUsuario());

      const resultado = await service.getProfile({ sub: 'user-1' });

      expect(resultado).toEqual({
        id: 'user-1',
        name: 'Ana Souza',
        email: 'ana@teste.com',
        isEmailVerified: true,
      });
    });

    it('deve lançar NotFoundException se o usuário não existe', async () => {
      usersRepo.findOne.mockResolvedValue(null);

      await expect(service.getProfile({ sub: 'nao-existe' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('forgotPassword', () => {
    it('deve gravar o token de redefinição quando o e-mail existe', async () => {
      const usuario = criarUsuario();
      usersRepo.findOne.mockResolvedValue(usuario);

      const resultado = await service.forgotPassword('ana@teste.com');

      expect(usuario.passwordResetTokenHash).toEqual(expect.any(String));
      expect(usuario.passwordResetExpiresAt).toBeInstanceOf(Date);
      expect(usersRepo.save).toHaveBeenCalledWith(usuario);
      expect(resultado.message).toContain('If the account exists');
    });

    it('deve dar a mesma resposta (sem salvar nada) quando o e-mail não existe', async () => {
      usersRepo.findOne.mockResolvedValue(null);

      const resultado = await service.forgotPassword('ninguem@teste.com');

      expect(usersRepo.save).not.toHaveBeenCalled();
      expect(resultado.message).toContain('If the account exists');
    });
  });

  describe('resetPassword', () => {
    it('deve trocar a senha quando o token é válido', async () => {
      const usuario = criarUsuario({
        passwordResetTokenHash: sha256('token-reset'),
        passwordResetExpiresAt: new Date(Date.now() + 60_000), // vale por 1 min
      });
      usersRepo.findOne.mockResolvedValue(usuario);
      bcryptMock.hash.mockResolvedValue('hash-da-senha-nova');

      await service.resetPassword('token-reset', 'senha-nova-bem-grande');

      expect(usuario.password).toBe('hash-da-senha-nova');
      expect(usuario.passwordResetTokenHash).toBeNull();
      expect(usuario.passwordResetExpiresAt).toBeNull();
      expect(usersRepo.save).toHaveBeenCalledWith(usuario);
    });

    it('deve lançar BadRequestException se o token expirou', async () => {
      usersRepo.findOne.mockResolvedValue(
        criarUsuario({
          passwordResetExpiresAt: new Date(Date.now() - 60_000), // venceu
        }),
      );

      await expect(
        service.resetPassword('token-reset', 'senha-nova-bem-grande'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('changePassword', () => {
    it('deve trocar a senha quando a senha atual está certa', async () => {
      const usuario = criarUsuario();
      usersRepo.findOne.mockResolvedValue(usuario);
      bcryptMock.compare.mockResolvedValue(true);
      bcryptMock.hash.mockResolvedValue('hash-da-senha-nova');

      await service.changePassword(
        { sub: 'user-1' },
        'senha-atual',
        'senha-nova-bem-grande',
      );

      expect(usuario.password).toBe('hash-da-senha-nova');
      expect(usersRepo.save).toHaveBeenCalledWith(usuario);
    });

    it('deve lançar UnauthorizedException se a senha atual está errada', async () => {
      usersRepo.findOne.mockResolvedValue(criarUsuario());
      bcryptMock.compare.mockResolvedValue(false);

      await expect(
        service.changePassword({ sub: 'user-1' }, 'errada', 'nova-senha-grande'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('verifyEmail', () => {
    it('deve marcar o e-mail como verificado quando o token é válido', async () => {
      const usuario = criarUsuario({
        isEmailVerified: false,
        emailVerificationTokenHash: sha256('token-email'),
        emailVerificationExpiresAt: new Date(Date.now() + 60_000),
      });
      usersRepo.findOne.mockResolvedValue(usuario);

      const resultado = await service.verifyEmail('token-email');

      expect(usuario.isEmailVerified).toBe(true);
      expect(usuario.emailVerificationTokenHash).toBeNull();
      expect(resultado.message).toBe('Email verified successfully');
    });

    it('deve lançar BadRequestException se o token não existe', async () => {
      usersRepo.findOne.mockResolvedValue(null);

      await expect(service.verifyEmail('token-falso')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('resendVerification', () => {
    it('deve gerar um novo token quando o e-mail ainda não foi verificado', async () => {
      const usuario = criarUsuario({ isEmailVerified: false });
      usersRepo.findOne.mockResolvedValue(usuario);

      await service.resendVerification('ana@teste.com');

      expect(usuario.emailVerificationTokenHash).toEqual(expect.any(String));
      expect(usersRepo.save).toHaveBeenCalledWith(usuario);
    });

    it('não deve salvar nada quando o e-mail já foi verificado', async () => {
      usersRepo.findOne.mockResolvedValue(criarUsuario());

      const resultado = await service.resendVerification('ana@teste.com');

      expect(usersRepo.save).not.toHaveBeenCalled();
      expect(resultado.message).toContain('If verification is needed');
    });
  });
});