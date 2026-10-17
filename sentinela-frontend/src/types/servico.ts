/**
 * Valores aceitos pela API. Espelham os enums de
 * sentinela-api/src/servicos/entities/servico.entity.ts — não são rótulos de
 * exibição; estes ficam em src/lib/servico.ts.
 */
export type TipoDado = "publico" | "interno" | "pessoal" | "sensivel";

export type Criticidade = "baixa" | "media" | "alta";

export interface Servico {
  id: string;
  nome: string;
  /** Nome do órgão ao qual o serviço está vinculado. */
  orgao: string;
  responsavel: string;
  tipoDado: TipoDado;
  criticidade: Criticidade;
}

/** Campos do formulário de cadastro de serviço. */
export interface ServicoForm {
  orgao: string;
  nome: string;
  descricao: string;
  tipoDado: TipoDado | "";
  criticidade: Criticidade | "";
  responsavel: string;
}
