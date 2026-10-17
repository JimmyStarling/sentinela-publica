import { Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import StatusBadge from "../components/StatusBadge";
import type { Usuario } from "../types";

const usuarios: Usuario[] = [
  {
    id: "1",
    nome: "Maria Silva",
    email: "maria@orgao.gov.br",
    perfil: "Administrador",
    status: "Ativo",
  },
  {
    id: "2",
    nome: "João Souza",
    email: "joao@orgao.gov.br",
    perfil: "Avaliador",
    status: "Ativo",
  },
  {
    id: "3",
    nome: "Ana Oliveira",
    email: "ana@orgao.gov.br",
    perfil: "Gestor do órgão",
    status: "Ativo",
  },
  {
    id: "4",
    nome: "Pedro Lima",
    email: "pedro@orgao.gov.br",
    perfil: "Avaliador",
    status: "Inativo",
  },
];

export default function GestaoUsuariosPage() {
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
              Gestão de usuários
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Gerencie contas, perfis e permissões de acesso.
            </p>
          </header>

          {/* Botão Nova usuário */}
          <div className="mt-6 flex justify-end">
            <button className="flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
              <Plus size={16} />
              Novo usuário
            </button>
          </div>

          {/* Tabela */}
          <section className="mt-6">
            {/* Cabeçalho da Tabela */}
            <div className="grid grid-cols-[1.2fr_1.5fr_1.2fr_0.7fr_0.7fr] rounded-t-lg bg-subtle px-5 py-3 text-xs font-semibold text-slate-500">
              <span>Nome</span>
              <span>E-mail</span>
              <span>Perfil</span>
              <span>Status</span>
              <span>Ações</span>
            </div>

            {/* Linhas */}
            <ul className="flex flex-col bg-white">
              {usuarios.map((u) => (
                <li
                  key={u.id}
                  className="grid grid-cols-[1.2fr_1.5fr_1.2fr_0.7fr_0.7fr] items-center border-b border-slate-100 px-5 py-4 transition-colors last:border-b-0 hover:bg-slate-50/50"
                >
                  <span className="text-sm font-semibold text-navy">
                    {u.nome}
                  </span>
                  <span className="text-sm text-slate-500">{u.email}</span>
                  <span className="text-sm text-slate-500">{u.perfil}</span>
                  <StatusBadge status={u.status} />
                  <button className="text-left text-sm font-semibold text-blue-600 hover:underline">
                    Editar
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Rodapé */}
          <p className="mt-5 text-[11px] text-slate-500">
            O acesso deve respeitar o princípio do menor privilégio.
          </p>
        </div>
      </main>
    </div>
  );
}