import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paperclip } from "lucide-react";
import type { Dominio } from "../types";
import type { StatusResposta } from "../services/pontuacao";

const dominios: Dominio[] = [
  { id: 1, titulo: "Governança e gestão" },
  { id: 2, titulo: "Controle de acesso" },
  { id: 3, titulo: "Proteção de dados" },
  { id: 4, titulo: "Segurança de redes" },
  { id: 5, titulo: "Resiliência e continuidade" },
  { id: 6, titulo: "Conformidade e auditoria" },
];

/** Os valores são os aceitos por POST /pontuacao/calcular. */
const opcoes: { valor: StatusResposta; label: string }[] = [
  { valor: "CONFORME", label: "Conforme" },
  { valor: "PARCIAL", label: "Parcial" },
  { valor: "NAO_CONFORME", label: "Não conforme" },
  { valor: "NAO_SE_APLICA", label: "Não se aplica" },
];

export default function ChecklistAvaliacaoPage() {
  const navigate = useNavigate();
  const [dominioAtivo, setDominioAtivo] = useState(1);
  const [resposta, setResposta] = useState<StatusResposta | "">("");
  const [evidencia, setEvidencia] = useState("");

  function handleFinalizar() {
    // Navega para a página de resultado
    navigate("/resultados");
  }

  return (
    <main className="min-h-screen bg-surface px-6 py-7 font-sans text-navy sm:px-10 sm:py-8">
      <div className="mx-auto w-full max-w-205">
        {/* Cabeçalho */}
        <header>
          <p className="text-[13px] font-bold leading-5 tracking-[0.1px]">
            SENTINELA PÚBLICA
          </p>
          <nav
            aria-label="Navegação estrutural"
            className="mt-px flex items-center gap-1 text-[9px] text-muted"
          >
            <span>Avaliações</span>
            <span aria-hidden="true">•</span>
            <span>Checklist de segurança</span>
          </nav>

          <h1 className="mt-2.75 text-[17px] font-bold leading-6 tracking-[-0.3px]">
            Avaliação: Portal do Aluno
          </h1>
          <p className="mt-0.5 text-[10px] text-muted">
            Secretaria de Educação / Portal do Aluno
          </p>
        </header>

        {/* Barra de progresso */}
        <div className="mt-3.25 h-1.25 w-full overflow-hidden rounded-full bg-track">
          <div className="h-full w-[25%] rounded-full bg-blue-600" />
        </div>

        {/* Conteúdo: Domínios + Questionário */}
        <div className="mt-3.5 grid grid-cols-1 gap-3.25 md:grid-cols-[185px_1fr]">
          {/* Card: Domínios */}
          <aside className="rounded-[9px] border border-line bg-white px-2.75 pb-2.75 pt-2.5">
            <h2 className="text-[11px] font-bold leading-5">Domínios</h2>

            <ul className="mt-2.25 flex flex-col gap-1.25">
              {dominios.map((d) => {
                const ativo = dominioAtivo === d.id;
                return (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => setDominioAtivo(d.id)}
                      className={`w-full rounded-[5px] px-2.25 py-2 text-left text-[10px] font-medium leading-3.5 transition-colors ${
                        ativo
                          ? "bg-blue-100 font-bold text-blue-700"
                          : "text-navy hover:bg-surface"
                      }`}
                    >
                      {d.id}. {d.titulo}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Card: Questionário */}
          <section className="flex flex-col rounded-[9px] border border-line bg-white px-4.5 pb-4 pt-3.5">
            <h2 className="text-[12px] font-bold leading-5">
              Domínio {dominioAtivo}:{" "}
              {dominios.find((d) => d.id === dominioAtivo)?.titulo}
            </h2>

            <p className="mt-2.5 text-[10px] font-semibold leading-4">
              1.1 Existe uma política de segurança da informação formalizada?
            </p>

            {/* Opções */}
            <div className="mt-2.25 flex flex-col gap-1.75">
              {opcoes.map((op) => (
                <label
                  key={op.valor}
                  className="flex cursor-pointer items-center gap-1.75 text-[10px] text-navy"
                >
                  <input
                    type="radio"
                    name="resposta"
                    value={op.valor}
                    checked={resposta === op.valor}
                    onChange={(e) =>
                      setResposta(e.target.value as StatusResposta)
                    }
                    className="h-2.75 w-2.75 accent-blue-600"
                  />
                  {op.label}
                </label>
              ))}
            </div>

            {/* Evidência */}
            <div className="mt-4.5 rounded-md border border-line bg-slate-50 px-2.75 pb-2.75 pt-2.25">
              <p className="text-[10px] font-bold text-navy">
                Evidência (opcional)
              </p>

              <div className="mt-1.75 flex items-center gap-1.25 text-[10px] text-blue-600">
                <Paperclip size={11} />
                <button
                  type="button"
                  className="hover:underline"
                >
                  Anexar arquivo ou registrar referência
                </button>
              </div>

              <input
                type="text"
                value={evidencia}
                onChange={(e) => setEvidencia(e.target.value)}
                className="mt-2 h-6.5 w-full rounded-sm border border-line bg-white px-1.75 text-[10px] text-navy outline-none placeholder:text-placeholder focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                placeholder="Descreva a referência ou observação"
              />
            </div>

            {/* Ações */}
            <div className="mt-5.5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <p className="text-[9px] text-muted">
                Você pode salvar e retomar esta avaliação depois.
              </p>

              <div className="flex items-center gap-2.25">
                <button
                  type="button"
                  onClick={() => navigate("/avaliacoes")}
                  className="h-6.5 min-w-15.5 rounded-sm border border-blue-500 bg-blue-50 px-3 text-[10px] font-semibold text-blue-600 transition-colors hover:bg-blue-100"
                >
                  Voltar
                </button>

                <button
                  type="button"
                  onClick={handleFinalizar}
                  className="h-6.5 min-w-32.5 rounded-sm bg-blue-600 px-4 text-[10px] font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Finalizar avaliação
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}