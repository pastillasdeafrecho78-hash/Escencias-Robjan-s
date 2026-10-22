import type { Metadata } from "next";
import Link from "next/link";
import { tienda } from "@/lib/tienda";

export const metadata: Metadata = { title: "Términos de compra", description: "Condiciones generales para solicitar productos a Esencias Robjan's." };

export default function TerminosPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 text-sm leading-7 text-muted">
      <p className="etiqueta">Información del sitio</p>
      <h1 className="titulo mt-3 text-5xl text-bone">Términos de compra</h1>
      <p className="mt-5">Última actualización: 22 de octubre de 2026.</p>
      <h2 className="titulo mt-9 text-3xl text-bone">Pedidos</h2>
      <p className="mt-3">El catálogo permite preparar una solicitud y enviarla por WhatsApp. El envío del mensaje no confirma disponibilidad, precio final, entrega ni reserva. La tienda confirmará esos detalles antes de concretar la compra.</p>
      <h2 className="titulo mt-9 text-3xl text-bone">Pago y entrega</h2>
      <p className="mt-3">Este sitio no cobra en línea ni solicita datos de tarjeta. La tienda acordará contigo el medio de pago, la entrega o la recolección. Los costos de envío se confirman antes de aceptar el pedido.</p>
      <h2 className="titulo mt-9 text-3xl text-bone">Cambios y aclaraciones</h2>
      <p className="mt-3">Si necesitas cambiar o cancelar una solicitud, o tienes una duda sobre un producto, contacta a la tienda antes de finalizar la compra en <a className="underline" href={`mailto:${tienda.email}`}>{tienda.email}</a> o mediante los medios indicados en <Link className="underline" href="/contacto">Contacto</Link>. Los derechos que te corresponden por ley siguen siendo aplicables.</p>
      <p className="mt-10"><Link className="underline" href="/aviso-de-privacidad">Consultar privacidad</Link></p>
    </main>
  );
}
