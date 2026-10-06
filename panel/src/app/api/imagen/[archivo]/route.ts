import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Binary } from "mongodb";
import { NextRequest } from "next/server";
import { COLECCIONES, baseDeDatos } from "@compartido/mongo";
import { COOKIE, sesionValida } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ archivo: string }> }) {
  if (!sesionValida(request.cookies.get(COOKIE)?.value)) return new Response("Sesión requerida", { status: 401 });
  const { archivo } = await params;
  if (!/^[a-z0-9-]+\.webp$/.test(archivo)) return new Response("Foto inválida", { status: 400 });
  try {
    if (request.nextUrl.searchParams.get("origen") === "catalogo") {
      const bytes = await readFile(path.resolve(process.cwd(), "..", "public", "catalogo", archivo));
      return new Response(new Uint8Array(bytes), { headers: { "Content-Type": "image/webp", "Cache-Control": "private, max-age=300" } });
    }
    const db = await baseDeDatos();
    const foto = await db.collection<{ _id: string; datos: Binary }>(COLECCIONES.fotos).findOne({ _id: archivo.replace(/\.webp$/, "") });
    if (!foto) return new Response("No encontrada", { status: 404 });
    return new Response(new Uint8Array(foto.datos.buffer), { headers: { "Content-Type": "image/webp", "Cache-Control": "private, max-age=60" } });
  } catch {
    return new Response("No encontrada", { status: 404 });
  }
}
