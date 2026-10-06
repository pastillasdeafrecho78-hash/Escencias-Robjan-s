"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Marca } from "@/components/Marca";
import { guardarLado, leerLado, type Lado } from "@/lib/lado";
import type { Producto } from "@/lib/catalog";
import { tienda } from "@/lib/tienda";

type Vitrina = { lado: Lado; frascos: Producto[]; total: number; linea: string };

const TIEMPO_MARCA = 3300;
const TIEMPO_SALIDA = 780;

export function Apertura({ vitrinas, total }: { vitrinas: Vitrina[]; total: number }) {
  const router = useRouter();
  const [guardado, setGuardado] = useState<Lado | null>(null);
  const [listo, setListo] = useState(false);
  const [conocido, setConocido] = useState(false);
  const [elegido, setElegido] = useState<Lado | null>(null);

  useEffect(() => {
    const previo = leerLado();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (previo) {
      setGuardado(previo);
      setConocido(true);
      setListo(true);
      return;
    }
    if (reduce) {
      setListo(true);
      return;
    }
    const timer = window.setTimeout(() => setListo(true), TIEMPO_MARCA);
    return () => window.clearTimeout(timer);
  }, []);

  function elegir(lado: Lado) {
    if (elegido) return;
    guardarLado(lado);
    setElegido(lado);
    const destino = `/productos?categoria=${lado}`;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      router.push(destino);
      return;
    }
    router.prefetch(destino);
    window.setTimeout(() => router.push(destino), TIEMPO_SALIDA);
  }

  return (
    <section
      className={`apertura ${listo ? "apertura-lista" : ""} ${elegido ? "apertura-sale" : ""}`}
      aria-labelledby="titulo-apertura"
    >
      <h1 id="titulo-apertura" className="sr-only">
        {tienda.nombre}. Elige la vitrina de caballero o de dama.
      </h1>

      <div className="apertura-marca">
        <Marca quieta={conocido} className="w-full" />
      </div>

      <div className="apertura-mitades">
        {vitrinas.map((vitrina) => (
          <button
            key={vitrina.lado}
            type="button"
            onClick={() => elegir(vitrina.lado)}
            className={`mitad mitad-${vitrina.lado.toLowerCase()} ${
              elegido === vitrina.lado ? "mitad-elegida" : elegido ? "mitad-cede" : ""
            }`}
            aria-label={`Entrar a la vitrina de ${vitrina.lado.toLowerCase()}, ${vitrina.total} fragancias`}
          >
            <span className="mitad-luz" aria-hidden />
            <span className="mitad-frascos" aria-hidden>
              {vitrina.frascos.map((producto, posicion) => (
                <span key={producto.slug} className={`mitad-frasco mitad-frasco-${posicion}`}>
                  <Image
                    src={producto.imagen}
                    alt=""
                    width={520}
                    height={900}
                    priority={posicion === 0}
                    className="frasco h-full w-auto object-contain"
                  />
                </span>
              ))}
              <span className="mitad-apoyo" />
            </span>
            <span className="mitad-texto">
              <span className="etiqueta text-bone-dim">
                {guardado === vitrina.lado ? "Tu vitrina · " : ""}
                {vitrina.total} fragancias
              </span>
              <span className="titulo mitad-nombre italic">{vitrina.lado}</span>
              <span className="mitad-linea">{vitrina.linea}</span>
              <span className="mitad-entrar">
                Entrar
                <span aria-hidden className="mitad-flecha">
                  →
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="apertura-pie">
        <span className="etiqueta">
          Querétaro 20 · Rivera del Río · {tienda.ciudad.split(",")[0]}
        </span>
        <Link href="/productos?categoria=Todas" className="etiqueta text-bone-dim underline-offset-4 hover:text-bone hover:underline">
          Ver las {total}
        </Link>
      </div>
    </section>
  );
}
