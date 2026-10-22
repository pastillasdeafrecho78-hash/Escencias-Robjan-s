import { NextResponse } from "next/server";
import type { ItemPedido } from "@/lib/pedido";
import { sucursales } from "@/lib/tienda";
import { obtenerCatalogo } from "@/lib/catalogo-servidor";

type Body = {
  nombre?: string;
  telefono?: string;
  entrega?: string;
  nota?: string;
  items?: ItemPedido[];
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "El pedido no llegó completo." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "El pedido no llegó completo." }, { status: 400 });
  }

  const nombre = typeof body.nombre === "string" ? body.nombre.trim() : "";
  const telefono = typeof body.telefono === "string" ? body.telefono.replace(/\D/g, "") : "";
  const entrega = body.entrega;
  const nota = typeof body.nota === "string" ? body.nota.trim() : "";
  const items = Array.isArray(body.items) ? body.items : [];

  if (nombre.length < 2 || nombre.length > 100) {
    return NextResponse.json({ error: "Escribe tu nombre para apartar el pedido.", campo: "nombre" }, { status: 400 });
  }
  if (telefono.length < 10 || telefono.length > 15) {
    return NextResponse.json({ error: "El WhatsApp necesita 10 dígitos, por ejemplo 418 123 4567.", campo: "telefono" }, { status: 400 });
  }
  if (entrega !== "envio" && !sucursales.some((sucursal) => sucursal.id === entrega)) {
    return NextResponse.json({ error: "Elige en qué sucursal recoges o si quieres envío.", campo: "entrega" }, { status: 400 });
  }
  if (items.length === 0 || items.length > 20) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }
  if (nota.length > 280) {
    return NextResponse.json({ error: "La nota pasa de 280 letras; recórtala un poco.", campo: "nota" }, { status: 400 });
  }

  const { productos } = await obtenerCatalogo();
  const porSlug = new Map(productos.map((producto) => [producto.slug, producto]));
  const limpios: ItemPedido[] = [];
  for (const item of items) {
    const producto = item && typeof item.slug === "string" ? porSlug.get(item.slug) : undefined;
    const ml = Number(item?.ml);
    const cantidad = Number(item?.cantidad);
    if (!producto || ![30, 50, 100].includes(ml) || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > 10) {
      return NextResponse.json({ error: "Hay un frasco inválido en el pedido." }, { status: 400 });
    }
    limpios.push({ slug: producto.slug, nombre: producto.nombre, ml, cantidad, precio: producto.precios[ml as 30 | 50 | 100] });
  }

  const total = limpios.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const folio = `RJ-${Date.now().toString(36).toUpperCase()}`;

  return NextResponse.json({
    folio,
    nombre,
    telefono,
    entrega,
    nota,
    items: limpios,
    total,
    creado: new Date().toISOString(),
    pago: "pendiente",
  });
}
