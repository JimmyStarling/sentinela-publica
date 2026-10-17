import { useCallback, useEffect, useState } from "react";
import type { Servico } from "../types";
import { ApiError } from "../services/api";
import { listarServicos } from "../services/servicos";

/**
 * Carrega GET /servicos, com estado de carregamento e erro. `recarregar` é
 * usado depois de excluir um serviço, para a lista refletir a mudança.
 */
export function useServicos(orgaoId?: number) {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [versao, setVersao] = useState(0);

  const recarregar = useCallback(() => {
    setCarregando(true);
    setVersao((v) => v + 1);
  }, []);

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
  }, [orgaoId, versao]);

  return { servicos, carregando, erro, recarregar };
}
