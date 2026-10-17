import { Test, TestingModule } from '@nestjs/testing';
import { ServicosController } from './servicos.controller';
import { ServicosService } from './servicos.service';
import { Criticidade, TipoDado } from './entities/servico.entity';

// O controller só repassa a chamada para o ServicosService.
// O service é falso: conferimos os argumentos e o retorno.
describe('ServicosController', () => {
  let controller: ServicosController;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const servicoExemplo = {
    id: 10,
    nome: 'Portal do Contribuinte',
    responsavel: 'Bruno',
    tipoDado: TipoDado.PESSOAL,
    criticidade: Criticidade.MEDIA,
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicosController],
      providers: [{ provide: ServicosService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ServicosController>(ServicosController);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('create: deve repassar o dto ao service', async () => {
    const dto = {
      nome: 'Portal do Contribuinte',
      responsavel: 'Bruno',
      tipoDado: TipoDado.PESSOAL,
      criticidade: Criticidade.MEDIA,
      orgaoId: 1,
    };
    serviceMock.create.mockResolvedValue(servicoExemplo);

    const resultado = await controller.create(dto);

    expect(serviceMock.create).toHaveBeenCalledWith(dto);
    expect(resultado).toEqual(servicoExemplo);
  });

  it('findAll: sem filtro, deve chamar o service sem orgaoId', async () => {
    serviceMock.findAll.mockResolvedValue([servicoExemplo]);

    const resultado = await controller.findAll();

    expect(serviceMock.findAll).toHaveBeenCalledWith(undefined);
    expect(resultado).toEqual([servicoExemplo]);
  });

  it('findAll: com filtro, deve repassar o orgaoId ao service', async () => {
    serviceMock.findAll.mockResolvedValue([servicoExemplo]);

    const resultado = await controller.findAll(1);

    expect(serviceMock.findAll).toHaveBeenCalledWith(1);
    expect(resultado).toEqual([servicoExemplo]);
  });

  it('findOne: deve repassar o id ao service', async () => {
    serviceMock.findOne.mockResolvedValue(servicoExemplo);

    const resultado = await controller.findOne(10);

    expect(serviceMock.findOne).toHaveBeenCalledWith(10);
    expect(resultado).toEqual(servicoExemplo);
  });

  it('update: deve repassar o id e o dto ao service', async () => {
    const dto = { criticidade: Criticidade.ALTA };
    serviceMock.update.mockResolvedValue({ ...servicoExemplo, ...dto });

    const resultado = await controller.update(10, dto);

    expect(serviceMock.update).toHaveBeenCalledWith(10, dto);
    expect(resultado).toEqual({
      ...servicoExemplo,
      criticidade: Criticidade.ALTA,
    });
  });

  it('remove: deve repassar o id ao service', async () => {
    serviceMock.remove.mockResolvedValue(undefined);

    await controller.remove(10);

    expect(serviceMock.remove).toHaveBeenCalledWith(10);
  });
});