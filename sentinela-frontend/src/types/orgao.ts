export interface Orgao {
  id: string;
  nome: string;
  sigla: string;
  responsavel: string;
  /** Quantidade de serviços vinculados ao órgão. */
  servicos: number;
}

/** Campos do formulário de cadastro de órgão. */
export interface OrgaoForm {
  nome: string;
  esfera: string;
  cnpj: string;
  endereco: string;
  responsavel: string;
  descricao: string;
}
