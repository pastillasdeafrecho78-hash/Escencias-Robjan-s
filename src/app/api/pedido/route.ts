import { NextResponse } from "next/server";
import type { ItemPedido } from "@/lib/pedido";
import { sucursales } from "@/lib/tienda";

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

  const nombre = body.nombre?.trim() ?? "";
  const telefono = (body.telefono ?? "").replace(/\D/g, "");
  const entrega = body.entrega;
  const nota = body.nota?.trim() ?? "";
  const items = Array.isArray(body.items) ? body.items : [];

  if (nombre.length < 2) {
    return NextResponse.json({ error: "Escribe tu nombre para apartar el pedido.", campo: "nombre" }, { status: 400 });
  }
  if (telefono.length < 10) {
    return NextResponse.json({ error: "El WhatsApp necesita 10 dígitos, por ejemplo 418 123 4567.", campo: "telefono" }, { status: 400 });
  }
  if (entrega !== "envio" && !sucursales.some((sucursal) => sucursal.id === entrega)) {
    return NextResponse.json({ error: "Elige en qué sucursal recoges o si quieres envío.", campo: "entrega" }, { status: 400 });
  }
  if (items.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }
  if (nota.length > 280) {
    return NextResponse.json({ error: "La nota pasa de 280 letras; recórtala un poco.", campo: "nota" }, { status: 400 });
  }

  const limpios = items.filter(
    (item) => item && item.nombre && item.cantidad > 0 && item.precio > 0 && item.ml > 0,
  );
  if (limpios.length === 0) {
    return NextResponse.json({ error: "No hay frascos válidos en el pedido." }, { status: 400 });
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
