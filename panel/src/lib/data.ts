import type { Collection } from "mongodb";
import { CATEGORIAS, limpiarAjustes, slugDe, type Ajustes, type ProductoGuardado } from "@compartido/catalogo";
import { COLECCIONES, ID_AJUSTES, baseDeDatos } from "@compartido/mongo";
import { limpiarNotas } from "@compartido/notas";

export async function coleccionProductos(): Promise<Collection<ProductoGuardado>> {
  const db = await baseDeDatos();
  return db.collection<ProductoGuardado>(COLECCIONES.productos);
}

export async function listarProductos() {
  const coleccion = await coleccionProductos();
  return coleccion.find({}, { projection: { _id: 0 } }).sort({ categoria: 1, nombre: 1 }).toArray();
}

export async function buscarProducto(slug: string) {
  const coleccion = await coleccionProductos();
  return coleccion.findOne({ slug }, { projection: { _id: 0 } });
}

export async function leerAjustes(): Promise<Ajustes> {
  const db = await baseDeDatos();
  const actual = await db.collection<{ _id: string } & Ajustes>(COLECCIONES.ajustes).findOne({ _id: ID_AJUSTES });
  return limpiarAjustes(actual);
}

export async function guardarAjustes(precios: { chico: number; mediano: number; grande: number }) {
  for (const valor of Object.values(precios)) {
    if (!Number.isInteger(valor) || valor < 1 || valor > 100000) throw new Error("Los precios deben ser pesos enteros positivos.");
  }
  const ajustes: Ajustes = {
    precioMostrador: precios.mediano,
    factores: { 30: precios.chico / precios.mediano, 50: 1, 100: precios.grande / precios.mediano },
  };
  const db = await baseDeDatos();
  await db.collection<{ _id: string } & Ajustes>(COLECCIONES.ajustes).updateOne({ _id: ID_AJUSTES }, { $set: ajustes }, { upsert: true });
  return ajustes;
}

export function validarProducto(entrada: unknown, slugActual?: string): ProductoGuardado {
  if (!entrada || typeof entrada !== "object") throw new Error("Faltan datos de la esencia.");
  const dato = entrada as Record<string, unknown>;
  const texto = (campo: string, max: number) => typeof dato[campo] === "string" ? (dato[campo] as string).trim().slice(0, max) : "";
  const nombre = texto("nombre", 100);
  const slug = slugActual || slugDe(nombre);
  const categoria = dato.categoria;
  const marca = texto("marca", 100);
  const familia = texto("familia", 100);
  const descripcion = texto("descripcion", 800);
  const precioBase = Number(dato.precioBase);
  const stock = Number(dato.stock);
  if (nombre.length < 2 || !slug || !CATEGORIAS.includes(categoria as (typeof CATEGORIAS)[number])) throw new Error("Revisa el nombre y la vitrina.");
  if (!Number.isInteger(precioBase) || precioBase < 1 || precioBase > 100000) throw new Error("El precio de 50 ml debe ser un número entero positivo.");
  if (!Number.isInteger(stock) || stock < 0 || stock > 100000) throw new Error("El stock debe ser un número entero de cero o más.");
  const notas = limpiarNotas(dato.notas);
  const imagen = texto("imagen", 250);
  if (imagen && !/^\/(?:catalogo\/[a-z0-9-]+|fotos\/[a-z0-9-]+)\.webp$/.test(imagen)) throw new Error("La ruta de la foto no es válida.");
  return {
    slug,
    nombre,
    categoria: categoria as ProductoGuardado["categoria"],
    marca,
    familia,
    descripcion,
    notas,
    imagen,
    precioBase,
    stock,
    destacado: dato.destacado === true,
    oculto: dato.oculto === true,
    actualizado: new Date().toISOString(),
  };
}
