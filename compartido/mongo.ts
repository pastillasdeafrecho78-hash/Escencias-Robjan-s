import { MongoClient, type Db } from "mongodb";

export const COLECCIONES = {
  productos: process.env.MONGODB_COLECCION || "productos",
  ajustes: "ajustes_tienda",
  fotos: "fotos_esencias",
} as const;

export const ID_AJUSTES = "precios";

const global = globalThis as typeof globalThis & { __mongoEsencias?: Promise<MongoClient> };

export function hayMongo() {
  return Boolean(process.env.MONGODB_URI);
}

export async function baseDeDatos(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Falta MONGODB_URI");
  if (!global.__mongoEsencias) {
    global.__mongoEsencias = new MongoClient(uri, { serverSelectionTimeoutMS: 2500 }).connect().catch((error) => {
      global.__mongoEsencias = undefined;
      throw error;
    });
  }
  const cliente = await global.__mongoEsencias;
  return cliente.db(process.env.MONGODB_DB || "FrateliFinal");
}
