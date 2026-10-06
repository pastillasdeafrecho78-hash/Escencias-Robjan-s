export type Categoria = "Caballero" | "Dama";
export type TamanoMl = 30 | 50 | 100;

export type Nota = {
  nombre: string;
  /** Del 1 al 10: cuánto se siente en el frasco. */
  intensidad: number;
  color: string;
};

export type Factores = Record<TamanoMl, number>;

export type Ajustes = {
  /** Precio de 50 ml para las esencias nuevas y el que se anuncia en la portada. */
  precioMostrador: number;
  factores: Factores;
};

export type ProductoGuardado = {
  slug: string;
  nombre: string;
  categoria: Categoria;
  marca: string;
  familia: string;
  notas: Nota[];
  descripcion: string;
  imagen: string;
  precioBase: number;
  stock: number;
  destacado: boolean;
  oculto?: boolean;
  actualizado?: string;
};

export type Producto = ProductoGuardado & { precios: Record<TamanoMl, number> };

export const MLS: TamanoMl[] = [30, 50, 100];
export const CATEGORIAS: Categoria[] = ["Caballero", "Dama"];

export const AJUSTES_BASE: Ajustes = {
  precioMostrador: 385,
  factores: { 30: 275 / 385, 50: 1, 100: 550 / 385 },
};

export function precioCon(precioBase: number, ml: TamanoMl, factores: Factores) {
  return Math.round(precioBase * factores[ml]);
}

export function conPrecios(producto: ProductoGuardado, factores: Factores): Producto {
  return {
    ...producto,
    precios: {
      30: precioCon(producto.precioBase, 30, factores),
      50: precioCon(producto.precioBase, 50, factores),
      100: precioCon(producto.precioBase, 100, factores),
    },
  };
}

export function slugDe(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function limpiarAjustes(entrada: Partial<Ajustes> | null | undefined): Ajustes {
  const factores = { ...AJUSTES_BASE.factores };
  for (const ml of MLS) {
    const valor = Number(entrada?.factores?.[ml]);
    if (Number.isFinite(valor) && valor > 0 && valor < 10) factores[ml] = valor;
  }
  const precio = Number(entrada?.precioMostrador);
  return {
    precioMostrador: Number.isFinite(precio) && precio > 0 ? Math.round(precio) : AJUSTES_BASE.precioMostrador,
    factores,
  };
}
