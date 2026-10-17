export enum StatusResposta {
  CONFORME = 'CONFORME',
  PARCIAL = 'PARCIAL',
  NAO_CONFORME = 'NAO_CONFORME',
  NAO_SE_APLICA = 'NAO_SE_APLICA',
}

export enum NivelMaturidade {
  CRITICO = 'CRITICO',
  BAIXO = 'BAIXO',
  MEDIO = 'MEDIO',
  ALTO = 'ALTO',
}

// ---- REGRAS DE NEGÓCIO (propostas; validar com a equipe) ----
// Valor de cada resposta no cálculo. "Não se aplica" fica de fora (null).
export const VALOR_RESPOSTA: Record<StatusResposta, number | null> = {
  [StatusResposta.CONFORME]: 1,
  [StatusResposta.PARCIAL]: 0.5,
  [StatusResposta.NAO_CONFORME]: 0,
  [StatusResposta.NAO_SE_APLICA]: null,
};

// Limiar mínimo (inclusivo) de nota, de 0 a 100, para cada nível.
// Ordem decrescente: o primeiro limiar atingido define o nível.
export const LIMIARES_NIVEL: ReadonlyArray<{
  minimo: number;
  nivel: NivelMaturidade;
}> = [
  { minimo: 80, nivel: NivelMaturidade.ALTO },
  { minimo: 60, nivel: NivelMaturidade.MEDIO },
  { minimo: 40, nivel: NivelMaturidade.BAIXO },
  { minimo: 0, nivel: NivelMaturidade.CRITICO },
];

export interface DominioEntrada {
  nome: string;
  respostas: StatusResposta[];
}

export interface ResultadoDominio {
  nome: string;
  nota: number | null; // null = nenhuma pergunta aplicável
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
