import type { Criticidade, Servico, TipoDado } from "../types";
import { api } from "./api";
import type { OrgaoApi } from "./orgaos";

/** Formato devolvido por GET /servicos — o órgão vem aninhado. */
export interface ServicoApi {
  id: number;
  nome: string;
  responsavel: string;
  tipoDado: TipoDado;
  criticidade: Criticidade;
  orgao: OrgaoApi;
  criadoEm: string;
  atualizadoEm: string;
}

/** Converte o formato da API no tipo que as telas usam. */
function paraServico(bruto: ServicoApi): Servico {
  return {
    id: String(bruto.id),
    nome: bruto.nome,
    orgao: bruto.orgao.nome,
    orgaoId: bruto.orgao.id,
    responsavel: bruto.responsavel,
    tipoDado: bruto.tipoDado,
    criticidade: bruto.criticidade,
  };
}

/** GET /servicos — aceita filtro opcional por órgão. */
export async function listarServicos(orgaoId?: number): Promise<Servico[]> {
  const query = orgaoId === undefined ? "" : `?orgaoId=${orgaoId}`;
  const resposta = await api.get<ServicoApi[]>(`/servicos${query}`);
  return resposta.map(paraServico);
}

/**
 * POST /servicos — a API aceita nome, responsavel, tipoDado, criticidade e
 * orgaoId. O campo `descricao` do formulário não existe na entidade e, com
 * forbidNonWhitelisted, enviá-lo resulta em 400. Responde 404 se o órgão
 * informado não existir.
 */
export function criarServico(dados: {
  nome: string;
  responsavel: string;
  tipoDado: TipoDado;
  criticidade: Criticidade;
  orgaoId: number;
}) {
  return api.post<ServicoApi>("/servicos", dados);
}

/** GET /servicos/:id — o órgão vem aninhado. Responde 404 se não existir. */
export function buscarServico(id: number) {
  return api.get<ServicoApi>(`/servicos/${id}`);
}

/** PATCH /servicos/:id — aceita os mesmos campos do POST, todos opcionais. */
export function atualizarServico(
  id: number,
  dados: {
    nome?: string;
    responsavel?: string;
    tipoDado?: TipoDado;
    criticidade?: Criticidade;
    orgaoId?: number;
  },
) {
  return api.patch<ServicoApi>(`/servicos/${id}`, dados);
}

/** DELETE /servicos/:id — responde 200 com corpo vazio. */
export function excluirServico(id: number) {
  return api.remove<void>(`/servicos/${id}`);
}
