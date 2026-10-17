import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import type { ServicoForm } from "../types";
import {
  CRITICIDADES,
  ROTULO_CRITICIDADE,
  ROTULO_TIPO_DADO,
  TIPOS_DE_DADO,
} from "../lib/servico";

const formularioInicial: ServicoForm = {
  orgao: "",
  nome: "",
  descricao: "",
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

  const [formulario, setFormulario] = useState<ServicoForm>(formularioInicial);
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const camposObrigatorios = [
      formulario.orgao,
      formulario.nome,
      formulario.tipoDado,
      formulario.criticidade,
      formulario.responsavel,
    ];

    if (camposObrigatorios.some((campo) => !campo.trim())) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    console.log("Dados do serviço:", formulario);
    setErro("");
    setMensagem(
      "Serviço validado com sucesso! A integração com a API ainda precisa ser feita.",
    );
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
                  value={formulario.orgao}
                  onChange={(e) => atualizarCampo("orgao", e.target.value)}
                  className={`${inputClassName} ${
                    formulario.orgao === "" ? "text-placeholder" : ""
                  }`}
                >
                  <option value="" disabled>
                    Selecione um órgão cadastrado
                  </option>
                  <option value="Secretaria de Educação">
                    Secretaria de Educação
                  </option>
                  <option value="Secretaria de Saúde">
                    Secretaria de Saúde
                  </option>
                  <option value="Secretaria de Administração">
                    Secretaria de Administração
                  </option>
                  <option value="Prefeitura Municipal">
                    Prefeitura Municipal
                  </option>
                </select>
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

              <div className="mt-2.25">
                <label htmlFor="descricao" className={labelClassName}>
                  Descrição
                </label>
                <input
                  id="descricao"
                  name="descricao"
                  type="text"
                  maxLength={300}
                  value={formulario.descricao}
                  onChange={(e) => atualizarCampo("descricao", e.target.value)}
                  placeholder="Descreva a finalidade do serviço"
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
                  className="h-5.75 min-w-27.5 rounded-sm bg-blue-600 px-4 text-[10px] font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Salvar serviço
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}