import diccionario from "./notas.json";
import type { Nota } from "./catalogo";

export const COLOR_SIN_FAMILIA = "#b9ab8e";

export function normalizarNota(texto: string) {
  return ` ${texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

/** Gana la palabra que aparece primero: «pimienta rosa» es especia, «flor de naranjo» es flor. */
export function familiaDeNota(nombre: string) {
  const texto = normalizarNota(nombre);
  let mejor: { familia: (typeof diccionario)[number]; posicion: number; largo: number } | null = null;
  for (const familia of diccionario) {
    for (const clave of familia.claves) {
      const posicion = texto.indexOf(` ${clave}`);
      if (posicion < 0) continue;
      if (!mejor || posicion < mejor.posicion || (posicion === mejor.posicion && clave.length > mejor.largo)) {
        mejor = { familia, posicion, largo: clave.length };
      }
    }
  }
  return mejor?.familia ?? null;
}

export function colorDeNota(nombre: string) {
  return familiaDeNota(nombre)?.color ?? COLOR_SIN_FAMILIA;
}

/** Las primeras notas del catálogo son las que más se sienten: 9, 8, 7… hasta 5. */
export function intensidadInicial(posicion: number) {
  return Math.max(5, 9 - posicion);
}

export function notasIniciales(nombres: string[]): Nota[] {
  return nombres
    .map((nombre) => nombre.trim())
    .filter(Boolean)
    .map((nombre, posicion) => ({
      nombre,
      intensidad: intensidadInicial(posicion),
      color: colorDeNota(nombre),
    }));
}

export function limpiarNotas(entrada: unknown): Nota[] {
  if (!Array.isArray(entrada)) return [];
  return entrada
    .map((nota, posicion) => {
      if (typeof nota === "string") nota = { nombre: nota };
      if (!nota || typeof nota !== "object") return null;
      const { nombre, intensidad, color } = nota as Partial<Nota>;
      if (typeof nombre !== "string" || !nombre.trim()) return null;
      const valor = Math.round(Number(intensidad));
      return {
        nombre: nombre.trim().slice(0, 40),
        intensidad: Number.isFinite(valor) ? Math.min(10, Math.max(1, valor)) : intensidadInicial(posicion),
        color: typeof color === "string" && /^#[0-9a-f]{6}$/i.test(color) ? color : colorDeNota(nombre),
      };
    })
    .filter((nota): nota is Nota => Boolean(nota))
    .slice(0, 12);
}
