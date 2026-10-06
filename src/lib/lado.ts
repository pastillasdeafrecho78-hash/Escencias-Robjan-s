export const LADO_KEY = "esencias-robjans-lado";

export type Lado = "Caballero" | "Dama";

export function leerLado(): Lado | null {
  if (typeof window === "undefined") return null;
  const valor = localStorage.getItem(LADO_KEY);
  return valor === "Caballero" || valor === "Dama" ? valor : null;
}

export function guardarLado(lado: Lado | null) {
  if (lado) localStorage.setItem(LADO_KEY, lado);
  else localStorage.removeItem(LADO_KEY);
}

export function claseFondo(categoria: string) {
  if (categoria === "Dama") return "fondo-dama";
  if (categoria === "Caballero") return "fondo-caballero";
  return "fondo-neutro";
}
