import { Search, Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";

type Status = "Em andamento" | "Concluída";

interface Avaliacao {
  id: string;
  orgao: string;
  servico: string;
  inicio: string;
  status: Status;
  acao: "Continuar" | "Visualizar";
}

const avaliacoes: Avaliacao[] = [
  {
    id: "1",
    orgao: "Secretaria de Educação",
    servico: "Portal do Aluno",
    inicio: "15/10/2026",
    status: "Em andamento",
    acao: "Continuar",
  },
  {
    id: "2",
    orgao: "Prefeitura Municipal",
    servico: "Sistema de protocolo",
    inicio: "10/10/2026",
    status: "Concluída",
    acao: "Visualizar",
  },
  {
    id: "3",
    orgao: "Secretaria de Saúde",
    servico: "Agendamento de consultas",
    inicio: "08/10/2026",
    status: "Em andamento",
    acao: "Continuar",
  },
];

const statusColor: Record<Status, string> = {
  "Em andamento": "text-blue-600",
  Concluída: "text-emerald-600",
};

export default function AvaliacoesPage() {
  return (
    <div className="flex min-h-screen bg-[#F4F6F8] font-sans text-[#183451]">
      <Sidebar />

      <main className="flex-1 px-8 py-8 lg:px-10">
        <div className="w-full max-w-225">
          {/* Cabeçalho */}
          <header>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Sentinela Pública
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy">
              Avaliações
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Gerencie as avaliações de segurança da informação.
            </p>
          </header>

          {/* Barra de Ações */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Buscar avaliação..."
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button className="flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
              <Plus size={16} />
              Nova avaliação
            </button>
          </div>

          {/* Tabela */}
          <section className="mt-8">
            {/* Cabeçalho da Tabela */}
            <div className="grid grid-cols-4 rounded-t-lg bg-[#E9EEF5] px-5 py-3 text-xs font-semibold text-slate-500">
              <span>Órgão / Serviço</span>
              <span>Início</span>
              <span>Status</span>
              <span>Ações</span>
            </div>

            {/* Linhas da Tabela */}
            <ul className="flex flex-col bg-white">
              {avaliacoes.map((item) => (
                <li
                  key={item.id}
                  className="grid grid-cols-4 items-center border-b border-slate-100 px-5 py-4 last:border-b-0 hover:bg-slate-50/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-navy">
                      {item.orgao}
                    </p>
                    <p className="text-xs text-slate-500">{item.servico}</p>
                  </div>

                  <span className="text-sm text-slate-500">{item.inicio}</span>

                  <span
                    className={`text-sm font-semibold ${statusColor[item.status]}`}
                  >
                    {item.status}
                  </span>

                  <button className="text-left text-sm font-semibold text-blue-600 hover:underline">
                    {item.acao}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}