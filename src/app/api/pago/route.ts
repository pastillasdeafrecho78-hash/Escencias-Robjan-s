import { NextResponse } from "next/server";

const TARJETA_PRUEBA = "4242424242424242";
const TARJETA_RECHAZADA = "4000000000000002";

function digitos(valor: unknown) {
  return String(valor ?? "").replace(/\D/g, "");
}

export async function POST(request: Request) {
  let body: { numero?: string; vencimiento?: string; cvc?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "No llegó el pago." }, { status: 400 });
  }

  const numero = digitos(body.numero);
  const cvc = digitos(body.cvc);
  const vencimiento = String(body.vencimiento ?? "").trim();
  const partes = /^(\d{2})\s*\/\s*(\d{2})$/.exec(vencimiento);

  if (!partes) {
    return NextResponse.json({ error: "Escribe el vencimiento como MM/AA." }, { status: 400 });
  }

  const mes = Number(partes[1]);
  const anio = 2000 + Number(partes[2]);
  if (mes < 1 || mes > 12) {
    return NextResponse.json({ error: "Ese mes no existe." }, { status: 400 });
  }

  const hoy = new Date();
  const sigueVigente = anio > hoy.getFullYear() || (anio === hoy.getFullYear() && mes >= hoy.getMonth() + 1);
  if (!sigueVigente) {
    return NextResponse.json({ error: "Esa tarjeta ya venció." }, { status: 400 });
  }

  if (cvc.length < 3) {
    return NextResponse.json({ error: "El CVC necesita 3 dígitos." }, { status: 400 });
  }

  if (numero === TARJETA_RECHAZADA) {
    return NextResponse.json(
      { error: "El banco de prueba rechazó la tarjeta. Prueba con 4242 4242 4242 4242." },
      { status: 402 },
    );
  }

  if (numero !== TARJETA_PRUEBA) {
    return NextResponse.json(
      { error: "En modo prueba solo pasa la tarjeta 4242 4242 4242 4242." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, pago: "prueba" });
}
