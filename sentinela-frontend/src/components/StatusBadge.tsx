import type { StatusAvaliacao, StatusUsuario, StatusVersao } from "../types";

type Status = StatusAvaliacao | StatusUsuario | StatusVersao;

/**
 * Cor de cada status, em um único lugar. Antes este mapa estava copiado em
 * quatro páginas, o que fez "Concluída" sair em dois verdes diferentes.
 */
const cores: Record<Status, string> = {
  "Em andamento": "text-blue-600",
  Concluída: "text-emerald-600",
  Ativo: "text-emerald-600",
  Inativo: "text-orange-500",
  Ativa: "text-emerald-600",
  Arquivada: "text-slate-500",
};

interface StatusBadgeProps {
  status: Status;
  /** Tipografia da tela que usa o badge. */
  className?: string;
}

export default function StatusBadge({
  status,
  className = "text-sm font-semibold",
}: StatusBadgeProps) {
  return <span className={`${className} ${cores[status]}`}>{status}</span>;
}
