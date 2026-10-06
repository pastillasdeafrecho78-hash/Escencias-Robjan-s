import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export const COOKIE = "robjans_panel_session";
const DURACION = 12 * 60 * 60;
const VENTANA = 15 * 60 * 1000;
const LIMITE = 5;
const intentos = new Map<string, { veces: number; hasta: number }>();

function secreto() {
  const valor = process.env.PANEL_SECRET;
  if (!valor || valor.length < 32) throw new Error("Configura PANEL_SECRET con al menos 32 caracteres.");
  return valor;
}

export function configurado() {
  return Boolean(process.env.PANEL_PASSWORD && process.env.PANEL_PASSWORD.length >= 10 && process.env.PANEL_SECRET && process.env.PANEL_SECRET.length >= 32 && process.env.MONGODB_URI);
}

function firma(payload: string) {
  return createHmac("sha256", secreto()).update(payload).digest("base64url");
}

export function crearSesion() {
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + DURACION, nonce: randomBytes(12).toString("hex") })).toString("base64url");
  return `${payload}.${firma(payload)}`;
}

export function sesionValida(valor: string | undefined) {
  if (!valor || !configurado()) return false;
  const [payload, recibido, extra] = valor.split(".");
  if (!payload || !recibido || extra) return false;
  const esperado = firma(payload);
  if (recibido.length !== esperado.length || !timingSafeEqual(Buffer.from(recibido), Buffer.from(esperado))) return false;
  try {
    const dato = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return Number.isInteger(dato.exp) && dato.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export async function sesionActual() {
  return sesionValida((await cookies()).get(COOKIE)?.value);
}

export async function exigirSesion() {
  if (!(await sesionActual())) redirect("/entrar");
}

export function autorizarApi(request: NextRequest) {
  if (!sesionValida(request.cookies.get(COOKIE)?.value)) return false;
  return mismoOrigen(request);
}

/** Next puede normalizar request.url a localhost aunque el navegador abrió 127.0.0.1. */
export function mismoOrigen(request: NextRequest) {
  const origen = request.headers.get("origin");
  const host = request.headers.get("host");
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  if (!origen) return true;
  try {
    const url = new URL(origen);
    return Boolean(host && url.host === host && ["http:", "https:"].includes(url.protocol));
  } catch {
    return false;
  }
}

export function verificarContrasena(entrada: string) {
  const esperada = process.env.PANEL_PASSWORD;
  if (!esperada || esperada.length < 10) return false;
  const a = createHash("sha256").update(entrada).digest();
  const b = createHash("sha256").update(esperada).digest();
  return timingSafeEqual(a, b);
}

export function falloDeAcceso(ip: string, acierto: boolean) {
  const ahora = Date.now();
  const anterior = intentos.get(ip);
  const estado = anterior && anterior.hasta > ahora ? anterior : { veces: 0, hasta: ahora + VENTANA };
  if (acierto) {
    intentos.delete(ip);
    return { bloqueado: false, restantes: LIMITE };
  }
  estado.veces += 1;
  intentos.set(ip, estado);
  return { bloqueado: estado.veces >= LIMITE, restantes: Math.max(0, LIMITE - estado.veces) };
}

export function estaBloqueado(ip: string) {
  const estado = intentos.get(ip);
  return Boolean(estado && estado.hasta > Date.now() && estado.veces >= LIMITE);
}

export const SEGUNDOS_SESION = DURACION;
