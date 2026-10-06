"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { buscarProductos, categorias, type Producto } from "@/lib/catalog";
import { guardarLado, leerLado } from "@/lib/lado";
import { money } from "@/lib/money";
import type { Ajustes } from "@compartido/catalogo";

const ordenes = [
  { id: "destacados", label: "Selección primero" },
  { id: "nombre", label: "Nombre" },
  { id: "precio-asc", label: "Precio menor" },
  { id: "precio-desc", label: "Precio mayor" },
];

const subtitulo: Record<string, string> = {
  Todas: "Las dos vitrinas juntas.",
  Caballero: "Maderas, cuero, lavanda y especias.",
  Dama: "Flores, frutas y vainilla.",
};

export type FiltrosUrl = { q?: string; categoria?: string; orden?: string };

/** Los filtros llegan del servidor: useSearchParams obligaría a un Suspense que parpadea al llegar desde la apertura. */
export function Catalogo({ productos, ajustes, filtros }: { productos: Producto[]; ajustes: Ajustes; filtros: FiltrosUrl }) {
  const qUrl = filtros.q ?? "";
  const pedida = filtros.categoria;
  const [query, setQuery] = useState(qUrl);
  const [categoria, setCategoria] = useState(pedida ?? "Todas");
  const [orden, setOrden] = useState(filtros.orden ?? "destacados");

  useEffect(() => {
    setQuery(qUrl);
  }, [qUrl]);

  useEffect(() => {
    if (pedida === "Todas") {
      setCategoria("Todas");
      guardarLado(null);
      return;
    }
    if (pedida === "Caballero" || pedida === "Dama") {
      setCategoria(pedida);
      guardarLado(pedida);
      return;
    }
    const guardado = leerLado();
    if (guardado) setCategoria(guardado);
  }, [pedida]);

  useEffect(() => {
    const parametros = new URLSearchParams();
    if (query.trim()) parametros.set("q", query.trim());
    parametros.set("categoria", categoria);
    if (orden !== "destacados") parametros.set("orden", orden);
    const destino = `${window.location.pathname}?${parametros}`;
    if (destino !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(window.history.state, "", destino);
    }
  }, [query, categoria, orden]);

  const lista = useMemo(
    () => buscarProductos(productos, { q: query, categoria, orden }),
    [productos, query, categoria, orden],
  );
  const ambiente = categoria === "Dama" ? "lado-dama" : categoria === "Caballero" ? "lado-caballero" : "";
  const mostrador = ajustes.precioMostrador;

  return (
    <div>
      <header className={`cabecera-catalogo ${ambiente} border-b border-line`}>
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-6 sm:pt-20 sm:pb-10">
          <p className="etiqueta">{lista.length} inspiraciones de diseñador</p>
          <h1 className="titulo mt-2 text-[clamp(3.25rem,9vw,7.5rem)] sm:mt-4">
            {categoria === "Todas" ? "Catálogo" : categoria}
          </h1>
          <p className="titulo mt-2 text-xl text-bone-dim italic sm:mt-3 sm:text-2xl">{subtitulo[categoria] ?? subtitulo.Todas}</p>
          <p className="cifra mt-6 hidden max-w-xl text-sm text-muted sm:block">
            Chico 30 ml {money(Math.round(mostrador * ajustes.factores[30]))} · Mediano 50 ml {money(mostrador)} · Grande
            100 ml {money(Math.round(mostrador * ajustes.factores[100]))}
          </p>
        </div>
      </header>

      <div className="catalogo-controles sticky top-14 z-20 border-b border-line bg-ink/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:py-5">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex min-w-0 rounded-full border border-line p-1" role="group" aria-label="Categoría">
              {categorias.map((item) => {
                const activo = categoria === item;
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={activo}
                    onClick={() => {
                      setCategoria(item);
                      guardarLado(item === "Todas" ? null : item);
                    }}
                    className={`rounded-full px-2.5 py-2 text-xs transition-colors sm:px-5 sm:text-sm ${
                      activo ? "bg-bone text-ink" : "text-muted hover:text-bone"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            <div>
              <label htmlFor="orden" className="sr-only">
                Orden
              </label>
              <select
                id="orden"
                value={orden}
                onChange={(event) => setOrden(event.target.value)}
                className="max-w-[8.5rem] rounded-full border border-line bg-ink px-2.5 py-2.5 text-xs text-bone-dim sm:max-w-none sm:px-4 sm:text-sm"
              >
                {ordenes.map((opcion) => (
                  <option key={opcion.id} value={opcion.id}>
                    {opcion.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-2 sm:mt-4">
            <label htmlFor="filtro" className="sr-only">
              Buscar por nombre, marca o nota
            </label>
            <input
              id="filtro"
              type="search"
              name="q"
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre o nota…"
              className="field py-1.5 text-sm sm:py-2 sm:text-lg"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-12">
        {lista.length === 0 ? (
          <div className="py-16">
            <h2 className="titulo text-5xl">No hay una esencia con eso.</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted">
              {query
                ? `Nada coincide con «${query}» en ${categoria === "Todas" ? "el catálogo" : categoria.toLowerCase()}.`
                : "Esta vitrina está vacía."}{" "}
              Prueba con una nota, como vainilla o cedro, o vuelve a ver todas.
            </p>
            <button
              type="button"
              className="btn mt-8"
              onClick={() => {
                setQuery("");
                setCategoria("Todas");
                guardarLado(null);
              }}
            >
              Ver todo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-14 sm:grid-cols-3 lg:grid-cols-4">
            {lista.map((producto) => (
              <ProductCard key={producto.slug} producto={producto} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
