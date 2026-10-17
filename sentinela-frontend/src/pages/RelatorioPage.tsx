import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Logo from "../components/Logo";

export default function RelatorioPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-surface font-sans text-navy">
      <Sidebar />

      <main className="flex-1 px-8 py-8 lg:px-10">
        <div className="w-full max-w-205">
          {/* Cabeçalho */}
          <header>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Sentinela Pública
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-navy">
              Relatório de avaliação
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Pré-visualização do relatório gerado.
            </p>
          </header>

          {/* Card do Relatório */}
          <section className="mt-6 overflow-hidden rounded-[9px] border border-line bg-white">
            {/* Barra superior escura */}
            <div className="flex items-center justify-between bg-navy px-4 py-2.25">
              <span className="text-[11px] font-semibold text-white">
                Pré-visualização do relatório
              </span>
              <button className="h-6 rounded-sm bg-blue-600 px-3 text-[10px] font-semibold text-white transition-colors hover:bg-blue-700">
                Baixar PDF
              </button>
            </div>

            {/* Conteúdo do relatório */}
            <div className="px-5.5 py-4.5">
              <div className="flex items-center gap-1.5">
                <Logo className="h-3 w-3" />
                <span className="text-[11px] font-bold">Sentinela Pública</span>
              </div>

              <h2 className="mt-2.5 text-[18px] font-bold leading-5.5">
                Relatório de Avaliação
              </h2>
              <p className="mt-px text-[11px] text-muted">
                Segurança da informação
              </p>

              {/* Metadados */}
              <div className="mt-3.5 flex flex-col gap-1.25 text-[10px]">
                <p>
                  <span className="font-bold">Órgão:</span>{" "}
                  <span className="text-navy">
                    Secretaria de Educação
                  </span>
                </p>
                <p>
                  <span className="font-bold">Serviço:</span>{" "}
                  <span className="text-navy">Portal do Aluno</span>
                </p>
                <p>
                  <span className="font-bold">Data da avaliação:</span>{" "}
                  <span className="text-navy">15/10/2026</span>
                </p>
              </div>

              {/* Pontuação + Resumo */}
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[220px_1fr]">
                <div className="flex flex-col justify-center rounded-md border border-line bg-slate-50 px-3.5 py-3.5">
                  <p className="text-[10px] font-bold text-navy">
                    Pontuação geral
                  </p>
                  <p className="mt-2 text-[22px] font-bold leading-none">
                    55{" "}
                    <span className="text-[14px] font-normal text-muted">
                      / 100
                    </span>
                  </p>
                </div>

                <div className="flex flex-col gap-3.5">
                  <div>
                    <h3 className="text-[11px] font-bold">Resumo executivo</h3>
                    <p className="mt-1.25 text-[10px] leading-3.75 text-navy">
                      A avaliação identificou oportunidades de melhoria nos
                      controles e processos de segurança.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-[11px] font-bold">
                      Recomendações principais
                    </h3>
                    <ol className="mt-1.25 flex flex-col gap-0.75 text-[10px] leading-3.75 text-navy">
                      <li>
                        1. Revisar política de segurança e controle de acesso.
                      </li>
                      <li>2. Definir responsáveis e prazos para as melhorias.</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="mt-6.5 flex justify-end">
                <button
                  onClick={() => navigate("/inicio")}
                  className="h-6.5 min-w-15.5 rounded-sm bg-red-600 px-4 text-[10px] font-semibold text-white transition-colors hover:bg-red-700"
                >
                  Sair
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}