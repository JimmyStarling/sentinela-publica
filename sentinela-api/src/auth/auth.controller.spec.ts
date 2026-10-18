import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import type { IAuthenticatedRequest } from './auth.interface';

// O controller só recebe a requisição e repassa para o AuthService.
// Por isso o service é falso, e cada teste confere duas coisas:
//   1) o service foi chamado com os argumentos certos
//   2) o controller devolveu o que o service devolveu
describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    register: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
    getProfile: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    changePassword: jest.fn(),
    verifyEmail: jest.fn(),
    resendVerification: jest.fn(),
  };

  // Requisição de um usuário já logado (o guard coloca o "user" nela)
  const req = {
    user: { id: 'user-1', email: 'ana@teste.com' },
  } as unknown as IAuthenticatedRequest;

  const respostaFalsa = { ok: true };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    })
      // As rotas protegidas usam o guard de JWT. Nos testes unitários a gente
      // libera ele, porque aqui só interessa o que o controller faz.
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('register: deve repassar o dto ao service', async () => {
    const dto = {
      name: 'Ana Souza',
      email: 'ana@teste.com',
      password: 'senha-bem-grande-123',
    };
    authServiceMock.register.mockResolvedValue(respostaFalsa);

    const resultado = await controller.register(dto);

    expect(authServiceMock.register).toHaveBeenCalledWith(dto);
    expect(resultado).toEqual(respostaFalsa);
  });

  it('login: deve repassar o dto ao service', async () => {
    const dto = { email: 'ana@teste.com', password: 'senha-certa' };
    authServiceMock.login.mockResolvedValue(respostaFalsa);

    const resultado = await controller.login(dto);

    expect(authServiceMock.login).toHaveBeenCalledWith(dto);
    expect(resultado).toEqual(respostaFalsa);
  });

  it('refresh: deve repassar só o refreshToken ao service', async () => {
    authServiceMock.refreshToken.mockResolvedValue(respostaFalsa);

    const resultado = await controller.refresh({ refreshToken: 'meu-refresh' });

    expect(authServiceMock.refreshToken).toHaveBeenCalledWith('meu-refresh');
    expect(resultado).toEqual(respostaFalsa);
  });

  it('logout: deve usar o id do usuário logado', async () => {
    authServiceMock.logout.mockResolvedValue(respostaFalsa);

    const resultado = await controller.logout(req);

    expect(authServiceMock.logout).toHaveBeenCalledWith({ sub: 'user-1' });
    expect(resultado).toEqual(respostaFalsa);
  });

  it('getProfile: deve usar o id do usuário logado', async () => {
    authServiceMock.getProfile.mockResolvedValue(respostaFalsa);

    const resultado = await controller.getProfile(req);

    expect(authServiceMock.getProfile).toHaveBeenCalledWith({ sub: 'user-1' });
    expect(resultado).toEqual(respostaFalsa);
  });

  it('forgotPassword: deve repassar o e-mail ao service', async () => {
    authServiceMock.forgotPassword.mockResolvedValue(respostaFalsa);

    const resultado = await controller.forgotPassword('ana@teste.com');

    expect(authServiceMock.forgotPassword).toHaveBeenCalledWith('ana@teste.com');
    expect(resultado).toEqual(respostaFalsa);
  });

  it('resetPassword: deve repassar token e senha nova ao service', async () => {
    authServiceMock.resetPassword.mockResolvedValue(respostaFalsa);

    const resultado = await controller.resetPassword('meu-token', 'senha-nova');

    expect(authServiceMock.resetPassword).toHaveBeenCalledWith(
      'meu-token',
      'senha-nova',
    );
    expect(resultado).toEqual(respostaFalsa);
  });

  it('changePassword: deve usar o id do usuário e as duas senhas', async () => {
    authServiceMock.changePassword.mockResolvedValue(respostaFalsa);

    const resultado = await controller.changePassword(
      req,
      'senha-atual',
      'senha-nova',
    );

    expect(authServiceMock.changePassword).toHaveBeenCalledWith(
      { sub: 'user-1' },
      'senha-atual',
      'senha-nova',
    );
    expect(resultado).toEqual(respostaFalsa);
  });

  it('verifyEmail: deve repassar o token ao service', async () => {
    authServiceMock.verifyEmail.mockResolvedValue(respostaFalsa);

    const resultado = await controller.verifyEmail('token-email');

    expect(authServiceMock.verifyEmail).toHaveBeenCalledWith('token-email');
    expect(resultado).toEqual(respostaFalsa);
  });

  it('resendVerification: deve repassar o e-mail ao service', async () => {
    authServiceMock.resendVerification.mockResolvedValue(respostaFalsa);

    const resultado = await controller.resendVerification('ana@teste.com');

    expect(authServiceMock.resendVerification).toHaveBeenCalledWith(
      'ana@teste.com',
    );
    expect(resultado).toEqual(respostaFalsa);
  });
});