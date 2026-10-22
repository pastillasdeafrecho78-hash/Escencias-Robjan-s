import { NextResponse } from "next/server";

// La tienda no procesa pagos en línea. Nunca aceptar datos de tarjeta aquí.
export async function POST() {
  return NextResponse.json(
    { error: "No se procesan pagos en este sitio. Confirma tu pedido con la tienda." },
    { status: 410 },
  );
}
