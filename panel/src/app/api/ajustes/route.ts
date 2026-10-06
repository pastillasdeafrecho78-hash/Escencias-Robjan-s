import { NextRequest, NextResponse } from "next/server";
import { autorizarApi } from "@/lib/auth";
import { guardarAjustes } from "@/lib/data";

export async function PUT(request: NextRequest) {
  if (!autorizarApi(request)) return NextResponse.json({ error: "Sesión requerida." }, { status: 401 });
  try {
    const cuerpo = await request.json();
    const ajustes = await guardarAjustes({ chico: Number(cuerpo.chico), mediano: Number(cuerpo.mediano), grande: Number(cuerpo.grande) });
    return NextResponse.json({ ajustes });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudieron guardar los precios." }, { status: 400 });
  }
}
