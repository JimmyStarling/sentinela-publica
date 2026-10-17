import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

interface OrgaoForm {
  nome: string;
  esfera: string;
  cnpj: string;
  endereco: string;
  responsavel: string;
  descricao: string;
}

const formularioInicial: OrgaoForm = {
  nome: "",
  esfera: "",
  cnpj: "",
  endereco: "",
  responsavel: "",
  descricao: "",
};

const esferas = ["Federal", "Estadual", "Municipal"];

const inputClassName =
  "h-[35px] w-full rounded-[4px] border border-[#D5DEEA] " +
  "bg-white px-[7px] text-[10px] text-[#183451] " +
  "outline-none transition-colors " +
  "placeholder:text-[#8A9BB1] " +
  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15";

const labelClassName =
  "mb-[5px] block text-[10px] font-semibold text-[#183451]";

export default function CadastrarOrgaoPage() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState<OrgaoForm>(formularioInicial);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  function atualizarCampo(campo: keyof OrgaoForm, valor: string) {
    setFormulario((estadoAtual) => ({ ...estadoAtual, [campo]: valor }));
    setMensagem("");
    setErro("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const camposObrigatorios = [formulario.nome, formulario.esfera];

    if (camposObrigatorios.some((campo) => !campo.trim())) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    console.log("Dados do órgão:", formulario);

    setErro("");
    setMensagem(
      "Órgão validado com sucesso! A integração com a API ainda precisa ser feita.",
    );
  }

  function handleVoltar() {
    navigate("/orgaos");
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6F8] font-sans text-[#183451]">
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
              className="mt-px flex items-center gap-1 text-[9px] text-[#718198]"
            >
              <span>Cadastros</span>
              <span aria-hidden="true">•</span>
              <span>Órgãos públicos</span>
            </nav>

            <h1 className="mt-2.75 text-[17px] font-bold leading-6 tracking-[-0.3px]">
              Cadastrar órgão
            </h1>
          </header>

          {/* Card do formulário */}
          <section className="mt-3.75 rounded-[9px] border border-[#DFE6EF] bg-white px-4.25 pb-6 pt-3.5 sm:px-5.5">
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
                  maxLength={120}
                  value={formulario.nome}
                  onChange={(e) => atualizarCampo("nome", e.target.value)}
                  placeholder="Ex.: Secretaria Municipal de Educação"
                  className={inputClassName}
                />
              </div>

              {/* Esfera + CNPJ */}
              <div className="mt-3.5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <div>
                  <label htmlFor="esfera" className={labelClassName}>
                    Esfera *
                  </label>
                  <select
                    id="esfera"
                    name="esfera"
                    required
                    value={formulario.esfera}
                    onChange={(e) => atualizarCampo("esfera", e.target.value)}
                    className={`${inputClassName} ${
                      formulario.esfera === "" ? "text-[#8A9BB1]" : ""
                    }`}
                  >
                    <option value="" disabled>
                      Selecione a esfera
                    </option>
                    {esferas.map((esfera) => (
                      <option key={esfera} value={esfera}>
                        {esfera}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="cnpj" className={labelClassName}>
                    CNPJ
                  </label>
                  <input
                    id="cnpj"
                    name="cnpj"
                    type="text"
                    maxLength={18}
                    value={formulario.cnpj}
                    onChange={(e) => atualizarCampo("cnpj", e.target.value)}
                    placeholder="00.000.000/0000-00"
                    className={inputClassName}
                  />
                </div>
              </div>

              {/* Endereço */}
              <div className="mt-3.5">
                <label htmlFor="endereco" className={labelClassName}>
                  Endereço
                </label>
                <input
                  id="endereco"
                  name="endereco"
                  type="text"
                  maxLength={200}
                  value={formulario.endereco}
                  onChange={(e) => atualizarCampo("endereco", e.target.value)}
                  placeholder="Digite o endereço institucional"
                  className={inputClassName}
                />
              </div>

              {/* Responsável */}
              <div className="mt-3.5">
                <label htmlFor="responsavel" className={labelClassName}>
                  Responsável
                </label>
                <input
                  id="responsavel"
                  name="responsavel"
                  type="text"
                  maxLength={120}
                  value={formulario.responsavel}
                  onChange={(e) =>
                    atualizarCampo("responsavel", e.target.value)
                  }
                  placeholder="Nome do responsável pelo serviço"
                  className={inputClassName}
                />
              </div>

              {/* Descrição */}
              <div className="mt-3.5">
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
                  placeholder="Breve descrição do órgão"
                  className={inputClassName}
                />
              </div>

              {/* Nota campos obrigatórios */}
              <p className="mt-4 text-[9px] text-[#718198]">
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
                  className="h-6.5 min-w-18 rounded-sm border border-[#4B79FF] bg-[#E8EEFF] px-3 text-[10px] font-semibold text-[#2860F5] transition-colors hover:bg-[#D9E3FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  Voltar
                </button>

                <button
                  type="submit"
                  className="h-6.5 min-w-27.5 rounded-sm bg-[#2860F5] px-4 text-[10px] font-semibold text-white transition-colors hover:bg-[#1D4ED8] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  Salvar órgão
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}