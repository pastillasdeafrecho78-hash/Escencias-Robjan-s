import type { Categoria, Producto, TamanoMl } from "@compartido/catalogo";

export type { Categoria, Nota, Producto, TamanoMl } from "@compartido/catalogo";

export const TAMANOS: Array<{ ml: TamanoMl; etiqueta: string }> = [
  { ml: 30, etiqueta: "Chico" },
  { ml: 50, etiqueta: "Mediano" },
  { ml: 100, etiqueta: "Grande" },
];

export const categorias: Array<Categoria | "Todas"> = ["Todas", "Caballero", "Dama"];

export function precioDesde(producto: Producto) {
  return Math.min(...TAMANOS.map((tamano) => producto.precios[tamano.ml]));
}

export function relacionados(lista: Producto[], producto: Producto, cantidad = 3) {
  const conFoto = lista.filter((item) => item.slug !== producto.slug && item.imagen);
  const notas = new Set(producto.notas.map((nota) => normalizar(nota.nombre)));
  return conFoto
    .map((item) => ({
      item,
      coincidencias: item.notas.filter((nota) => notas.has(normalizar(nota.nombre))).length,
    }))
    .sort((a, b) =>
      b.coincidencias - a.coincidencias ||
      Number(b.item.categoria === producto.categoria) - Number(a.item.categoria === producto.categoria) ||
      a.item.nombre.localeCompare(b.item.nombre, "es"),
    )
    .slice(0, cantidad)
    .map(({ item }) => item);
}

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function buscarProductos(
  lista: Producto[],
  opciones: { q?: string; categoria?: string; orden?: string },
) {
  const q = normalizar(opciones.q ?? "").trim();
  const categoria = opciones.categoria ?? "Todas";

  const filtrada = lista.filter((producto) => {
    if (categoria !== "Todas" && producto.categoria !== categoria) return false;
    if (!q) return true;
    const texto = [
      producto.nombre,
      producto.marca,
      producto.familia,
      producto.categoria,
      producto.descripcion,
      ...producto.notas.map((nota) => nota.nombre),
    ].join(" ");
    return normalizar(texto).includes(q);
  });

  const orden = opciones.orden ?? "destacados";
  return [...filtrada].sort((a, b) => {
    if (orden === "nombre") return a.nombre.localeCompare(b.nombre, "es");
    if (orden === "precio-asc") return a.precioBase - b.precioBase;
    if (orden === "precio-desc") return b.precioBase - a.precioBase;
    if (a.destacado !== b.destacado) return a.destacado ? -1 : 1;
    return a.nombre.localeCompare(b.nombre, "es");
  });
}
