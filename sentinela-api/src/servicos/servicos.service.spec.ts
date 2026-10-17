import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServicosService } from './servicos.service';
import { Criticidade, Servico, TipoDado } from './entities/servico.entity';
import { OrgaosService } from '../orgaos/orgaos.service';
import { Orgao } from '../orgaos/entities/orgao.entity';

describe('ServicosService', () => {
  let service: ServicosService;

  // Repositório falso do TypeORM (no lugar do banco de verdade)
  const repoMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  // O ServicosService também depende do OrgaosService (para buscar o órgão
  // do serviço). Aqui ele também vira um falso: só precisamos do findOne.
  const orgaosMock = {
    findOne: jest.fn(),
  };

  // Dados de exemplo
  const orgaoExemplo = {
    id: 1,
    nome: 'Prefeitura de Salvador',
    responsavel: 'Ana Souza',
  } as Orgao;

  const servicoExemplo = {
    id: 10,
    nome: 'Portal do Contribuinte',
    responsavel: 'Bruno Lima',
    tipoDado: TipoDado.PESSOAL,
    criticidade: Criticidade.MEDIA,
    orgao: orgaoExemplo,
  } as Servico;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicosService,
        { provide: getRepositoryToken(Servico), useValue: repoMock },
        { provide: OrgaosService, useValue: orgaosMock },
      ],
    }).compile();

    service = module.get<ServicosService>(ServicosService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve buscar o órgão e salvar o serviço ligado a ele', async () => {
      const dto = {
        nome: 'Portal do Contribuinte',
        responsavel: 'Bruno Lima',
        tipoDado: TipoDado.PESSOAL,
        criticidade: Criticidade.MEDIA,
        orgaoId: 1,
      };
      orgaosMock.findOne.mockResolvedValue(orgaoExemplo);
      repoMock.create.mockReturnValue(servicoExemplo);
      repoMock.save.mockResolvedValue(servicoExemplo);

      const resultado = await service.create(dto);

      expect(orgaosMock.findOne).toHaveBeenCalledWith(1);
      // o orgaoId some e entra o objeto "orgao" no lugar
      expect(repoMock.create).toHaveBeenCalledWith({
        nome: 'Portal do Contribuinte',
        responsavel: 'Bruno Lima',
        tipoDado: TipoDado.PESSOAL,
        criticidade: Criticidade.MEDIA,
        orgao: orgaoExemplo,
      });
      expect(repoMock.save).toHaveBeenCalledWith(servicoExemplo);
      expect(resultado).toEqual(servicoExemplo);
    });
  });

  describe('findAll', () => {
    it('deve listar todos os serviços quando não há filtro', async () => {
      repoMock.find.mockResolvedValue([servicoExemplo]);

      const resultado = await service.findAll();

      expect(repoMock.find).toHaveBeenCalledWith({
        where: {},
        relations: { orgao: true },
      });
      expect(resultado).toEqual([servicoExemplo]);
    });

    it('deve filtrar pelo órgão quando o orgaoId é informado', async () => {
      repoMock.find.mockResolvedValue([servicoExemplo]);

      const resultado = await service.findAll(1);

      expect(repoMock.find).toHaveBeenCalledWith({
        where: { orgao: { id: 1 } },
        relations: { orgao: true },
      });
      expect(resultado).toEqual([servicoExemplo]);
    });
  });

  describe('findOne', () => {
    it('deve retornar o serviço (com o órgão) quando o id existe', async () => {
      repoMock.findOne.mockResolvedValue(servicoExemplo);

      const resultado = await service.findOne(10);

      expect(repoMock.findOne).toHaveBeenCalledWith({
        where: { id: 10 },
        relations: { orgao: true },
      });
      expect(resultado).toEqual(servicoExemplo);
    });
  });

  describe('update', () => {
    it('deve atualizar só os campos enviados e manter o órgão', async () => {
      // cópia, para o teste não alterar o objeto de exemplo
      repoMock.findOne.mockResolvedValue({ ...servicoExemplo });
      repoMock.save.mockImplementation((s: Servico) => Promise.resolve(s));

      const resultado = await service.update(10, {
        criticidade: Criticidade.ALTA,
      });

      expect(orgaosMock.findOne).not.toHaveBeenCalled(); // não mudou o órgão
      expect(resultado.criticidade).toBe(Criticidade.ALTA); // mudou
      expect(resultado.nome).toBe('Portal do Contribuinte'); // continua igual
      expect(resultado.orgao).toEqual(orgaoExemplo);
    });

    it('deve trocar o órgão quando o orgaoId é informado', async () => {
      const outroOrgao = { id: 2, nome: 'Câmara Municipal' } as Orgao;
      repoMock.findOne.mockResolvedValue({ ...servicoExemplo });
      orgaosMock.findOne.mockResolvedValue(outroOrgao);
      repoMock.save.mockImplementation((s: Servico) => Promise.resolve(s));

      const resultado = await service.update(10, { orgaoId: 2 });

      expect(orgaosMock.findOne).toHaveBeenCalledWith(2);
      expect(resultado.orgao).toEqual(outroOrgao);
    });
  });

  describe('remove', () => {
    it('deve remover o serviço quando o id existe', async () => {
      repoMock.findOne.mockResolvedValue(servicoExemplo);
      repoMock.remove.mockResolvedValue(servicoExemplo);

      await service.remove(10);

      expect(repoMock.remove).toHaveBeenCalledWith(servicoExemplo);
    });
  });
});