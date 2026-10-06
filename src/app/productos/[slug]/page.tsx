import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductoDetalle } from "@/components/ProductoDetalle";
import { relacionados } from "@/lib/catalog";
import { obtenerCatalogo, obtenerProducto } from "@/lib/catalogo-servidor";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const producto = await obtenerProducto(slug);
  if (!producto) return { title: "Esencia no encontrada" };
  return {
    title: producto.nombre,
    description: `${producto.nombre}${producto.marca ? `, inspiración de ${producto.marca}` : ""}. ${producto.descripcion}`,
  };
}

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { productos } = await obtenerCatalogo();
  const producto = productos.find((item) => item.slug === slug);
  if (!producto) notFound();

  return <ProductoDetalle producto={producto} otros={relacionados(productos, producto)} />;
}
