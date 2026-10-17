import { api } from "./api";

/**
 * Formato devolvido por GET /orgaos. Espelha a entidade Orgao da API —
 * note que findAll() não carrega a relação `servicos`, então a listagem não
 * traz contagem de serviços, nem existe `sigla` na API.
 */
export interface OrgaoApi {
  id: number;
  nome: string;
  responsavel: string;
  criadoEm: string;
  atualizadoEm: string;
}

/** GET /orgaos — ordenado por nome. */
export function listarOrgaos() {
  return api.get<OrgaoApi[]>("/orgaos");
}

/**
 * POST /orgaos — a API aceita apenas `nome` e `responsavel`. Como main.ts usa
 * forbidNonWhitelisted, enviar qualquer outro campo resulta em 400.
 * Responde 409 se já existir órgão com o mesmo nome.
 */
export function criarOrgao(dados: { nome: string; responsavel: string }) {
  return api.post<OrgaoApi>("/orgaos", dados);
}

/** GET /orgaos/:id — carrega a relação `servicos`. Responde 404 se não existir. */
export function buscarOrgao(id: number) {
  return api.get<OrgaoApi>(`/orgaos/${id}`);
}

/** PATCH /orgaos/:id — aceita os mesmos campos do POST, todos opcionais. */
export function atualizarOrgao(
  id: number,
  dados: { nome?: string; responsavel?: string },
) {
  return api.patch<OrgaoApi>(`/orgaos/${id}`, dados);
}

/**
 * DELETE /orgaos/:id — responde 200 com corpo vazio.
 *
 * A relação em `Servico` usa onDelete: 'RESTRICT'. Excluir um órgão que ainda
 * tem serviços viola a chave estrangeira, e o DatabaseExceptionFilter da API
 * traduz isso em 409 ("existem registros relacionados"). A tela checa antes
 * mesmo assim, para dizer quantos serviços estão vinculados.
 */
export function excluirOrgao(id: number) {
  return api.remove<void>(`/orgaos/${id}`);
}
