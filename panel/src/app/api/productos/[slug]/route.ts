import { NextRequest, NextResponse } from "next/server";
import { autorizarApi } from "@/lib/auth";
import { coleccionProductos, validarProducto } from "@/lib/data";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!autorizarApi(request)) return NextResponse.json({ error: "Sesión requerida." }, { status: 401 });
  const { slug } = await params;
  if (!/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ error: "Slug inválido." }, { status: 400 });
  try {
    const producto = validarProducto(await request.json(), slug);
    const coleccion = await coleccionProductos();
    const resultado = await coleccion.updateOne({ slug }, { $set: producto });
    if (!resultado.matchedCount) return NextResponse.json({ error: "Esencia no encontrada." }, { status: 404 });
    return NextResponse.json({ producto });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo guardar." }, { status: 400 });
  }
}
