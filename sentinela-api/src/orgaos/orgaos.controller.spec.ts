import { Test, TestingModule } from '@nestjs/testing';
import { OrgaosController } from './orgaos.controller';
import { OrgaosService } from './orgaos.service';

// O controller só repassa a chamada para o OrgaosService.
// O service é falso: conferimos os argumentos e o retorno.
describe('OrgaosController', () => {
  let controller: OrgaosController;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const orgaoExemplo = { id: 1, nome: 'Prefeitura', responsavel: 'Ana' };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgaosController],
      providers: [{ provide: OrgaosService, useValue: serviceMock }],
    }).compile();

    controller = module.get<OrgaosController>(OrgaosController);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('create: deve repassar o dto ao service', async () => {
    const dto = { nome: 'Prefeitura', responsavel: 'Ana' };
    serviceMock.create.mockResolvedValue(orgaoExemplo);

    const resultado = await controller.create(dto);

    expect(serviceMock.create).toHaveBeenCalledWith(dto);
    expect(resultado).toEqual(orgaoExemplo);
  });

  it('findAll: deve devolver a lista do service', async () => {
    serviceMock.findAll.mockResolvedValue([orgaoExemplo]);

    const resultado = await controller.findAll();

    expect(serviceMock.findAll).toHaveBeenCalled();
    expect(resultado).toEqual([orgaoExemplo]);
  });

  it('findOne: deve repassar o id ao service', async () => {
    serviceMock.findOne.mockResolvedValue(orgaoExemplo);

    const resultado = await controller.findOne(1);

    expect(serviceMock.findOne).toHaveBeenCalledWith(1);
    expect(resultado).toEqual(orgaoExemplo);
  });

  it('update: deve repassar o id e o dto ao service', async () => {
    const dto = { responsavel: 'Carlos' };
    serviceMock.update.mockResolvedValue({ ...orgaoExemplo, ...dto });

    const resultado = await controller.update(1, dto);

    expect(serviceMock.update).toHaveBeenCalledWith(1, dto);
    expect(resultado).toEqual({ ...orgaoExemplo, responsavel: 'Carlos' });
  });

  it('remove: deve repassar o id ao service', async () => {
    serviceMock.remove.mockResolvedValue(undefined);

    await controller.remove(1);

    expect(serviceMock.remove).toHaveBeenCalledWith(1);
  });
});