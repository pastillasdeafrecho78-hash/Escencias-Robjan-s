"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { claseFondo } from "@/lib/lado";
import { money } from "@/lib/money";

export function CartDrawer() {
  const { items, total, drawerOpen, closeDrawer, setQty, remove } = useCart();
  const [aviso, setAviso] = useState<string | null>(null);
  const panel = useRef<HTMLElement>(null);
  const cerrar = useRef(closeDrawer);
  cerrar.current = closeDrawer;

  useEffect(() => {
    if (!drawerOpen) return;
    const previo = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>("[data-cerrar]")?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        cerrar.current();
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;
      const enfocables = [...panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];
      if (event.shiftKey && document.activeElement === primero) {
        event.preventDefault();
        ultimo?.focus();
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primero?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (previo?.isConnected) previo.focus();
    };
  }, [drawerOpen]);

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar carrito"
        className="absolute inset-0 bg-black/60"
        onClick={closeDrawer}
      />
      <aside
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-carrito"
        className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col border-l border-line bg-ink"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="titulo-carrito" className="titulo text-3xl">
            Carrito
          </h2>
          <button type="button" data-cerrar onClick={closeDrawer} className="text-sm text-muted hover:text-bone">
            Cerrar
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center px-5">
            <p className="titulo text-4xl">Todavía no hay frascos.</p>
            <p className="mt-2 text-sm text-muted">Elige una esencia y el tamaño que vas a usar.</p>
            <Link href="/productos" onClick={closeDrawer} className="btn mt-6">
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3 border-b border-line pb-4">
                  <div className={`${claseFondo(item.categoria)} flex h-20 w-14 shrink-0 items-end justify-center rounded-xl`}>
                    {item.imagen ? (
                      <Image src={item.imagen} alt="" width={64} height={80} className="h-full w-full object-contain" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="titulo text-xl leading-tight">{item.nombre}</p>
                    <p className="text-sm text-muted">
                      {item.ml} ml · {money(item.precio)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
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
                      <span className="cifra w-6 text-center text-sm" aria-live="polite">
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
                      <button type="button" className="ml-auto text-xs text-muted hover:text-alert" onClick={() => remove(item.key)}>
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-5 py-4">
              {aviso && (
                <p className="mb-3 text-sm text-alert" role="status">
                  {aviso}
                </p>
              )}
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted">Total</span>
                <span className="titulo cifra text-4xl">{money(total)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">El cobro de esta tienda está en modo prueba: no se hace un cargo real.</p>
              <Link href="/pedido" onClick={closeDrawer} className="btn mt-4 w-full">
                Armar pedido
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
