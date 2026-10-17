import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { UsuarioSessao } from "../types";

const CHAVE_SESSAO = "sentinela.sessao";

function lerSessao(): UsuarioSessao | null {
  try {
    const salvo = sessionStorage.getItem(CHAVE_SESSAO);
    return salvo ? (JSON.parse(salvo) as UsuarioSessao) : null;
  } catch {
    sessionStorage.removeItem(CHAVE_SESSAO);
    return null;
  }
}

/**
 * Sessão provisória, guardada no sessionStorage enquanto a API não tem
 * autenticação. A troca para a API real acontece toda dentro deste arquivo:
 * as telas só conhecem `usuario`, `entrar` e `sair`.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSessao | null>(lerSessao);

  // A sessão provisória é lida de forma síncrona, então não há espera.
  // TODO: ao trocar por GET /auth/me, isto volta a ser estado iniciado em
  // true, atualizado quando a resposta chegar — o RotaProtegida já trata
  // esse caso exibindo "Verificando sessão...".
  const carregando = false;

  const entrar = useCallback(async (email: string, _senha: string) => {
    // TODO: trocar por POST /auth/login. A API deve responder com cookie
    // httpOnly — o token nunca deve ser guardado em JavaScript.
    const autenticado: UsuarioSessao = {
      nome: email.split("@")[0],
      email,
      perfil: "Avaliador",
    };
    sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(autenticado));
    setUsuario(autenticado);
  }, []);

  const sair = useCallback(() => {
    // TODO: chamar POST /auth/logout para invalidar a sessão no servidor.
    sessionStorage.removeItem(CHAVE_SESSAO);
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, carregando, entrar, sair }),
    [usuario, carregando, entrar, sair],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
