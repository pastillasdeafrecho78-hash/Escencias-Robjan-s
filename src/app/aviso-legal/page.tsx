import type { Metadata } from "next";
import Link from "next/link";
import { tienda } from "@/lib/tienda";

export const metadata: Metadata = { title: "Aviso legal", description: "Información general del sitio Esencias Robjan's." };

export default function AvisoLegalPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 text-sm leading-7 text-muted">
      <p className="etiqueta">Información del sitio</p>
      <h1 className="titulo mt-3 text-5xl text-bone">Aviso legal</h1>
      <p className="mt-5">Este sitio presenta el catálogo y los canales de contacto de Esencias Robjan&apos;s. Para consultas sobre productos o contenido, escribe a <a className="underline" href={`mailto:${tienda.email}`}>{tienda.email}</a>.</p>
      <p className="mt-5">Los nombres de marcas de terceros que puedan aparecer se usan como referencia descriptiva de fragancias inspiradas. Este sitio no afirma afiliación con dichas marcas. Las imágenes, textos y diseño del sitio no deben reutilizarse sin autorización de sus titulares.</p>
      <p className="mt-5">Consulta también los <Link className="underline" href="/terminos">términos de compra</Link> y el <Link className="underline" href="/aviso-de-privacidad">aviso de privacidad</Link>.</p>
    </main>
  );
}
