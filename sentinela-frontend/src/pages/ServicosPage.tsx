import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import CriticidadeBadge from "../components/CriticidadeBadge";
import type { Servico } from "../types";
import { ROTULO_TIPO_DADO } from "../lib/servico";

const servicos: Servico[] = [
  {
    id: "1",
    nome: "Portal do Aluno",
    orgao: "Secretaria de Educação",
    responsavel: "Maria Silva",
    tipoDado: "pessoal",
    criticidade: "alta",
  },
  {
    id: "2",
    nome: "Matrícula online",
    orgao: "Secretaria de Educação",
    responsavel: "Maria Silva",
    tipoDado: "pessoal",
    criticidade: "media",
  },
  {
    id: "3",
    nome: "Agendamento de consultas",
    orgao: "Secretaria de Saúde",
    responsavel: "João Souza",
    tipoDado: "sensivel",
    criticidade: "alta",
  },
  {
    id: "4",
    nome: "Sistema de protocolo",
    orgao: "Prefeitura Municipal",
    responsavel: "Ana Oliveira",
    tipoDado: "interno",
    criticidade: "media",
  },
  {
    id: "5",
    nome: "Portal da transparência",
    orgao: "Prefeitura Municipal",
    responsavel: "Pedro Lima",
    tipoDado: "publico",
    criticidade: "baixa",
  },
];

export default function ServicosPage() {
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
              Serviços
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Gerencie os serviços públicos cadastrados para avaliação.
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
                placeholder="Buscar serviço..."
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              onClick={() => navigate("/servicos/cadastrar")}
              className="flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <Plus size={16} />
              Novo serviço
            </button>
          </div>

          <section className="mt-8">
            <div className="grid grid-cols-5 rounded-t-lg bg-subtle px-5 py-3 text-xs font-semibold text-slate-500">
              <span className="col-span-2">Serviço / Órgão</span>
              <span>Tipo de dado</span>
              <span>Criticidade</span>
              <span>Responsável</span>
            </div>

            <ul className="flex flex-col bg-white">
              {servicos.map((s) => (
                <li
                  key={s.id}
                  className="grid grid-cols-5 items-center border-b border-slate-100 px-5 py-4 transition-colors last:border-b-0 hover:bg-slate-50/50"
                >
                  <div className="col-span-2">
                    <p className="text-sm font-semibold text-navy">{s.nome}</p>
                    <p className="text-xs text-slate-500">{s.orgao}</p>
                  </div>
                  <span className="text-sm text-slate-500">
                    {ROTULO_TIPO_DADO[s.tipoDado]}
                  </span>
                  <CriticidadeBadge criticidade={s.criticidade} />
                  <span className="text-sm text-slate-500">
                    {s.responsavel}
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
