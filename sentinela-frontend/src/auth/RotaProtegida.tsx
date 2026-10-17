import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Impede que telas internas sejam abertas sem sessão, inclusive quando a URL
 * é digitada direto no navegador.
 *
 * Atenção: isto é controle de navegação, não de segurança — roda no
 * navegador do usuário. A proteção real tem de estar nos guards da API.
 */
export default function RotaProtegida() {
  const { usuario, carregando } = useAuth();
  const location = useLocation();

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface font-sans text-sm text-slate-500">
        Verificando sessão...
      </div>
    );
  }

  if (!usuario) {
    // Guarda a rota pedida para retomá-la depois do login.
    return <Navigate to="/" replace state={{ de: location.pathname }} />;
  }

  return <Outlet />;
}
