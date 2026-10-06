"use client";

import { useEffect, useRef, useState } from "react";
import type { Nota } from "@/lib/catalog";

export function NotasBarras({ notas }: { notas: Nota[] }) {
  const lista = useRef<HTMLUListElement>(null);
  const [visibles, setVisibles] = useState(false);

  useEffect(() => {
    const nodo = lista.current;
    if (!nodo) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisibles(true);
          observador.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  if (notas.length === 0) return null;

  return (
    <ul ref={lista} className="space-y-4" aria-label="Notas e intensidad">
      {notas.map((nota, indice) => (
        <li key={`${nota.nombre}-${indice}`}>
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <span className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full" style={{ background: nota.color }} aria-hidden />
              {nota.nombre}
            </span>
            <span className="cifra text-xs text-muted">
              {nota.intensidad}
              <span className="text-muted/60">/10</span>
            </span>
          </div>
          <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="barra-nota h-full rounded-full"
              style={{
                width: visibles ? `${nota.intensidad * 10}%` : "0%",
                transitionDelay: `${indice * 90}ms`,
                background: `linear-gradient(90deg, ${nota.color}55, ${nota.color})`,
                boxShadow: `0 0 14px ${nota.color}55`,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
