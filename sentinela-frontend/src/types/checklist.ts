export type StatusVersao = "Ativa" | "Arquivada";

/** Versão do checklist (RF-10). */
export interface Versao {
  id: string;
  versao: string;
  dataCriacao: string;
  status: StatusVersao;
  descricao: string;
  acao: "Editar" | "Visualizar";
}

/** Domínio de perguntas do checklist. */
export interface Dominio {
  id: number;
  titulo: string;
}

/** Pontuação de um domínio no resultado da avaliação (RF-05). */
export interface DominioResultado {
  nome: string;
  percentual: number;
}
