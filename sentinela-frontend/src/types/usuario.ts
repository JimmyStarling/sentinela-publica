/** Perfis de acesso previstos no RF-01. */
export type PerfilUsuario = "Administrador" | "Avaliador" | "Gestor do órgão";

export type StatusUsuario = "Ativo" | "Inativo";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  status: StatusUsuario;
}

/** Dados do usuário autenticado que a sessão mantém em memória. */
export type UsuarioSessao = Pick<Usuario, "nome" | "email" | "perfil">;
