"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAgregar } from "@/components/AddButton";
import { TAMANOS, type Producto } from "@/lib/catalog";
import { money } from "@/lib/money";

/** El botón de la tarjeta: abre los tres tamaños ahí mismo y añade sin salir del catálogo. */
export function ElegirTamano({ producto }: { producto: Producto }) {
  const agregar = useAgregar(producto);
  const [abierto, setAbierto] = useState(false);
  const [enHoja, setEnHoja] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const disparador = useRef<HTMLButtonElement>(null);
  const titulo = useId();

  const cerrar = (devolverFoco = true) => {
    setAbierto(false);
    setMensaje(null);
    if (devolverFoco) disparador.current?.focus();
  };

  useEffect(() => {
    if (!abierto) return;
    panel.current?.querySelector<HTMLButtonElement>("[data-tamano]")?.focus();

    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        evento.preventDefault();
        cerrar();
        return;
      }
      if (evento.key !== "Tab" || !panel.current) return;
      const enfocables = [...panel.current.querySelectorAll<HTMLButtonElement>("button")];
      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    };
    const alTocarFuera = (evento: PointerEvent) => {
      const objetivo = evento.target as Node;
      if (!panel.current?.contains(objetivo) && !disparador.current?.contains(objetivo)) cerrar(false);
    };
    document.addEventListener("keydown", alTeclear);
    document.addEventListener("pointerdown", alTocarFuera);
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.removeEventListener("pointerdown", alTocarFuera);
    };
  }, [abierto]);

  const capa = (
    <>
      <div aria-hidden className="tamanos-velo fixed inset-0 z-40 touch-none overscroll-contain bg-ink/60 backdrop-blur-[2px] sm:hidden" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titulo}
        className="tamanos-panel fixed inset-x-0 bottom-0 z-50 touch-manipulation overscroll-contain rounded-t-[1.5rem] border border-line bg-field/95 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-md sm:absolute sm:inset-x-0 sm:top-auto sm:bottom-full sm:z-20 sm:mb-2 sm:rounded-[1.25rem] sm:p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="etiqueta">Elige el tamaño</p>
            <p id={titulo} className="titulo mt-1 truncate text-2xl">
              {producto.nombre}
            </p>
          </div>
          <button
            type="button"
            onClick={() => cerrar()}
            aria-label="Cerrar"
            className="-mt-1 -mr-1 grid size-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-ink hover:text-bone"
          >
            ✕
          </button>
        </div>
        <ul className="mt-4 grid gap-2">
          {TAMANOS.map((tamano) => (
            <li key={tamano.ml}>
              <button
                type="button"
                data-tamano
                onClick={() => {
                  const error = agregar(tamano.ml);
                  if (error) setMensaje(error);
                  else cerrar(false);
                }}
                className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-line px-4 py-3 text-left transition-colors hover:border-bone hover:bg-ink focus-visible:border-bone focus-visible:outline-none"
              >
                <span>
                  <span className="block text-sm text-bone">{tamano.etiqueta}</span>
                  <span className="block text-xs text-muted">{tamano.ml} ml</span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="titulo cifra text-2xl">{money(producto.precios[tamano.ml])}</span>
                  <span
                    aria-hidden
                    className="grid size-7 place-items-center rounded-full border border-line text-sm text-bone-dim transition-colors group-hover:border-bone group-hover:bg-bone group-hover:text-ink"
                  >
                    +
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        {mensaje && (
          <p className="mt-3 text-xs text-alert" role="status">
            {mensaje}
          </p>
        )}
      </div>
    </>
  );

  if (producto.stock === 0) return <p className="text-xs text-muted">Agotada</p>;

  return (
    <>
      <button
        ref={disparador}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={abierto}
        onClick={() => {
          if (abierto) return cerrar();
          setEnHoja(!window.matchMedia("(min-width: 640px)").matches);
          setAbierto(true);
        }}
        className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-xs text-bone-dim transition-colors hover:border-bone hover:text-bone aria-expanded:border-bone aria-expanded:text-bone"
      >
        <span aria-hidden className="text-sm leading-none">+</span>
        <span className="sm:hidden">Añadir</span>
        <span className="hidden sm:inline">Añadir al carrito</span>
      </button>

      {abierto && (enHoja ? createPortal(capa, document.body) : capa)}
    </>
  );
}
