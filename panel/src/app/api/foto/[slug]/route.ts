import { randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { Binary } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { COLECCIONES, baseDeDatos } from "@compartido/mongo";
import { autorizarApi } from "@/lib/auth";
import { coleccionProductos } from "@/lib/data";

const ejecutar = promisify(execFile);
const MAX = 8 * 1024 * 1024;

function tipoReal(bytes: Buffer) {
  if (bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return "jpg";
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "png";
  if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "webp";
  return null;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!autorizarApi(request)) return NextResponse.json({ error: "Sesión requerida." }, { status: 401 });
  const { slug } = await params;
  if (!/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ error: "Slug inválido." }, { status: 400 });
  const coleccion = await coleccionProductos();
  if (!(await coleccion.findOne({ slug }))) return NextResponse.json({ error: "Guarda la esencia antes de subir la foto." }, { status: 404 });
  const datos = await request.formData().catch(() => null);
  const archivo = datos?.get("foto");
  if (!(archivo instanceof File)) return NextResponse.json({ error: "Selecciona una foto." }, { status: 400 });
  if (archivo.size > MAX || archivo.size < 100) return NextResponse.json({ error: "La foto debe pesar menos de 8 MB." }, { status: 400 });
  const bytes = Buffer.from(await archivo.arrayBuffer());
  const extension = tipoReal(bytes);
  if (!extension) return NextResponse.json({ error: "Solo se aceptan fotos JPG, PNG o WebP válidas." }, { status: 400 });
  const carpeta = await mkdtemp(path.join(tmpdir(), `robjans-${randomUUID()}-`));
  try {
    const entrada = path.join(carpeta, `entrada.${extension}`);
    const salida = path.join(carpeta, "salida.webp");
    await writeFile(entrada, bytes);
    await ejecutar(process.env.PYTHON || "python3", [path.resolve(process.cwd(), "..", "scripts", "recortar-foto.py"), entrada, salida], { timeout: 120000, maxBuffer: 1024 * 1024 });
    const recortada = await readFile(salida);
    const db = await baseDeDatos();
    await db.collection<{ _id: string; datos: Binary; tipo: string; actualizado: string }>(COLECCIONES.fotos).updateOne(
      { _id: slug },
      { $set: { datos: new Binary(recortada), tipo: "image/webp", actualizado: new Date().toISOString() } },
      { upsert: true },
    );
    const imagen = `/fotos/${slug}.webp`;
    await coleccion.updateOne({ slug }, { $set: { imagen, actualizado: new Date().toISOString() } });
    return NextResponse.json({ imagen });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "No se pudo procesar la foto.";
    return NextResponse.json({ error: `No se pudo procesar la foto: ${mensaje.slice(0, 200)}` }, { status: 400 });
  } finally {
    await rm(carpeta, { recursive: true, force: true });
  }
}
