import type { Criticidade } from "../types";
import { ROTULO_CRITICIDADE } from "../lib/servico";

/** Cor por nível de criticidade, em um único lugar. */
const cores: Record<Criticidade, string> = {
  baixa: "bg-emerald-50 text-emerald-700",
  media: "bg-amber-50 text-amber-700",
  alta: "bg-red-50 text-red-700",
};

interface CriticidadeBadgeProps {
  criticidade: Criticidade;
}

export default function CriticidadeBadge({
  criticidade,
}: CriticidadeBadgeProps) {
  return (
    <span
      className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${cores[criticidade]}`}
    >
      {ROTULO_CRITICIDADE[criticidade]}
    </span>
  );
}
