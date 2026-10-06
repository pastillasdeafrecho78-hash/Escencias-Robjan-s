import { NextRequest, NextResponse } from "next/server";
import { autorizarApi } from "@/lib/auth";
import { coleccionProductos, validarProducto } from "@/lib/data";

export async function POST(request: NextRequest) {
  if (!autorizarApi(request)) return NextResponse.json({ error: "Sesión requerida." }, { status: 401 });
  try {
    const producto = validarProducto(await request.json());
    const coleccion = await coleccionProductos();
    await coleccion.createIndex({ slug: 1 }, { unique: true });
    if (await coleccion.findOne({ slug: producto.slug })) return NextResponse.json({ error: "Ya existe una esencia con ese nombre o slug." }, { status: 409 });
    await coleccion.insertOne(producto);
    return NextResponse.json({ producto }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === 11000) return NextResponse.json({ error: "Ya existe una esencia con ese slug." }, { status: 409 });
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo guardar." }, { status: 400 });
  }
}
