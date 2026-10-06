import { NextRequest, NextResponse } from "next/server";
import { COOKIE, SEGUNDOS_SESION, configurado, crearSesion, estaBloqueado, falloDeAcceso, mismoOrigen, verificarContrasena } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!configurado()) return NextResponse.json({ error: "Configura el panel antes de entrar." }, { status: 503 });
  if (!mismoOrigen(request)) return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });
  const clave = "local";
  if (estaBloqueado(clave)) return NextResponse.json({ error: "Demasiados intentos. Espera 15 minutos." }, { status: 429 });
  const cuerpo = await request.json().catch(() => null);
  const contrasena = typeof cuerpo?.contrasena === "string" ? cuerpo.contrasena : "";
  const correcto = verificarContrasena(contrasena);
  const estado = falloDeAcceso(clave, correcto);
  if (!correcto) return NextResponse.json({ error: estado.bloqueado ? "Demasiados intentos. Espera 15 minutos." : `Contraseña incorrecta. Quedan ${estado.restantes} intentos.` }, { status: estado.bloqueado ? 429 : 401 });
  const respuesta = NextResponse.json({ ok: true });
  respuesta.cookies.set(COOKIE, crearSesion(), { httpOnly: true, sameSite: "strict", secure: false, path: "/", maxAge: SEGUNDOS_SESION });
  respuesta.headers.set("Cache-Control", "no-store");
  return respuesta;
}
