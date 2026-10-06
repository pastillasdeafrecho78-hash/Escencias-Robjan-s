import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { ProductForm } from "@/components/ProductForm";
import { exigirSesion } from "@/lib/auth";
import { buscarProducto } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditarEsenciaPage({ params }: { params: Promise<{ slug: string }> }) {
  await exigirSesion();
  const { slug } = await params;
  if (!/^[a-z0-9-]+$/.test(slug)) notFound();
  const producto = await buscarProducto(slug);
  if (!producto) notFound();
  return <AdminShell><Link href="/" className="back-link">← Volver a esencias</Link><div className="page-heading"><div><p className="eyebrow">Editar esencia</p><h1>{producto.nombre}</h1><p className="subtle">{producto.categoria} · {producto.slug}</p></div></div><ProductForm inicial={producto} /></AdminShell>;
}
