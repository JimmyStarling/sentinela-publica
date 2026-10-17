import { useEffect, useState } from "react";
import type { Servico } from "../types";
import { ApiError } from "../services/api";
import { listarServicos } from "../services/servicos";

/** Carrega GET /servicos uma vez, com estado de carregamento e erro. */
export function useServicos(orgaoId?: number) {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    // Evita atualizar o estado se o componente sair antes da resposta.
    let ativo = true;

    listarServicos(orgaoId)
      .then((dados) => {
        if (!ativo) return;
        setServicos(dados);
        setErro(null);
      })
      .catch((motivo: unknown) => {
        if (!ativo) return;
        setErro(
          motivo instanceof ApiError
            ? motivo.message
            : "Erro inesperado ao carregar os serviços.",
        );
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [orgaoId]);

  return { servicos, carregando, erro };
}
