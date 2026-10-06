import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { configurado, sesionActual } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EntrarPage() {
  if (await sesionActual()) redirect("/");
  return <main className="login-page"><div className="login-mark">R</div>{!configurado() && <p className="setup-alert">Falta configurar `panel/.env.local` con MONGODB_URI, PANEL_PASSWORD y PANEL_SECRET.</p>}<LoginForm /></main>;
}
