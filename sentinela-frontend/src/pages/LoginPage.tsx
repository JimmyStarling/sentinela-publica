import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: integrar com a autenticação real
    navigate("/inicio");
  }

  return (
    <div className="flex min-h-screen bg-surface font-sans text-navy">
      {/* Painel lateral */}
      <aside className="hidden w-[39%] flex-col justify-between rounded-tr-3xl bg-navy px-16 pb-20 pt-16 text-white lg:flex">
        <div>
          <Logo />
          <h1 className="mt-14 text-4xl font-bold tracking-tight">
            Sentinela Pública
          </h1>
          <p className="mt-5 text-xl font-light leading-relaxed text-slate-100">
            Segurança da informação
            <br />
            para serviços públicos
          </p>
        </div>
        <p className="text-base font-semibold text-slate-300">
          Diagnosticar. Priorizar. Melhorar.
        </p>
      </aside>

      {/* Formulário */}
      <main className="flex flex-1 items-start px-6 pt-24 lg:px-25 lg:pt-18.75">
        <div className="w-full max-w-120">
          <h2 className="text-4xl font-bold tracking-tight">Bem-vindo(a)</h2>
          <p className="mt-2 text-base text-slate-500">
            Acesse sua conta para continuar.
          </p>

          <form onSubmit={handleSubmit} className="mt-10">
            <label htmlFor="email" className="block text-sm font-bold">
              E-mail institucional
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@orgao.gov.br"
              className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 text-sm text-navy placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            />

            <label htmlFor="password" className="mt-6 block text-sm font-bold">
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3.5 text-sm text-navy placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            />

            <div className="mt-10 text-right">
              <a
                href="#"
                className="text-sm font-bold text-blue-600 hover:underline"
              >
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              className="mt-8 h-12 w-full rounded-md bg-blue-600 text-sm font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Entrar
            </button>
          </form>

          <p className="mt-8 text-sm text-slate-500">
            Acesso restrito a usuários autorizados.
          </p>
        </div>
      </main>
    </div>
  );
}