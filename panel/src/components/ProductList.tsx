"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ProductoGuardado } from "@compartido/catalogo";

export function ProductList({ productos }: { productos: ProductoGuardado[] }) {
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const lista = useMemo(() => productos.filter((producto) => {
    if (categoria !== "Todas" && producto.categoria !== categoria) return false;
    const texto = `${producto.nombre} ${producto.marca} ${producto.familia}`.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
    return texto.includes(query.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim());
  }), [productos, query, categoria]);
  return (
    <>
      <div className="filters">
        <label className="search-wrap"><span className="sr-only">Buscar esencias</span><input type="search" value={query} onChange={(evento) => setQuery(evento.target.value)} placeholder="Buscar por nombre, inspiración o familia…" /></label>
        <label><span className="sr-only">Vitrina</span><select value={categoria} onChange={(evento) => setCategoria(evento.target.value)}><option>Todas</option><option>Caballero</option><option>Dama</option></select></label>
      </div>
      <p className="list-count">{lista.length} de {productos.length} esencias</p>
      <div className="product-list">
        {lista.map((producto) => (
          <Link href={`/productos/${producto.slug}`} key={producto.slug} className="product-row">
            <span className="product-row-main"><strong>{producto.nombre}</strong><small>{producto.marca || "De la casa"} · {producto.categoria}</small></span>
            <span className="product-row-price">${producto.precioBase.toLocaleString("es-MX")}</span>
            <span className="product-row-stock">{producto.stock} en stock</span>
            {producto.oculto && <span className="pill">Oculta</span>}
            <span aria-hidden className="product-row-arrow">→</span>
          </Link>
        ))}
        {!lista.length && <p className="empty-list">No hay esencias con ese filtro.</p>}
      </div>
    </>
  );
}
