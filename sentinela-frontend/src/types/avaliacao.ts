export type StatusAvaliacao = "Em andamento" | "Concluída";

/**
 * Avaliação de um serviço. As telas consomem recortes deste tipo com `Pick`,
 * porque cada uma exibe um subconjunto diferente dos campos.
 */
export interface Avaliacao {
  id: string;
  orgao: string;
  servico: string;
  inicio: string;
  atualizacao: string;
  status: StatusAvaliacao;
}
