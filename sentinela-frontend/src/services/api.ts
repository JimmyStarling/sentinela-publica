const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/** Erro de resposta da API, com o status HTTP preservado. */
export class ApiError extends Error {
  status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Formato de erro que o Nest devolve (message pode vir como lista). */
interface CorpoDeErro {
  message?: string | string[];
  error?: string;
}

function mensagemDeErro(corpo: CorpoDeErro | null, status: number): string {
  if (corpo?.message) {
    return Array.isArray(corpo.message)
      ? corpo.message.join("; ")
      : corpo.message;
  }
  if (corpo?.error) return corpo.error;
  return `Erro ${status} ao chamar a API.`;
}

export async function request<T>(
  caminho: string,
  init: RequestInit = {},
): Promise<T> {
  let resposta: Response;

  try {
    resposta = await fetch(`${BASE_URL}${caminho}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        // TODO: incluir "Authorization: Bearer <token>" quando a sessão do
        // front passar a usar o JWT de POST /auth/login.
        ...init.headers,
      },
    });
  } catch {
    // Rede indisponível, CORS bloqueado ou API fora do ar.
    throw new ApiError(
      0,
      "Não foi possível falar com a API. Verifique se ela está no ar e se CORS_ORIGIN está configurado.",
    );
  }

  if (!resposta.ok) {
    const corpo = (await resposta.json().catch(() => null)) as
      | CorpoDeErro
      | null;
    throw new ApiError(resposta.status, mensagemDeErro(corpo, resposta.status));
  }

  if (resposta.status === 204) return undefined as T;

  return (await resposta.json()) as T;
}

export const api = {
  get: <T>(caminho: string) => request<T>(caminho),
  post: <T>(caminho: string, corpo: unknown) =>
    request<T>(caminho, { method: "POST", body: JSON.stringify(corpo) }),
};
