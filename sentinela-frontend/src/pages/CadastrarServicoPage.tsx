import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import type { ServicoForm } from "../types";
import { ApiError } from "../services/api";
import { criarServico } from "../services/servicos";
import { useOrgaos } from "../hooks/useOrgaos";
import {
  CRITICIDADES,
  ROTULO_CRITICIDADE,
  ROTULO_TIPO_DADO,
  TIPOS_DE_DADO,
} from "../lib/servico";

const formularioInicial: ServicoForm = {
  orgaoId: "",
  nome: "",
  tipoDado: "",
  criticidade: "",
  responsavel: "",
};

const inputClassName =
  "h-[35px] w-full rounded-[4px] border border-line " +
  "bg-white px-[7px] text-[10px] text-navy " +
  "outline-none transition-colors " +
  "placeholder:text-placeholder " +
  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15";

const labelClassName =
  "mb-[5px] block text-[10px] font-semibold text-navy";

export default function CadastrarServicoPage() {
  const navigate = useNavigate();

  const { orgaos, carregando: carregandoOrgaos, erro: erroOrgaos } =
    useOrgaos();
  const [formulario, setFormulario] = useState<ServicoForm>(formularioInicial);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  function atualizarCampo<C extends keyof ServicoForm>(
    campo: C,
    valor: ServicoForm[C],
  ) {
    setFormulario((estadoAtual) => ({ ...estadoAtual, [campo]: valor }));
    setMensagem("");
    setErro("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      formulario.orgaoId === "" ||
      formulario.tipoDado === "" ||
      formulario.criticidade === "" ||
      !formulario.nome.trim() ||
      !formulario.responsavel.trim()
    ) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    setErro("");
    setMensagem("");
    setEnviando(true);

    try {
      await criarServico({
        nome: formulario.nome.trim(),
        responsavel: formulario.responsavel.trim(),
        tipoDado: formulario.tipoDado,
        criticidade: formulario.criticidade,
        orgaoId: formulario.orgaoId,
      });
      setFormulario(formularioInicial);
      setMensagem("Serviço cadastrado com sucesso.");
    } catch (motivo: unknown) {
      setErro(
        motivo instanceof ApiError
          ? motivo.message
          : "Erro inesperado ao cadastrar o serviço.",
      );
    } finally {
      setEnviando(false);
    }
  }

  function handleVoltar() {
    navigate("/servicos");
  }

  return (
    <div className="flex min-h-screen bg-surface font-sans text-navy">
      <Sidebar />

      <main className="flex-1 px-6 py-7 sm:px-9 sm:py-8">
        <div className="w-full max-w-117.5">
          <header>
            <p className="text-[13px] font-bold leading-5 tracking-[0.1px]">
              SENTINELA PÚBLICA
            </p>

            <nav
              aria-label="Navegação estrutural"
              className="mt-px flex items-center gap-1 text-[9px] text-muted"
            >
              <span>Cadastros</span>
              <span aria-hidden="true">•</span>
              <span>Serviços públicos</span>
            </nav>

            <h1 className="mt-2.75 text-[17px] font-bold leading-6 tracking-[-0.3px]">
              Cadastrar serviço
            </h1>
          </header>

          <section className="mt-3.75 rounded-[9px] border border-line bg-white px-4.25 pb-6 pt-3 sm:px-4.5">
            <h2 className="text-[11px] font-bold leading-5">
              Informações do serviço
            </h2>

            <form onSubmit={handleSubmit} className="mt-2.25">
              <div>
                <label htmlFor="orgao" className={labelClassName}>
                  Órgão vinculado *
                </label>
                <select
                  id="orgao"
                  name="orgao"
                  required
                  disabled={carregandoOrgaos || orgaos.length === 0}
                  value={formulario.orgaoId}
                  onChange={(e) =>
                    atualizarCampo(
                      "orgaoId",
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className={`${inputClassName} ${
                    formulario.orgaoId === "" ? "text-placeholder" : ""
                  }`}
                >
                  <option value="" disabled>
                    {carregandoOrgaos
                      ? "Carregando órgãos..."
                      : orgaos.length === 0
                        ? "Nenhum órgão cadastrado"
                        : "Selecione um órgão cadastrado"}
                  </option>
                  {orgaos.map((orgao) => (
                    <option key={orgao.id} value={orgao.id}>
                      {orgao.nome}
                    </option>
                  ))}
                </select>
                {erroOrgaos && (
                  <p role="alert" className="mt-1 text-[10px] text-red-600">
                    {erroOrgaos}
                  </p>
                )}
              </div>

              <div className="mt-2.25">
                <label htmlFor="nome" className={labelClassName}>
                  Nome do serviço *
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  maxLength={120}
                  value={formulario.nome}
                  onChange={(e) => atualizarCampo("nome", e.target.value)}
                  placeholder="Ex.: Portal do Aluno"
                  className={inputClassName}
                />
              </div>

              <div className="mt-2.25 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <div>
                  <label htmlFor="tipoDado" className={labelClassName}>
                    Tipo de dado tratado *
                  </label>
                  <select
                    id="tipoDado"
                    name="tipoDado"
                    required
                    value={formulario.tipoDado}
                    onChange={(e) =>
                      atualizarCampo(
                        "tipoDado",
                        e.target.value as ServicoForm["tipoDado"],
                      )
                    }
                    className={`${inputClassName} ${
                      formulario.tipoDado === "" ? "text-placeholder" : ""
                    }`}
                  >
                    <option value="" disabled>
                      Selecione o tipo de dado
                    </option>
                    {TIPOS_DE_DADO.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {ROTULO_TIPO_DADO[tipo]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="criticidade" className={labelClassName}>
                    Criticidade *
                  </label>
                  <select
                    id="criticidade"
                    name="criticidade"
                    required
                    value={formulario.criticidade}
                    onChange={(e) =>
                      atualizarCampo(
                        "criticidade",
                        e.target.value as ServicoForm["criticidade"],
                      )
                    }
                    className={`${inputClassName} ${
                      formulario.criticidade === "" ? "text-placeholder" : ""
                    }`}
                  >
                    <option value="" disabled>
                      Selecione a criticidade
                    </option>
                    {CRITICIDADES.map((nivel) => (
                      <option key={nivel} value={nivel}>
                        {ROTULO_CRITICIDADE[nivel]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-2.25">
                <label htmlFor="responsavel" className={labelClassName}>
                  Responsável pelo serviço *
                </label>
                <input
                  id="responsavel"
                  name="responsavel"
                  type="text"
                  required
                  maxLength={120}
                  value={formulario.responsavel}
                  onChange={(e) =>
                    atualizarCampo("responsavel", e.target.value)
                  }
                  placeholder="Nome e setor responsável"
                  className={inputClassName}
                />
              </div>

              {erro && (
                <p
                  role="alert"
                  className="mt-4 rounded-md bg-red-50 px-3 py-2 text-[11px] text-red-700"
                >
                  {erro}
                </p>
              )}

              {mensagem && (
                <p
                  role="status"
                  className="mt-4 rounded-md bg-blue-50 px-3 py-2 text-[11px] leading-4 text-blue-800"
                >
                  {mensagem}
                </p>
              )}

              <div className="mt-12.75 flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleVoltar}
                  className="h-5.75 min-w-15.5 rounded-sm border border-blue-500 bg-blue-50 px-3 text-[10px] font-semibold text-blue-600 transition-colors hover:bg-blue-100"
                >
                  Voltar
                </button>

                <button
                  type="submit"
                  disabled={enviando}
                  className="h-5.75 min-w-27.5 rounded-sm bg-blue-600 px-4 text-[10px] font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-600/60"
                >
                  {enviando ? "Salvando..." : "Salvar serviço"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}