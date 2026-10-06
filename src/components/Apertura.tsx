"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Marca } from "@/components/Marca";
import { guardarLado, leerLado, type Lado } from "@/lib/lado";
import type { Producto } from "@/lib/catalog";
import { tienda } from "@/lib/tienda";

type Vitrina = { lado: Lado; frascos: Producto[]; total: number; linea: string; fotoMarca?: string };

const TIEMPO_SALIDA = 360;

export function Apertura({ vitrinas, total }: { vitrinas: Vitrina[]; total: number }) {
  const router = useRouter();
  const [guardado, setGuardado] = useState<Lado | null>(null);
  const [elegido, setElegido] = useState<Lado | null>(null);

  useEffect(() => {
    const previo = leerLado();
    if (previo) setGuardado(previo);
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
      className={`apertura ${elegido ? "apertura-sale" : ""}`}
      aria-labelledby="titulo-apertura"
    >
      <div className="apertura-marca" aria-hidden="true">
        <span className="apertura-marca-ubicacion">Dolores Hidalgo · Guanajuato</span>
        <span className="apertura-logo-marco">
          <Marca quieta className="apertura-logo apertura-logo-sombra" />
          <Marca className="apertura-logo" />
        </span>
        <span className="apertura-marca-subtitulo">Fragancias inspiradas</span>
      </div>
      <h1 id="titulo-apertura" className="sr-only">{tienda.nombre}. Elige la vitrina de caballero o de dama.</h1>

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
            <span className="mitad-marco" aria-hidden="true" />
            <span className="mitad-escena" aria-hidden="true">
              {vitrina.fotoMarca ? (
                <Image src={vitrina.fotoMarca} alt="" width={900} height={1100} priority className="mitad-foto-marca" />
              ) : (
                <span className="mitad-frascos">
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
              )}
            </span>
            <span className="mitad-texto">
              <span className="etiqueta text-bone-dim">
                {guardado === vitrina.lado ? "Tu selección · " : ""}{vitrina.total} fragancias
              </span>
              <span className="titulo mitad-nombre italic">{vitrina.lado}</span>
              <span className="mitad-linea">{vitrina.linea}</span>
              <span className="mitad-entrar" aria-hidden="true">
                Explorar la colección
                <span aria-hidden className="mitad-flecha">
                  →
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="apertura-pie">
        <span className="apertura-pie-texto">Dos vitrinas, una selección hecha en Dolores Hidalgo</span>
        <Link href="/productos?categoria=Todas" className="apertura-pie-link">
          Ver las {total} fragancias <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
