import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrgaosService } from './orgaos.service';
import { Orgao } from './entities/orgao.entity';

describe('OrgaosService', () => {
  let service: OrgaosService;

  // Repositório FALSO. O service usa o repositório do TypeORM (que fala com o
  // banco). Nos testes unitários a gente troca ele por funções "espiãs"
  // (jest.fn) e controla o que cada uma devolve. Assim não precisa de banco.
  const repoMock = {
    existsBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  // Dados que serão reuilizados por odo teste ate sua remoção
  const orgaoExemplo = {
    id: 1,
    nome: 'Prefeitura de Salvador',
    responsavel: 'Ana Souza',
  } as Orgao;

  // Roda ANTES de cada teste: limpa os mocks e monta um módulo novo do Nest
  // contendo só o OrgaosService, com o repositório falso no lugar do real.
  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrgaosService,
        { provide: getRepositoryToken(Orgao), useValue: repoMock },
      ],
    }).compile();

    service = module.get<OrgaosService>(OrgaosService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar e salvar um órgão novo', async () => {
      const dto = { nome: 'Prefeitura de Salvador', responsavel: 'Ana Souza' };
      repoMock.existsBy.mockResolvedValue(false); // nome ainda não existe
      repoMock.create.mockReturnValue(orgaoExemplo);
      repoMock.save.mockResolvedValue(orgaoExemplo);

      const resultado = await service.create(dto);

      expect(repoMock.existsBy).toHaveBeenCalledWith({ nome: dto.nome });
      expect(repoMock.create).toHaveBeenCalledWith(dto);
      expect(repoMock.save).toHaveBeenCalledWith(orgaoExemplo);
      expect(resultado).toEqual(orgaoExemplo);
    });
  });

  describe('findAll', () => {
    it('deve retornar a lista de órgãos ordenada por nome', async () => {
      const lista = [
        { id: 1, nome: 'Câmara Municipal', responsavel: 'Bruno' },
        { id: 2, nome: 'Prefeitura de Salvador', responsavel: 'Ana' },
      ] as Orgao[];
      repoMock.find.mockResolvedValue(lista);

      const resultado = await service.findAll();

      expect(repoMock.find).toHaveBeenCalledWith({ order: { nome: 'ASC' } });
      expect(resultado).toEqual(lista); 
    });
  });

  describe('findOne', () => {
    it('deve retornar o órgão (com seus serviços) quando o id existe', async () => {
      repoMock.findOne.mockResolvedValue(orgaoExemplo);

      const resultado = await service.findOne(1);

      expect(repoMock.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { servicos: true },
      });
      expect(resultado).toEqual(orgaoExemplo);
    });
  });

  describe('update', () => {
    it('deve atualizar os campos enviados e manter os demais', async () => {
      // cópia, para o teste não alterar o objeto de exemplo
      repoMock.findOne.mockResolvedValue({ ...orgaoExemplo });
      // o save devolve o próprio objeto que recebeu
      repoMock.save.mockImplementation((orgao: Orgao) => Promise.resolve(orgao));

      const resultado = await service.update(1, { responsavel: 'Carlos Lima' });

      expect(repoMock.save).toHaveBeenCalled();
      expect(resultado.responsavel).toBe('Carlos Lima'); // mudou
      expect(resultado.nome).toBe('Prefeitura de Salvador'); // continua igual
    });
  });

  describe('remove', () => {
    it('deve remover o órgão quando o id existe', async () => {
      repoMock.findOne.mockResolvedValue(orgaoExemplo);
      repoMock.remove.mockResolvedValue(orgaoExemplo);

      await service.remove(1);

      expect(repoMock.remove).toHaveBeenCalledWith(orgaoExemplo);
    });
  });
});