import { api } from "./api";

/** Enum StatusResposta da API (sentinela-api/src/pontuacao/pontuacao.types.ts). */
export type StatusResposta =
  | "CONFORME"
  | "PARCIAL"
  | "NAO_CONFORME"
  | "NAO_SE_APLICA";

export type NivelMaturidade = "CRITICO" | "BAIXO" | "MEDIO" | "ALTO";

export interface DominioEntrada {
  nome: string;
  respostas: StatusResposta[];
}

export interface ResultadoDominio {
  nome: string;
  /** null quando nenhuma pergunta do domínio é aplicável. */
  nota: number | null;
  nivel: NivelMaturidade | null;
  totalPerguntas: number;
  perguntasAplicaveis: number;
  naoSeAplica: number;
}

export interface ResultadoPontuacao {
  notaGeral: number | null;
  nivelGeral: NivelMaturidade | null;
  dominios: ResultadoDominio[];
}

/**
 * POST /pontuacao/calcular.
 *
 * Atenção: pontuacao.types.ts marca os pesos das respostas e os limiares de
 * maturidade como "propostas; validar com a equipe" — o formato da resposta
 * pode mudar.
 */
export function calcularPontuacao(dominios: DominioEntrada[]) {
  return api.post<ResultadoPontuacao>("/pontuacao/calcular", { dominios });
}
