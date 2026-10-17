import { createContext, useContext } from "react";
import type { UsuarioSessao } from "../types";

export interface AuthContextValue {
  usuario: UsuarioSessao | null;
  /** True enquanto a sessão existente ainda está sendo verificada. */
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth precisa ser usado dentro de <AuthProvider>.");
  }
  return contexto;
}
