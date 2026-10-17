/**
 * Campos do formulário de cadastro de órgão, espelhando o CreateOrgaoDto da
 * API — os dois são obrigatórios e limitados a 150 caracteres.
 */
export interface OrgaoForm {
  nome: string;
  responsavel: string;
}
