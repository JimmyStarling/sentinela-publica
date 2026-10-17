import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import type { OrgaoForm } from "../types";
import { ApiError } from "../services/api";
import { atualizarOrgao, buscarOrgao, criarOrgao } from "../services/orgaos";

const formularioInicial: OrgaoForm = {
  nome: "",
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

export default function CadastrarOrgaoPage() {
  const navigate = useNavigate();
  // A mesma tela atende /orgaos/cadastrar e /orgaos/:id/editar.
  const { id } = useParams();
  const editando = id !== undefined;

  const [formulario, setFormulario] = useState<OrgaoForm>(formularioInicial);
  const [carregando, setCarregando] = useState(editando);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (id === undefined) return;

    let ativo = true;

    buscarOrgao(Number(id))
      .then((orgao) => {
        if (!ativo) return;
        setFormulario({ nome: orgao.nome, responsavel: orgao.responsavel });
        setErro("");
      })
      .catch((motivo: unknown) => {
        if (!ativo) return;
        setErro(
          motivo instanceof ApiError
            ? motivo.message
            : "Erro inesperado ao carregar o órgão.",
        );
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [id]);

  function atualizarCampo(campo: keyof OrgaoForm, valor: string) {
    setFormulario((estadoAtual) => ({ ...estadoAtual, [campo]: valor }));
    setMensagem("");
    setErro("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const camposObrigatorios = [formulario.nome, formulario.responsavel];

    if (camposObrigatorios.some((campo) => !campo.trim())) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    setErro("");
    setMensagem("");
    setEnviando(true);

    const dados = {
      nome: formulario.nome.trim(),
      responsavel: formulario.responsavel.trim(),
    };

    try {
      if (editando) {
        await atualizarOrgao(Number(id), dados);
        setMensagem("Órgão atualizado com sucesso.");
      } else {
        await criarOrgao(dados);
        setFormulario(formularioInicial);
        setMensagem("Órgão cadastrado com sucesso.");
      }
    } catch (motivo: unknown) {
      setErro(
        motivo instanceof ApiError
          ? motivo.message
          : `Erro inesperado ao ${editando ? "atualizar" : "cadastrar"} o órgão.`,
      );
    } finally {
      setEnviando(false);
    }
  }

  function handleVoltar() {
    navigate("/orgaos");
  }

  return (
    <div className="flex min-h-screen bg-surface font-sans text-navy">
      <Sidebar />

      <main className="flex-1 px-6 py-7 sm:px-9 sm:py-8">
        <div className="w-full max-w-155">
          {/* Cabeçalho */}
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
              <span>Órgãos públicos</span>
            </nav>

            <h1 className="mt-2.75 text-[17px] font-bold leading-6 tracking-[-0.3px]">
              {editando ? "Editar órgão" : "Cadastrar órgão"}
            </h1>
          </header>

          {/* Card do formulário */}
          <section className="mt-3.75 rounded-[9px] border border-line bg-white px-4.25 pb-6 pt-3.5 sm:px-5.5">
            <h2 className="text-[12px] font-bold leading-5">
              Informações do órgão
            </h2>

            <form onSubmit={handleSubmit} className="mt-3">
              {/* Nome do órgão */}
              <div>
                <label htmlFor="nome" className={labelClassName}>
                  Nome do órgão *
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  maxLength={150}
                  value={formulario.nome}
                  onChange={(e) => atualizarCampo("nome", e.target.value)}
                  placeholder="Ex.: Secretaria Municipal de Educação"
                  className={inputClassName}
                />
              </div>

              {/* Responsável */}
              <div className="mt-3.5">
                <label htmlFor="responsavel" className={labelClassName}>
                  Responsável *
                </label>
                <input
                  id="responsavel"
                  name="responsavel"
                  type="text"
                  required
                  maxLength={150}
                  value={formulario.responsavel}
                  onChange={(e) =>
                    atualizarCampo("responsavel", e.target.value)
                  }
                  placeholder="Nome do responsável pelo órgão"
                  className={inputClassName}
                />
              </div>

              {/* Nota campos obrigatórios */}
              <p className="mt-4 text-[9px] text-muted">
                * Campos obrigatórios
              </p>

              {/* Mensagens */}
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

              {/* Ações */}
              <div className="mt-9 flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleVoltar}
                  className="h-6.5 min-w-18 rounded-sm border border-blue-500 bg-blue-50 px-3 text-[10px] font-semibold text-blue-600 transition-colors hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  Voltar
                </button>

                <button
                  type="submit"
                  disabled={enviando || carregando}
                  className="h-6.5 min-w-27.5 rounded-sm bg-blue-600 px-4 text-[10px] font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-600/60"
                >
                  {enviando
                    ? "Salvando..."
                    : editando
                      ? "Salvar alterações"
                      : "Salvar órgão"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}