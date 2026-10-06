import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { ProductList } from "@/components/ProductList";
import { exigirSesion } from "@/lib/auth";
import { listarProductos } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function InicioPanel() {
  await exigirSesion();
  try {
    const productos = await listarProductos();
    return <AdminShell><div className="page-heading"><div><p className="eyebrow">Tu catálogo</p><h1>Esencias</h1><p className="subtle">Edita cada frasco sin tocar el código de la tienda.</p></div><Link href="/productos/nuevo" className="primary-button">+ Nueva esencia</Link></div><ProductList productos={productos} /></AdminShell>;
  } catch (error) {
    return <AdminShell><div className="page-heading"><div><p className="eyebrow">Base de datos</p><h1>Sin conexión</h1><p className="subtle">Revisa MONGODB_URI y que MongoDB esté encendido.</p><p className="form-error">{error instanceof Error ? error.message : "No se pudo leer la base."}</p></div></div></AdminShell>;
  }
}
