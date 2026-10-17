// =============================================================================
// MODELO de arquivo .spec.ts para um SERVICE do Nest que usa um repositório
// do TypeORM (como OrgaosService e ServicosService).
//
// COMO USAR:
//   1. Copie este arquivo para a MESMA pasta da classe, com o nome
//      <nome-da-classe>.spec.ts  (ex.: src/orgaos/orgaos.service.spec.ts)
//   2. Troque os nomes marcados com  <<< TROCAR
//   3. Apague os comentários que não precisar.
//
// ATENÇÃO: com os nomes de exemplo (NomeDoService etc.) este arquivo NÃO
// compila. Se deixar assim dentro de src/, o `npm test` vai dar erro.
// =============================================================================

// ---- 1) IMPORTS --------------------------------------------------------------
import { Test, TestingModule } from '@nestjs/testing'; // monta o mini módulo de teste
import { getRepositoryToken } from '@nestjs/typeorm'; // "nome" do repositório para trocar pelo falso
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NomeDoService } from './nome-do.service'; // <<< TROCAR: a classe testada
import { NomeDaEntity } from './entities/nome-da.entity'; // <<< TROCAR: a entity do service

// ---- 2) GRUPO DE TESTES DA CLASSE -------------------------------------------
describe('NomeDoService', () => {
  // <<< TROCAR o texto: nome da classe
  let service: NomeDoService; // <<< TROCAR o tipo

  // ---- 3) DEPENDÊNCIAS FALSAS (MOCKS) ----------------------------------------
  // Liste só os métodos do repositório que o service realmente usa.
  // Cada jest.fn() é uma função espiã: você diz o que ela devolve e depois
  // confere se foi chamada do jeito certo.
  const repoMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  // Se o service depende de OUTRA classe (ex.: ServicosService usa
  // OrgaosService), crie um mock dela também:
  // const outroServiceMock = { findOne: jest.fn() };

  // ---- 4) PREPARAÇÃO: roda ANTES de cada teste -------------------------------
  beforeEach(async () => {
    jest.resetAllMocks(); // zera os mocks para um teste não afetar o outro

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NomeDoService, // <<< TROCAR: a classe REAL que está sendo testada
        { provide: getRepositoryToken(NomeDaEntity), useValue: repoMock }, // <<< TROCAR a entity
        // { provide: OutroService, useValue: outroServiceMock },
      ],
    }).compile();

    service = module.get<NomeDoService>(NomeDoService); // <<< TROCAR
  });

  // ---- 5) TESTES -------------------------------------------------------------
  // Teste mais simples: a classe foi criada?
  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  // Um describe por método, e um it por situação.
  describe('nomeDoMetodo', () => {
    // <<< TROCAR: nome do método testado
    it('deve [resultado esperado] quando [situação]', async () => {
      // ARRANGE (preparar): diga o que os mocks devolvem
      repoMock.findOne.mockResolvedValue({ id: 1, nome: 'Exemplo' });

      // ACT (agir): chame o método com a entrada escolhida
      const resultado = await service.nomeDoMetodo(1); // <<< TROCAR

      // ASSERT (verificar): confira o resultado e as chamadas
      expect(resultado).toEqual({ id: 1, nome: 'Exemplo' });
      expect(repoMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    // ---- TESTE DE ERRO (para a próxima etapa) ---------------------------------
    // Quando o esperado é uma exceção, use rejects.toThrow:
    //
    // it('deve lançar NotFoundException quando o id não existe', async () => {
    //   repoMock.findOne.mockResolvedValue(null);
    //   await expect(service.nomeDoMetodo(99)).rejects.toThrow(NotFoundException);
    // });
  });
});

// ---- RESUMO DAS FUNÇÕES MAIS USADAS -----------------------------------------
// mockResolvedValue(x)  -> a função falsa devolve x (para métodos async)
// mockReturnValue(x)    -> a função falsa devolve x (para métodos normais)
// expect(a).toBe(b)             -> igualdade simples (números, textos)
// expect(a).toEqual(b)          -> compara o conteúdo de objetos e listas
// expect(fn).toHaveBeenCalledWith(...) -> a função foi chamada com esses argumentos
// await expect(promessa).rejects.toThrow(Erro) -> a chamada deve lançar o erro