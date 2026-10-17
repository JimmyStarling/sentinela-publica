import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import type { Orgao } from "../types";

const orgaos: Orgao[] = [
  {
    id: "1",
    nome: "Secretaria de Educação",
    sigla: "SEDUC",
    responsavel: "Maria Silva",
    servicos: 4,
  },
  {
    id: "2",
    nome: "Secretaria de Saúde",
    sigla: "SESAU",
    responsavel: "João Souza",
    servicos: 3,
  },
  {
    id: "3",
    nome: "Prefeitura Municipal",
    sigla: "PM",
    responsavel: "Ana Oliveira",
    servicos: 5,
  },
];

export default function OrgaosPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-surface font-sans text-navy">
      <Sidebar />

      <main className="flex-1 px-8 py-8 lg:px-10">
        <div className="w-full max-w-225">
          <header>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Sentinela Pública
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy">
              Órgãos
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Gerencie os órgãos públicos cadastrados.
            </p>
          </header>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Buscar órgão..."
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              onClick={() => navigate("/orgaos/cadastrar")}
              className="flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <Plus size={16} />
              Novo órgão
            </button>
          </div>

          <section className="mt-8">
            <div className="grid grid-cols-4 rounded-t-lg bg-subtle px-5 py-3 text-xs font-semibold text-slate-500">
              <span>Órgão</span>
              <span>Sigla</span>
              <span>Responsável</span>
              <span>Serviços</span>
            </div>

            <ul className="flex flex-col bg-white">
              {orgaos.map((o) => (
                <li
                  key={o.id}
                  className="grid grid-cols-4 items-center border-b border-slate-100 px-5 py-4 transition-colors last:border-b-0 hover:bg-slate-50/50"
                >
                  <span className="text-sm font-semibold text-navy">
                    {o.nome}
                  </span>
                  <span className="text-sm text-slate-500">{o.sigla}</span>
                  <span className="text-sm text-slate-500">
                    {o.responsavel}
                  </span>
                  <span className="text-sm text-slate-500">
                    {o.servicos} cadastrados
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}