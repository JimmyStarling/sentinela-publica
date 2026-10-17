import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import CriticidadeBadge from "../components/CriticidadeBadge";
import { ROTULO_TIPO_DADO } from "../lib/servico";
import { ApiError } from "../services/api";
import { excluirServico } from "../services/servicos";
import { useServicos } from "../hooks/useServicos";
import { normalizar } from "../lib/texto";

export default function ServicosPage() {
  const navigate = useNavigate();
  const { servicos, carregando, erro, recarregar } = useServicos();
  const [busca, setBusca] = useState("");
  const [excluindo, setExcluindo] = useState<string | null>(null);
  const [erroAcao, setErroAcao] = useState<string | null>(null);

  async function handleExcluir(id: string, nome: string) {
    if (!window.confirm(`Excluir o serviço "${nome}"? Esta ação é definitiva.`)) {
      return;
    }

    setErroAcao(null);
    setExcluindo(id);

    try {
      await excluirServico(Number(id));
      recarregar();
    } catch (motivo: unknown) {
      setErroAcao(
        motivo instanceof ApiError
          ? motivo.message
          : "Erro inesperado ao excluir o serviço.",
      );
    } finally {
      setExcluindo(null);
    }
  }

  const servicosFiltrados = useMemo(() => {
    const termo = normalizar(busca);
    if (!termo) return servicos;
    return servicos.filter(
      (servico) =>
        normalizar(servico.nome).includes(termo) ||
        normalizar(servico.orgao).includes(termo) ||
        normalizar(servico.responsavel).includes(termo),
    );
  }, [servicos, busca]);

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
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                aria-label="Buscar serviço"
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
            <div className="grid grid-cols-6 rounded-t-lg bg-subtle px-5 py-3 text-xs font-semibold text-slate-500">
              <span className="col-span-2">Serviço / Órgão</span>
              <span>Tipo de dado</span>
              <span>Criticidade</span>
              <span>Responsável</span>
              <span>Ações</span>
            </div>

            {erroAcao && (
              <p
                role="alert"
                className="bg-white px-5 pt-4 text-sm font-medium text-red-600"
              >
                {erroAcao}
              </p>
            )}

            {carregando && (
              <p className="bg-white px-5 py-6 text-sm text-slate-500">
                Carregando serviços...
              </p>
            )}

            {erro && (
              <p
                role="alert"
                className="bg-white px-5 py-6 text-sm font-medium text-red-600"
              >
                {erro}
              </p>
            )}

            {!carregando && !erro && servicos.length === 0 && (
              <p className="bg-white px-5 py-6 text-sm text-slate-500">
                Nenhum serviço cadastrado ainda.
              </p>
            )}

            {!carregando &&
              !erro &&
              servicos.length > 0 &&
              servicosFiltrados.length === 0 && (
                <p className="bg-white px-5 py-6 text-sm text-slate-500">
                  Nenhum serviço encontrado para "{busca}".
                </p>
              )}

            <ul className="flex flex-col bg-white">
              {servicosFiltrados.map((s) => (
                <li
                  key={s.id}
                  className="grid grid-cols-6 items-center border-b border-slate-100 px-5 py-4 transition-colors last:border-b-0 hover:bg-slate-50/50"
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

                  <span className="flex items-center gap-3 text-sm font-semibold">
                    <button
                      type="button"
                      onClick={() => navigate(`/servicos/${s.id}/editar`)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      disabled={excluindo === s.id}
                      onClick={() => handleExcluir(s.id, s.nome)}
                      className="text-red-600 hover:underline disabled:cursor-not-allowed disabled:text-red-600/50"
                    >
                      {excluindo === s.id ? "Excluindo..." : "Excluir"}
                    </button>
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
