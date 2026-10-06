"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { money } from "@/lib/money";
import { mensajePedido, type Pedido } from "@/lib/pedido";
import { enlaceWhatsapp, textoEntrega, tienda } from "@/lib/tienda";

const STORAGE = "esencias-robjans-pedido";

export default function PedidoListoPage() {
  const [pedido, setPedido] = useState<Pedido | null | undefined>(undefined);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE);
    if (!raw) {
      setPedido(null);
      return;
    }
    try {
      setPedido(JSON.parse(raw) as Pedido);
    } catch {
      setPedido(null);
    }
  }, []);

  if (pedido === undefined) {
    return <p className="mx-auto max-w-xl px-5 py-16 text-sm text-muted">Buscando tu folio…</p>;
  }

  if (!pedido) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16">
        <h1 className="titulo text-5xl">No hay un pedido reciente.</h1>
        <p className="mt-3 text-sm text-muted">Si acabas de confirmarlo, ábrelo en la misma pestaña. Si no, arma uno desde el catálogo.</p>
        <Link href="/productos" className="btn mt-6">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  const texto = mensajePedido(pedido);

  return (
    <div className="page-stage mx-auto max-w-2xl px-5 py-14">
      <p className="etiqueta">
        {pedido.pago === "prueba" ? "Pago de prueba aceptado" : "Pedido apartado"}
      </p>
      <h1 className="titulo cifra mt-2 text-6xl sm:text-7xl">{pedido.folio}</h1>
      <p className="mt-4 text-sm leading-6 text-muted">
        {pedido.pago === "prueba"
          ? `${pedido.nombre}, la simulación terminó sin cargo real. Mándale el folio a la tienda para coordinar ${pedido.entrega === "envio" ? "el envío." : `tu pedido: ${textoEntrega(pedido.entrega).toLowerCase()}.`}`
          : `${pedido.nombre}, este pedido todavía no tiene pago de prueba.`}
      </p>
      {pedido.pago !== "prueba" && (
        <Link href="/pedido/pago" className="mt-4 inline-block text-sm underline underline-offset-4">
          Ir al pago de prueba
        </Link>
      )}
      <ul className="mt-8 space-y-2 border border-line p-5 text-sm">
        {pedido.items.map((item) => (
          <li key={`${item.slug}-${item.ml}`} className="flex justify-between gap-3">
            <span>
              {item.cantidad} × {item.nombre} · {item.ml} ml
            </span>
            <span className="cifra">{money(item.precio * item.cantidad)}</span>
          </li>
        ))}
        <li className="flex justify-between border-t border-line pt-3 text-2xl">
          <span className="text-base">Total</span>
          <span className="cifra">{money(pedido.total)}</span>
        </li>
      </ul>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a href={enlaceWhatsapp(texto)} target="_blank" rel="noreferrer" className="btn">
          Enviar por WhatsApp
        </a>
        <a href={`tel:+${tienda.telefonoWa}`} className="btn btn-line">
          Llamar a la tienda
        </a>
      </div>
      <p className="mt-6 text-xs leading-5 text-muted">
        Este folio vive en esta pestaña. Si cierras el navegador, vuelve a escribirle a la tienda con los frascos que quieres.
      </p>
    </div>
  );
}
