import type { Metadata } from "next";
import Link from "next/link";
import { tienda } from "@/lib/tienda";

export const metadata: Metadata = { title: "Aviso de privacidad", description: "Información sobre el uso de datos en Esencias Robjan's." };

export default function PrivacidadPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 text-sm leading-7 text-muted">
      <p className="etiqueta">Información del sitio</p>
      <h1 className="titulo mt-3 text-5xl text-bone">Aviso de privacidad</h1>
      <p className="mt-5">Última actualización: 22 de octubre de 2026.</p>
      <h2 className="titulo mt-9 text-3xl text-bone">Contacto</h2>
      <p className="mt-3">Esencias Robjan&apos;s atiende consultas sobre los datos compartidos en este sitio mediante <a className="underline" href={`mailto:${tienda.email}`}>{tienda.email}</a>. Puedes consultar nuestras sucursales y medios de contacto en <Link className="underline" href="/contacto">Contacto</Link>.</p>
      <h2 className="titulo mt-9 text-3xl text-bone">Datos y finalidad</h2>
      <p className="mt-3">Al preparar un pedido puedes indicar nombre, teléfono, productos y forma de entrega. Estos datos se usan para preparar el mensaje de pedido que decides enviar por WhatsApp y para responderte o coordinar la compra. El sitio también puede procesar datos técnicos necesarios para funcionar y protegerse.</p>
      <h2 className="titulo mt-9 text-3xl text-bone">Servicios externos</h2>
      <p className="mt-3">Al abrir WhatsApp, Facebook, Instagram o los mapas, accedes a servicios externos sujetos a sus propias políticas. El sitio se aloja en Vercel. No introduzcas datos de tarjeta en mensajes o formularios de este sitio: la compra se confirma directamente con la tienda.</p>
      <h2 className="titulo mt-9 text-3xl text-bone">Tus solicitudes</h2>
      <p className="mt-3">Para pedir acceso, corrección, eliminación u oposición al uso de tus datos, escribe al correo anterior e indica cómo podemos identificar tu solicitud. Publicaremos los cambios de este aviso en esta página.</p>
      <p className="mt-10"><Link className="underline" href="/terminos">Consultar términos de compra</Link></p>
    </main>
  );
}
