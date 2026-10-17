import type { NivelMaturidade } from "../services/pontuacao";

/**
 * Rótulos de exibição dos níveis de maturidade. Os valores crus vêm do enum
 * NivelMaturidade da API; aqui ficam só os textos e cores da interface.
 */
export const ROTULO_NIVEL: Record<NivelMaturidade, string> = {
  CRITICO: "Maturidade crítica",
  BAIXO: "Maturidade baixa",
  MEDIO: "Maturidade intermediária",
  ALTO: "Maturidade alta",
};

export const COR_NIVEL: Record<NivelMaturidade, string> = {
  CRITICO: "text-red-700",
  BAIXO: "text-orange-700",
  MEDIO: "text-amber-700",
  ALTO: "text-green-700",
};
