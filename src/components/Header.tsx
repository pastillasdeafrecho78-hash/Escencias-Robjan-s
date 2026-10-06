"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { Marca } from "@/components/Marca";
import { tienda } from "@/lib/tienda";

const enlaces = [
  { href: "/productos", label: "Catálogo" },
  { href: "/contacto", label: "Sucursales" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, ready, openDrawer } = useCart();
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  function buscar(event: FormEvent) {
    event.preventDefault();
    const q = busqueda.trim();
    setAbierto(false);
    router.push(q ? `/productos?q=${encodeURIComponent(q)}` : "/productos");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setAbierto(false)}>
          <Marca tamano="header" />
          <span className="titulo text-[1.35rem] leading-none" translate="no">
            Esencias <span className="text-bone-dim italic">Robjan&apos;s</span>
          </span>
        </Link>

        <form onSubmit={buscar} className="mx-2 hidden min-w-0 flex-1 md:block" role="search">
          <label htmlFor="buscar" className="sr-only">
            Buscar fragancias
          </label>
          <input
            id="buscar"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            type="search"
            name="q"
            autoComplete="off"
            placeholder="Busca una esencia o una nota…"
            className="w-full rounded-full border border-line bg-white/[0.03] px-4 py-1.5 text-sm text-bone placeholder:text-muted focus:border-bone-dim"
          />
        </form>

        <nav className="ml-auto hidden items-center gap-5 text-sm md:flex">
          {enlaces.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              className={pathname.startsWith(enlace.href) ? "text-bone" : "text-muted hover:text-bone"}
            >
              {enlace.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={openDrawer}
          className="relative ml-auto text-sm text-muted hover:text-bone md:ml-0"
          aria-label="Abrir carrito"
        >
          Carrito
          {ready && totalItems > 0 && <span className="ml-2 text-bone">{totalItems}</span>}
        </button>

        <button
          type="button"
          className="text-sm md:hidden"
          aria-expanded={abierto}
          aria-controls="menu-movil"
          onClick={() => setAbierto((valor) => !valor)}
        >
          {abierto ? "Cerrar" : "Menú"}
        </button>
      </div>

      {abierto && (
        <div id="menu-movil" className="border-t border-line px-4 py-4 md:hidden">
          <form onSubmit={buscar} className="mb-4" role="search">
            <label htmlFor="buscar-movil" className="sr-only">
              Buscar fragancias
            </label>
            <input
              id="buscar-movil"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              type="search"
              name="q"
              autoComplete="off"
              placeholder="Busca una esencia o una nota…"
              className="field text-sm"
            />
          </form>
          <div className="flex flex-col gap-3 text-sm">
            {enlaces.map((enlace) => (
              <Link key={enlace.href} href={enlace.href} onClick={() => setAbierto(false)}>
                {enlace.label}
              </Link>
            ))}
            <a href={`tel:+${tienda.telefonoWa}`}>Llamar a la tienda</a>
          </div>
        </div>
      )}
    </header>
  );
}
