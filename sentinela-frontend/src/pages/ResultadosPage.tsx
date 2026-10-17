import { FileText } from "lucide-react";
import type { DominioResultado } from "../types";

const resultadoPorDominio: DominioResultado[] = [
  { nome: "Governança e gestão", percentual: 80 },
  { nome: "Controle de acesso", percentual: 60 },
  { nome: "Proteção de dados", percentual: 40 },
  { nome: "Segurança de redes", percentual: 70 },
  { nome: "Resiliência e continuidade", percentual: 50 },
  { nome: "Conformidade e auditoria", percentual: 30 },
];

const lacunas = [
  "Revisar e formalizar a política de segurança da informação.",
  "Reavaliar controles de acesso e revisão periódica de permissões.",
  "Definir procedimentos de continuidade e recuperação.",
  "Documentar evidências e responsáveis pelas ações de melhoria.",
];

function CircularProgress({ valor }: { valor: number }) {
  const raio = 38;
  const circunferencia = 2 * Math.PI * raio;
  const offset = circunferencia - (valor / 100) * circunferencia;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="110" height="110" viewBox="0 0 110 110">
        {/* Anel de fundo */}
        <circle
          cx="55"
          cy="55"
          r={raio}
          fill="none"
          className="stroke-track"
          strokeWidth="11"
        />
        {/* Anel de progresso (3 segmentos visuais como no design) */}
        <circle
          cx="55"
          cy="55"
          r={raio}
          fill="none"
          className="stroke-blue-600"
          strokeWidth="11"
          strokeDasharray={circunferencia}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 55 55)"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[22px] font-bold leading-none text-navy">
          {valor}%
        </span>
      </div>
    </div>
  );
}

export default function ResultadosPage() {
  return (
    <main className="min-h-screen bg-surface px-6 py-7 font-sans text-navy sm:px-10 sm:py-8">
      <div className="mx-auto w-full max-w-205">
        {/* Cabeçalho */}
        <header>
          <p className="text-[13px] font-bold leading-5 tracking-[0.1px]">
            SENTINELA PÚBLICA
          </p>
          <nav
            aria-label="Navegação estrutural"
            className="mt-px flex items-center gap-1 text-[9px] text-muted"
          >
            <span>Resultados</span>
            <span aria-hidden="true">•</span>
            <span>Exemplo ilustrativo com dados fictícios</span>
          </nav>

          <h1 className="mt-2.75 text-[17px] font-bold leading-6 tracking-[-0.3px]">
            Resultado da avaliação
          </h1>
        </header>

        {/* Cards superiores */}
        <div className="mt-3.5 grid grid-cols-1 gap-3.25 md:grid-cols-[220px_1fr]">
          {/* Card: Pontuação geral */}
          <section className="flex flex-col items-center justify-center rounded-[9px] border border-line bg-white px-3.5 py-4">
            <h2 className="mb-2.5 self-start text-[11px] font-bold leading-5">
              Pontuação geral
            </h2>

            <CircularProgress valor={55} />

            <p className="mt-2.5 text-[11px] font-bold text-amber-700">
              Maturidade intermediária
            </p>
          </section>

          {/* Card: Resultado por domínio */}
          <section className="rounded-[9px] border border-line bg-white px-4 pb-4 pt-3.5">
            <h2 className="text-[11px] font-bold leading-5">
              Resultado por domínio
            </h2>

            <ul className="mt-3 flex flex-col gap-2.25">
              {resultadoPorDominio.map((d) => (
                <li key={d.nome} className="flex items-center gap-3">
                  <span className="w-33.75 shrink-0 text-[9px] text-navy">
                    {d.nome}
                  </span>

                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-track">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${d.percentual}%` }}
                    />
                  </div>

                  <span className="w-7.5 shrink-0 text-right text-[9px] font-semibold text-navy">
                    {d.percentual}%
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Card: Lacunas e recomendações */}
        <section className="mt-3.5 rounded-[9px] border border-line bg-white px-4.5 pb-4 pt-3.5">
          <h2 className="text-[12px] font-bold leading-5">
            Lacunas e recomendações prioritárias
          </h2>

          <ul className="mt-2.5 flex flex-col gap-2">
            {lacunas.map((item) => (
              <li
                key={item}
                className="flex items-start gap-1.75 text-[10px] leading-3.75 text-navy"
              >
                <span className="mt-1.25 h-0.75 w-0.75 shrink-0 rounded-full bg-navy" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-4.5 flex justify-end">
            <button
              type="button"
              className="flex h-6.5 items-center gap-2 rounded-sm bg-blue-600 px-4 text-[10px] font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <FileText size={11} />
              Visualizar relatório PDF
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}