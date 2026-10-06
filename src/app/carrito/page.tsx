"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { claseFondo } from "@/lib/lado";
import { money } from "@/lib/money";

export default function CarritoPage() {
  const { items, total, ready, setQty, remove } = useCart();
  const [aviso, setAviso] = useState<string | null>(null);

  return (
    <div className="page-stage mx-auto max-w-4xl px-5 py-12">
      <p className="etiqueta">Tu selección</p>
      <h1 className="titulo text-6xl sm:text-7xl">Carrito</h1>
      <p className="mt-2 text-sm text-muted">Revisa tamaños y cantidades antes de armar el pedido.</p>

      {!ready ? (
        <p className="mt-10 text-sm text-muted">Buscando lo que habías apartado…</p>
      ) : items.length === 0 ? (
        <div className="mt-16">
          <h2 className="titulo text-5xl">El carrito está vacío.</h2>
          <p className="mt-2 text-sm text-muted">Cuando añadas un frasco, lo vas a ver aquí y en el panel de la derecha.</p>
          <Link href="/productos" className="btn mt-6">
            Elegir una esencia
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.key} className="flex gap-4 border-b border-line pb-4">
                <div className={`${claseFondo(item.categoria)} flex h-24 w-16 shrink-0 items-end justify-center rounded-xl`}>
                  {item.imagen ? (
                    <Image src={item.imagen} alt="" width={64} height={96} className="h-full w-full object-contain" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/productos/${item.slug}`} className="titulo text-2xl hover:text-bone-dim">
                    {item.nombre}
                  </Link>
                  <p className="text-sm text-muted">
                    {item.ml} ml · {item.categoria}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      className="h-8 w-8 rounded-full border border-line hover:border-bone-dim"
                      aria-label={`Quitar un frasco de ${item.nombre}`}
                      onClick={() => {
                        const resultado = setQty(item.key, item.cantidad - 1);
                        setAviso(resultado.ok ? null : resultado.message);
                      }}
                    >
                      −
                    </button>
                    <span className="cifra w-6 text-center" aria-live="polite">
                      {item.cantidad}
                    </span>
                    <button
                      type="button"
                      className="h-8 w-8 rounded-full border border-line hover:border-bone-dim"
                      aria-label={`Agregar un frasco de ${item.nombre}`}
                      onClick={() => {
                        const resultado = setQty(item.key, item.cantidad + 1);
                        setAviso(resultado.ok ? null : resultado.message);
                      }}
                    >
                      +
                    </button>
                    <button type="button" className="ml-3 text-sm text-muted hover:text-alert" onClick={() => remove(item.key)}>
                      Quitar
                    </button>
                    <span className="cifra ml-auto">{money(item.precio * item.cantidad)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="checkout-summary h-fit p-6">
            <p className="text-sm text-muted">Total a apartar</p>
            <p className="titulo cifra mt-1 text-6xl">{money(total)}</p>
            <p className="mt-3 text-sm leading-6 text-muted">
              Aquí preparas tu selección. El paso siguiente solo simula un pago: no se hace ningún cargo real.
              Envía el folio por WhatsApp para coordinar la entrega y el pago con la tienda.
            </p>
            {aviso && (
              <p className="mt-3 text-sm text-alert" role="status">
                {aviso}
              </p>
            )}
            <Link href="/pedido" className="btn mt-5 w-full">
              Continuar al pedido
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
