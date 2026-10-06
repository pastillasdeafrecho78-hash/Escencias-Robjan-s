"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AddButton } from "@/components/AddButton";
import { NotasBarras } from "@/components/NotasBarras";
import { ProductCard } from "@/components/ProductCard";
import { TAMANOS, type Producto, type TamanoMl } from "@/lib/catalog";
import { claseFondo } from "@/lib/lado";
import { money } from "@/lib/money";
import { enlaceWhatsapp } from "@/lib/tienda";

export function ProductoDetalle({ producto, otros }: { producto: Producto; otros: Producto[] }) {
  const [ml, setMl] = useState<TamanoMl>(50);
  const [cantidad, setCantidad] = useState(1);
  const precio = producto.precios[ml];
  const agotado = producto.stock === 0;

  return (
    <div>
      <div className="grid lg:grid-cols-[1.05fr_1fr]">
        <div
          className={`${claseFondo(producto.categoria)} apoyo relative flex min-h-[58svh] items-end justify-center overflow-hidden px-6 pt-12 pb-10 lg:sticky lg:top-14 lg:h-[calc(100svh-3.5rem)] lg:self-start`}
        >
          <p
            className="titulo pointer-events-none absolute inset-x-0 top-[12%] text-center text-[22vw] leading-none text-white/[0.035] italic select-none lg:text-[11vw]"
            aria-hidden
          >
            {producto.categoria}
          </p>
          {producto.imagen ? (
            <Image
              src={producto.imagen}
              alt={`Imagen de referencia de la fragancia que inspira ${producto.nombre}`}
              width={640}
              height={800}
              priority
              className="frasco entra relative h-[46svh] w-full object-contain lg:h-[68svh]"
            />
          ) : (
            <p className="titulo self-center text-3xl text-muted italic">Sin foto en el catálogo</p>
          )}
          <p className="detalle-imagen-aviso">Imagen de inspiración · La presentación de Robjan&apos;s puede variar</p>
        </div>

        <div className="px-5 py-12 sm:px-10 lg:px-14 lg:py-20">
          <nav className="etiqueta flex items-center gap-2">
            <Link href="/productos" className="hover:text-bone">
              Catálogo
            </Link>
            <span aria-hidden>·</span>
            <Link href={`/productos?categoria=${producto.categoria}`} className="hover:text-bone">
              {producto.categoria}
            </Link>
          </nav>
          <h1 className="titulo mt-6 text-[clamp(3rem,6.5vw,5.5rem)]">{producto.nombre}</h1>
          <p className="texto-editorial mt-3 text-bone-dim italic">
            {producto.marca ? `inspirada en ${producto.marca}` : "de Esencias Robjan's"}
          </p>
          <p className="etiqueta mt-6 text-bone-dim">{producto.familia}</p>
          {producto.notas.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2" aria-label="Notas principales">
              {producto.notas.slice(0, 3).map((nota) => (
                <span key={nota.nombre} className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-bone-dim">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: nota.color }} aria-hidden />
                  {nota.nombre}
                </span>
              ))}
            </div>
          )}

          <fieldset className="mt-12" disabled={agotado}>
            <legend className="etiqueta">Tamaño</legend>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {TAMANOS.map((tamano) => {
                const activo = ml === tamano.ml;
                return (
                  <button
                    key={tamano.ml}
                    type="button"
                    aria-pressed={activo}
                    onClick={() => setMl(tamano.ml)}
                    className={`rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                      activo ? "border-bone bg-white/[0.04]" : "border-line hover:border-bone-dim"
                    }`}
                  >
                    <span className="block text-xs text-muted">{tamano.etiqueta}</span>
                    <span className="titulo mt-1 block text-2xl">{tamano.ml} ml</span>
                    <span className="cifra mt-1 block text-sm text-bone-dim">{money(producto.precios[tamano.ml])}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div className="flex items-center rounded-full border border-line">
              <button
                type="button"
                className="h-11 w-11 rounded-full text-lg hover:bg-white/[0.05]"
                aria-label="Disminuir cantidad"
                onClick={() => setCantidad((valor) => Math.max(1, valor - 1))}
                disabled={agotado}
              >
                −
              </button>
              <span className="cifra w-8 text-center text-sm">{cantidad}</span>
              <button
                type="button"
                className="h-11 w-11 rounded-full text-lg hover:bg-white/[0.05]"
                aria-label="Aumentar cantidad"
                onClick={() => setCantidad((valor) => Math.min(producto.stock || 1, valor + 1))}
                disabled={agotado || cantidad >= producto.stock}
              >
                +
              </button>
            </div>
            <p className="titulo cifra text-5xl">{money(precio * cantidad)}</p>
          </div>

          <div className="mt-6 max-w-sm">
            <AddButton
              producto={producto}
              ml={ml}
              cantidad={cantidad}
              etiqueta={agotado ? "Agotada" : "Añadir al carrito"}
              className="btn w-full py-4 disabled:cursor-not-allowed"
            />
            <p className="mt-3 text-xs text-muted">
              {agotado ? "Sin frascos por ahora." : `${producto.stock} frascos en la tienda, entre todos los tamaños.`}
            </p>
            {!agotado && <p className="mt-2 text-xs text-bone-dim">Recoge en Centro o Rivera del Río. También tenemos envío local.</p>}
          </div>
          {agotado && (
            <a
              href={enlaceWhatsapp(`Hola, avísenme cuando vuelva ${producto.nombre}.`)}
              className="mt-4 inline-block text-sm text-bone-dim underline underline-offset-4"
            >
              Avisarme por WhatsApp cuando vuelva
            </a>
          )}

          <section className="mt-16 border-t border-line pt-10">
            <h2 className="titulo text-3xl">Cómo se siente</h2>
            <p className="mt-2 text-sm text-muted">Intensidad de cada nota, de lo que llega primero a lo que se queda.</p>
            <div className="mt-8 max-w-md">
              <NotasBarras notas={producto.notas} />
            </div>
          </section>
        </div>
      </div>

      {otros.length > 0 && (
        <section className="border-t border-line px-5 py-16 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <p className="etiqueta">Por sus notas</p>
            <h2 className="titulo mt-3 text-4xl">Si te gusta esta…</h2>
            <p className="mt-3 text-sm text-muted">Más fragancias con notas en común.</p>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3">
              {otros.map((item) => (
                <ProductCard key={item.slug} producto={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
