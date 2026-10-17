import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paperclip } from "lucide-react";
import type { Dominio } from "../types";
import { ApiError } from "../services/api";
import {
  calcularPontuacao,
  type StatusResposta,
} from "../services/pontuacao";

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
  // Resposta e evidência são guardadas por domínio: antes havia um estado só,
  // então trocar de domínio carregava a resposta do anterior.
  const [respostas, setRespostas] = useState<Record<number, StatusResposta>>(
    {},
  );
  const [evidencias, setEvidencias] = useState<Record<number, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const respondidos = Object.keys(respostas).length;
  const completo = respondidos === dominios.length;
  const progresso = Math.round((respondidos / dominios.length) * 100);

  async function handleFinalizar() {
    if (!completo) return;

    setErro(null);
    setEnviando(true);

    try {
      const resultado = await calcularPontuacao(
        // Um domínio por aba, com a única pergunta existente hoje.
        dominios.map((d) => ({
          nome: d.titulo,
          respostas: [respostas[d.id]],
        })),
      );
      navigate("/resultados", { state: { resultado } });
    } catch (motivo: unknown) {
      setErro(
        motivo instanceof ApiError
          ? motivo.message
          : "Erro inesperado ao calcular a pontuação.",
      );
    } finally {
      setEnviando(false);
    }
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
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{ width: `${progresso}%` }}
          />
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
                      {respostas[d.id] && (
                        <span
                          aria-label="respondido"
                          className="ml-1 text-green-600"
                        >
                          ✓
                        </span>
                      )}
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
                    checked={respostas[dominioAtivo] === op.valor}
                    onChange={(e) =>
                      setRespostas((atual) => ({
                        ...atual,
                        [dominioAtivo]: e.target.value as StatusResposta,
                      }))
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
                value={evidencias[dominioAtivo] ?? ""}
                onChange={(e) =>
                  setEvidencias((atual) => ({
                    ...atual,
                    [dominioAtivo]: e.target.value,
                  }))
                }
                className="mt-2 h-6.5 w-full rounded-sm border border-line bg-white px-1.75 text-[10px] text-navy outline-none placeholder:text-placeholder focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                placeholder="Descreva a referência ou observação"
              />
            </div>

            {/* Ações */}
            <div className="mt-5.5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[9px] text-muted">
                  {completo
                    ? "Todos os domínios respondidos."
                    : `Respondidos ${respondidos} de ${dominios.length} domínios.`}
                </p>
                {erro && (
                  <p
                    role="alert"
                    className="mt-1 text-[9px] font-medium text-red-600"
                  >
                    {erro}
                  </p>
                )}
              </div>

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
                  disabled={!completo || enviando}
                  title={
                    completo
                      ? undefined
                      : "Responda todos os domínios para finalizar."
                  }
                  className="h-6.5 min-w-32.5 rounded-sm bg-blue-600 px-4 text-[10px] font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-600/50"
                >
                  {enviando ? "Calculando..." : "Finalizar avaliação"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}