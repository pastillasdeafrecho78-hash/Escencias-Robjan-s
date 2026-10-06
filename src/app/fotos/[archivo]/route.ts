import type { Binary } from "mongodb";
import { COLECCIONES, baseDeDatos, hayMongo } from "@compartido/mongo";

type Foto = { _id: string; datos: Binary; tipo: string };

/** Fotos que el dueño sube desde el panel. Las del PDF siguen en public/catalogo. */
export async function GET(_request: Request, { params }: { params: Promise<{ archivo: string }> }) {
  const { archivo } = await params;
  const slug = archivo.replace(/\.webp$/, "");
  if (!hayMongo() || !/^[a-z0-9-]+$/.test(slug)) return new Response("No encontrada", { status: 404 });

  try {
    const db = await baseDeDatos();
    const foto = await db.collection<Foto>(COLECCIONES.fotos).findOne({ _id: slug });
    if (!foto) return new Response("No encontrada", { status: 404 });
    return new Response(new Uint8Array(foto.datos.buffer), {
      headers: {
        "Content-Type": foto.tipo || "image/webp",
        "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new Response("Sin conexión con las fotos", { status: 503 });
  }
}
