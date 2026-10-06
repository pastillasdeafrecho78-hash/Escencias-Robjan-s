import { readFile } from "node:fs/promises";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Falta MONGODB_URI. Configura .env.local antes de sembrar.");
const nombreBase = process.env.MONGODB_DB || "EsenciasRobjans";
const nombreColeccion = process.env.MONGODB_COLECCION || "productos";
const pisar = process.argv.includes("--pisar") || process.argv.includes("--forzar");
const catalogo = JSON.parse(await readFile(new URL("../src/data/catalogo.json", import.meta.url), "utf8"));
if (!Array.isArray(catalogo) || catalogo.length === 0) throw new Error("El catálogo JSON está vacío o es inválido.");
const slugs = new Set();
for (const producto of catalogo) {
  if (!producto.slug || !producto.nombre || !["Caballero", "Dama"].includes(producto.categoria)) {
    throw new Error("El catálogo contiene un producto inválido.");
  }
  if (slugs.has(producto.slug)) throw new Error(`Slug duplicado en el catálogo: ${producto.slug}`);
  slugs.add(producto.slug);
}

const cliente = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
try {
  await cliente.connect();
  const db = cliente.db(nombreBase);
  const productos = db.collection(nombreColeccion);
  const existentes = await productos.find({}, { projection: { slug: 1, nombre: 1, categoria: 1 } }).toArray();
  const ajenos = existentes.filter((item) =>
    typeof item.slug !== "string" || typeof item.nombre !== "string" || !["Caballero", "Dama"].includes(item.categoria),
  );
  if (ajenos.length) throw new Error(`La colección ${nombreBase}.${nombreColeccion} contiene ${ajenos.length} documentos ajenos o inválidos; no se modificó.`);
  await productos.createIndex({ slug: 1 }, { unique: true });
  const fecha = new Date().toISOString();
  const operaciones = catalogo.map((producto) => ({
    updateOne: {
      filter: { slug: producto.slug },
      update: pisar
        ? { $set: { ...producto, actualizado: fecha } }
        : { $setOnInsert: { ...producto, actualizado: fecha } },
      upsert: true,
    },
  }));
  const resultado = await productos.bulkWrite(operaciones, { ordered: false });
  await db.collection("ajustes_tienda").updateOne(
    { _id: "precios" },
    { $setOnInsert: { precioMostrador: 385, factores: { 30: 275 / 385, 50: 1, 100: 550 / 385 } } },
    { upsert: true },
  );
  console.log(`${catalogo.length} esencias revisadas en ${nombreBase}.${nombreColeccion}. Nuevas: ${resultado.upsertedCount}; actualizadas: ${resultado.modifiedCount}.`);
  if (!pisar) console.log("Los productos ya editados conservaron sus cambios. Usa --pisar solo si quieres reponer los datos del JSON.");
} finally {
  await cliente.close();
}
