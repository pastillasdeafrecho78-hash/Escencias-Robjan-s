"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function AdminShell({ children }: { children: ReactNode }) {
  const ruta = usePathname();
  async function salir() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/entrar";
  }
  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-width admin-header-inner">
          <Link href="/" className="admin-brand"><span className="admin-monograma">R</span> Esencias <em>Robjan&apos;s</em><small>Panel del dueño</small></Link>
          <nav aria-label="Panel" className="admin-nav">
            <Link href="/" aria-current={ruta === "/" ? "page" : undefined}>Esencias</Link>
            <Link href="/precios" aria-current={ruta === "/precios" ? "page" : undefined}>Precios</Link>
            <button type="button" onClick={salir}>Salir</button>
          </nav>
        </div>
      </header>
      <main className="admin-width admin-main">{children}</main>
      <footer className="admin-width admin-footer">Panel local · Los cambios se reflejan en la tienda conectada a la misma base de datos.</footer>
    </div>
  );
}
