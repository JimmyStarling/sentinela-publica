import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../services/api";
import { listarOrgaos, type OrgaoApi } from "../services/orgaos";

/**
 * Carrega GET /orgaos, com estado de carregamento e erro. `recarregar` é
 * usado depois de excluir um órgão, para a lista refletir a mudança.
 */
export function useOrgaos() {
  const [orgaos, setOrgaos] = useState<OrgaoApi[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  // Incrementar força o efeito a rodar de novo.
  const [versao, setVersao] = useState(0);

  const recarregar = useCallback(() => {
    setCarregando(true);
    setVersao((v) => v + 1);
  }, []);

  useEffect(() => {
    let ativo = true;

    listarOrgaos()
      .then((dados) => {
        if (!ativo) return;
        setOrgaos(dados);
        setErro(null);
      })
      .catch((motivo: unknown) => {
        if (!ativo) return;
        setErro(
          motivo instanceof ApiError
            ? motivo.message
            : "Erro inesperado ao carregar os órgãos.",
        );
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [versao]);

  return { orgaos, carregando, erro, recarregar };
}
