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
