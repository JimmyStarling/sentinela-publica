import Sidebar from "../components/Sidebar";
import StatusBadge from "../components/StatusBadge";
import type { Avaliacao as AvaliacaoBase } from "../types";

/** Recorte exibido no painel: só o essencial de cada avaliação recente. */
type Avaliacao = Pick<
  AvaliacaoBase,
  "orgao" | "servico" | "status" | "atualizacao"
>;

const resumo = [
  { label: "Órgãos cadastrados", valor: "05" },
  { label: "Serviços cadastrados", valor: "12" },
  { label: "Avaliações em andamento", valor: "03" },
  { label: "Avaliações concluídas", valor: "07" },
];

const avaliacoes: Avaliacao[] = [
  {
    orgao: "Secretaria de Educação",
    servico: "Portal do Aluno",
    status: "Em andamento",
    atualizacao: "15/10/2026",
  },
  {
    orgao: "Secretaria de Saúde",
    servico: "Agendamento de consultas",
    status: "Concluída",
    atualizacao: "10/10/2026",
  },
  {
    orgao: "Prefeitura Municipal",
    servico: "Sistema de protocolo",
    status: "Em andamento",
    atualizacao: "08/10/2026",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-surface font-sans text-navy">
      <Sidebar />

      <main className="flex-1 px-9 py-8">
        <div className="max-w-190">
          <p className="text-xs font-semibold text-slate-500">
            Sentinela Pública
          </p>
          <h1 className="mt-5 text-3xl font-bold tracking-tight">
            Olá, Avaliador!
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Aqui está um resumo das suas avaliações.
          </p>

          {/* Cartões de resumo */}
          <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {resumo.map(({ label, valor }) => (
              <div
                key={label}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-3"
              >
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-bold">{valor}</p>
              </div>
            ))}
          </section>

          {/* Avaliações recentes */}
          <section className="mt-8">
            <h2 className="text-lg font-bold">Avaliações recentes</h2>

            <div className="mt-4 grid grid-cols-3 rounded-lg bg-subtle px-3.5 py-3 text-xs font-semibold text-slate-500">
              <span>Órgão / Serviço</span>
              <span>Status</span>
              <span>Última atualização</span>
            </div>

            <ul className="mt-3 flex flex-col gap-2">
              {avaliacoes.map((a) => (
                <li
                  key={`${a.orgao}-${a.servico}`}
                  className="grid grid-cols-3 items-center rounded-md border border-slate-200 bg-white px-3.5 py-2.5"
                >
                  <div>
                    <p className="text-xs font-bold">{a.orgao}</p>
                    <p className="text-[11px] text-slate-500">{a.servico}</p>
                  </div>
                  <StatusBadge
                    status={a.status}
                    className="text-xs font-bold"
                  />
                  <span className="text-xs text-slate-500">{a.atualizacao}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}