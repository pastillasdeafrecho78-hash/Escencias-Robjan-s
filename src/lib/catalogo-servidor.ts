import { cache } from "react";
import catalogoJson from "@/data/catalogo.json";
import {
  AJUSTES_BASE,
  conPrecios,
  limpiarAjustes,
  type Ajustes,
  type Producto,
  type ProductoGuardado,
} from "@compartido/catalogo";
import { COLECCIONES, ID_AJUSTES, baseDeDatos, hayMongo } from "@compartido/mongo";
import { limpiarNotas } from "@compartido/notas";

type Catalogo = { productos: Producto[]; ajustes: Ajustes; origen: "mongo" | "json" };

function desdeJson(): Catalogo {
  const guardados = (catalogoJson as unknown as ProductoGuardado[]).filter((producto) => !producto.oculto);
  const productos = guardados.map((producto) =>
    conPrecios({ ...producto, notas: limpiarNotas(producto.notas) }, AJUSTES_BASE.factores),
  );
  return { productos, ajustes: AJUSTES_BASE, origen: "json" };
}

async function desdeMongo(): Promise<Catalogo> {
  const db = await baseDeDatos();
  const [guardados, ajustesDoc] = await Promise.all([
    db
      .collection<ProductoGuardado>(COLECCIONES.productos)
      .find({ oculto: { $ne: true } }, { projection: { _id: 0 } })
      .toArray(),
    db.collection<{ _id: string } & Ajustes>(COLECCIONES.ajustes).findOne({ _id: ID_AJUSTES }),
  ]);
  const ajustes = limpiarAjustes(ajustesDoc);
  const productos = guardados.map((producto) =>
    conPrecios({ ...producto, notas: limpiarNotas(producto.notas) }, ajustes.factores),
  );
  return { productos, ajustes, origen: "mongo" };
}

/** Una lectura por petición. Si Mongo no contesta, la tienda sigue con el JSON del repositorio. */
export const obtenerCatalogo = cache(async (): Promise<Catalogo> => {
  if (!hayMongo()) return desdeJson();
  try {
    const catalogo = await desdeMongo();
    if (catalogo.productos.length > 0) return catalogo;
    console.warn("La colección de productos está vacía; uso catalogo.json. Corre npm run sembrar.");
  } catch (error) {
    console.error("No pude leer MongoDB; uso catalogo.json.", error);
  }
  return desdeJson();
});

export async function obtenerProducto(slug: string) {
  const { productos } = await obtenerCatalogo();
  return productos.find((producto) => producto.slug === slug);
}
