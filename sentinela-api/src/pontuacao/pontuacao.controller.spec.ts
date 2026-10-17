import { Test, TestingModule } from '@nestjs/testing';
import { PontuacaoController } from './pontuacao.controller';
import { PontuacaoService } from './pontuacao.service';
import { NivelMaturidade, StatusResposta } from './pontuacao.types';

// O cálculo em si já é testado no pontuacao.service.spec.ts.
// Aqui só conferimos que o controller entrega os domínios ao service
// e devolve o resultado dele.
describe('PontuacaoController', () => {
  let controller: PontuacaoController;

  const serviceMock = { calcular: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PontuacaoController],
      providers: [{ provide: PontuacaoService, useValue: serviceMock }],
    }).compile();

    controller = module.get<PontuacaoController>(PontuacaoController);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('calcular: deve repassar os domínios ao service e devolver o resultado', () => {
    const dto = {
      dominios: [
        { nome: 'Acesso', respostas: [StatusResposta.CONFORME] },
      ],
    };
    const resultadoFalso = {
      notaGeral: 100,
      nivelGeral: NivelMaturidade.ALTO,
      dominios: [],
    };
    serviceMock.calcular.mockReturnValue(resultadoFalso);

    const resultado = controller.calcular(dto);

    expect(serviceMock.calcular).toHaveBeenCalledWith(dto.dominios);
    expect(resultado).toEqual(resultadoFalso);
  });
});