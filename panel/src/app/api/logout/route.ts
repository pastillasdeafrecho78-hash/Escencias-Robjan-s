import { NextRequest, NextResponse } from "next/server";
import { COOKIE, autorizarApi } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!autorizarApi(request)) return NextResponse.json({ error: "Sesión requerida." }, { status: 401 });
  const respuesta = NextResponse.json({ ok: true });
  respuesta.cookies.set(COOKIE, "", { httpOnly: true, sameSite: "strict", path: "/", maxAge: 0 });
  return respuesta;
}
