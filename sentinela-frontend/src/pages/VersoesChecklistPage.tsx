import Sidebar from "../components/Sidebar";
import StatusBadge from "../components/StatusBadge";
import type { Versao } from "../types";

const versoes: Versao[] = [
  {
    id: "1",
    versao: "v0.1",
    dataCriacao: "15/10/2026",
    status: "Ativa",
    descricao: "Checklist inicial com 30 perguntas",
    acao: "Editar",
  },
  {
    id: "2",
    versao: "v0.0",
    dataCriacao: "01/10/2026",
    status: "Arquivada",
    descricao: "Rascunho de validação",
    acao: "Visualizar",
  },
];

export default function VersoesChecklistPage() {
  return (
    <div className="flex min-h-screen bg-surface font-sans text-navy">
      <Sidebar />

      <main className="flex-1 px-8 py-8 lg:px-10">
        <div className="w-full max-w-225">
          {/* Cabeçalho */}
          <header>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Sentinela Pública
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy">
              Versões do checklist
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Gerencie versões, perguntas e histórico de alterações.
            </p>
          </header>

          {/* Botão Nova versão */}
          <div className="mt-6 flex justify-end">
            <button className="flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
              + Nova versão
            </button>
          </div>

          {/* Tabela */}
          <section className="mt-6">
            <div className="grid grid-cols-[0.7fr_1fr_0.9fr_2fr_0.7fr] rounded-t-lg bg-subtle px-5 py-3 text-xs font-semibold text-slate-500">
              <span>Versão</span>
              <span>Data de criação</span>
              <span>Status</span>
              <span>Descrição</span>
              <span>Ações</span>
            </div>

            <ul className="flex flex-col overflow-hidden rounded-b-lg border border-t-0 border-slate-100 bg-white">
              {versoes.map((v) => (
                <li
                  key={v.id}
                  className="grid grid-cols-[0.7fr_1fr_0.9fr_2fr_0.7fr] items-center border-b border-slate-100 px-5 py-4 transition-colors last:border-b-0 hover:bg-slate-50/50"
                >
                  <span className="text-sm font-bold text-navy">
                    {v.versao}
                  </span>
                  <span className="text-sm text-slate-500">
                    {v.dataCriacao}
                  </span>
                  <StatusBadge status={v.status} />
                  <span className="text-sm text-slate-500">{v.descricao}</span>
                  <button className="text-left text-sm font-semibold text-blue-600 hover:underline">
                    {v.acao}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Card Importante */}
          <section className="mt-5 rounded-lg border border-blue-200 bg-blue-50 px-5 py-4">
            <p className="text-sm font-bold text-navy">Importante</p>
            <p className="mt-1 text-xs leading-5 text-navy">
              Mudanças no checklist devem ser documentadas e versionadas para
              manter a rastreabilidade.
            </p>
          </section>

          {/* Botão Sair */}
          <div className="mt-6 flex justify-end">
            <button className="h-7.5 min-w-17.5 rounded-sm bg-red-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-red-700">
              Sair
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}