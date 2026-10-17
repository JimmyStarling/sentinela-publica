import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ApiError } from "../services/api";
import { excluirOrgao } from "../services/orgaos";
import { useOrgaos } from "../hooks/useOrgaos";
import { useServicos } from "../hooks/useServicos";
import { normalizar } from "../lib/texto";

export default function OrgaosPage() {
  const navigate = useNavigate();
  const {
    orgaos,
    carregando: carregandoOrgaos,
    erro: erroOrgaos,
    recarregar,
  } = useOrgaos();
  const { servicos, erro: erroServicos, recarregar: recarregarServicos } =
    useServicos();

  // GET /orgaos não carrega a relação `servicos`, então a contagem é
  // derivada de GET /servicos. O nome do órgão é único na API, o que torna
  // o agrupamento por nome confiável.
  const servicosPorOrgao = useMemo(() => {
    const contagem = new Map<string, number>();
    for (const servico of servicos) {
      contagem.set(servico.orgao, (contagem.get(servico.orgao) ?? 0) + 1);
    }
    return contagem;
  }, [servicos]);

  const [busca, setBusca] = useState("");
  const [excluindo, setExcluindo] = useState<number | null>(null);
  const [erroAcao, setErroAcao] = useState<string | null>(null);

  const orgaosFiltrados = useMemo(() => {
    const termo = normalizar(busca);
    if (!termo) return orgaos;
    return orgaos.filter(
      (orgao) =>
        normalizar(orgao.nome).includes(termo) ||
        normalizar(orgao.responsavel).includes(termo),
    );
  }, [orgaos, busca]);

  const erro = erroOrgaos ?? erroServicos;

  async function handleExcluir(id: number, nome: string) {
    const vinculados = servicosPorOrgao.get(nome) ?? 0;

    // A API já devolve 409 nesse caso, mas a mensagem dela é genérica;
    // checar aqui permite dizer quantos serviços estão vinculados.
    if (vinculados > 0) {
      setErroAcao(
        `"${nome}" tem ${vinculados} serviço(s) vinculado(s). Exclua ou mova os serviços antes de excluir o órgão.`,
      );
      return;
    }

    if (!window.confirm(`Excluir o órgão "${nome}"? Esta ação é definitiva.`)) {
      return;
    }

    setErroAcao(null);
    setExcluindo(id);

    try {
      await excluirOrgao(id);
      recarregar();
      recarregarServicos();
    } catch (motivo: unknown) {
      setErroAcao(
        motivo instanceof ApiError
          ? motivo.message
          : "Erro inesperado ao excluir o órgão.",
      );
    } finally {
      setExcluindo(null);
    }
  }

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
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                aria-label="Buscar órgão"
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
              <span>Responsável</span>
              <span>Serviços</span>
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

            {carregandoOrgaos && (
              <p className="bg-white px-5 py-6 text-sm text-slate-500">
                Carregando órgãos...
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

            {!carregandoOrgaos && !erro && orgaos.length === 0 && (
              <p className="bg-white px-5 py-6 text-sm text-slate-500">
                Nenhum órgão cadastrado ainda.
              </p>
            )}

            {!carregandoOrgaos &&
              !erro &&
              orgaos.length > 0 &&
              orgaosFiltrados.length === 0 && (
                <p className="bg-white px-5 py-6 text-sm text-slate-500">
                  Nenhum órgão encontrado para "{busca}".
                </p>
              )}

            <ul className="flex flex-col bg-white">
              {orgaosFiltrados.map((orgao) => (
                <li
                  key={orgao.id}
                  className="grid grid-cols-4 items-center border-b border-slate-100 px-5 py-4 transition-colors last:border-b-0 hover:bg-slate-50/50"
                >
                  <span className="text-sm font-semibold text-navy">
                    {orgao.nome}
                  </span>
                  <span className="text-sm text-slate-500">
                    {orgao.responsavel}
                  </span>
                  <span className="text-sm text-slate-500">
                    {servicosPorOrgao.get(orgao.nome) ?? 0} cadastrados
                  </span>

                  <span className="flex items-center gap-3 text-sm font-semibold">
                    <button
                      type="button"
                      onClick={() => navigate(`/orgaos/${orgao.id}/editar`)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      disabled={excluindo === orgao.id}
                      onClick={() => handleExcluir(orgao.id, orgao.nome)}
                      className="text-red-600 hover:underline disabled:cursor-not-allowed disabled:text-red-600/50"
                    >
                      {excluindo === orgao.id ? "Excluindo..." : "Excluir"}
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
