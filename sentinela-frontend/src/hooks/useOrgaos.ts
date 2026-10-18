import { useEffect, useState } from "react";
import { ApiError } from "../services/api";
import { listarOrgaos, type OrgaoApi } from "../services/orgaos";

/** Carrega GET /orgaos uma vez, com estado de carregamento e erro. */
export function useOrgaos() {
  const [orgaos, setOrgaos] = useState<OrgaoApi[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

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
  }, []);

  return { orgaos, carregando, erro };
}
