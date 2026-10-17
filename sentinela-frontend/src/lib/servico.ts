import type { Criticidade, TipoDado } from "../types";

/** Rótulo de exibição de cada valor que a API aceita. */
export const ROTULO_TIPO_DADO: Record<TipoDado, string> = {
  publico: "Público",
  interno: "Interno",
  pessoal: "Pessoal",
  sensivel: "Sensível",
};

export const ROTULO_CRITICIDADE: Record<Criticidade, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

/** Ordem de exibição nos selects. */
export const TIPOS_DE_DADO: TipoDado[] = [
  "publico",
  "interno",
  "pessoal",
  "sensivel",
];

export const CRITICIDADES: Criticidade[] = ["baixa", "media", "alta"];
