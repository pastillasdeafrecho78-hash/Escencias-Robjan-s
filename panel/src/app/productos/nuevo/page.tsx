import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { ProductForm } from "@/components/ProductForm";
import { exigirSesion } from "@/lib/auth";

export default async function NuevaEsenciaPage() {
  await exigirSesion();
  return <AdminShell><Link href="/" className="back-link">← Volver a esencias</Link><div className="page-heading"><div><p className="eyebrow">Alta</p><h1>Nueva esencia</h1><p className="subtle">Escribe los datos del frasco y guarda. La foto se procesa al subirla.</p></div></div><ProductForm /></AdminShell>;
}
