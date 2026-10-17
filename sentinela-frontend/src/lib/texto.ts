/**
 * Normaliza texto para busca: remove acentos, caixa e espaços nas pontas.
 * Assim "saude" encontra "Secretaria de Saúde".
 */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}
