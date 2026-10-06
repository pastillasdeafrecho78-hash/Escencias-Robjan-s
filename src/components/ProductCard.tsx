import Image from "next/image";
import Link from "next/link";
import { ElegirTamano } from "@/components/ElegirTamano";
import { precioDesde, type Producto } from "@/lib/catalog";
import { claseFondo } from "@/lib/lado";
import { money } from "@/lib/money";

export function ProductCard({ producto }: { producto: Producto }) {
  const agotado = producto.stock === 0;

  return (
    <article className="tarjeta group">
      <Link href={`/productos/${producto.slug}`} className="block rounded-xl" tabIndex={-1} aria-hidden>
        <div
          className={`${claseFondo(producto.categoria)} apoyo tarjeta-imagen relative flex aspect-[4/5] items-end justify-center overflow-hidden rounded-xl px-4 pb-5`}
        >
          {producto.imagen ? (
            <Image
              src={producto.imagen}
              alt={`Imagen de referencia de ${producto.nombre}`}
              width={480}
              height={640}
              sizes="(min-width: 1024px) 270px, (min-width: 640px) 33vw, 50vw"
              className="frasco h-[86%] w-full object-contain transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.03] group-has-[a:focus-visible]:-translate-y-2 group-has-[a:focus-visible]:scale-[1.03]"
            />
          ) : (
            <p className="titulo self-center text-2xl text-muted italic">Sin foto</p>
          )}
          {producto.destacado && (
            <span className="etiqueta absolute top-4 left-4 z-10 text-bone-dim">Destacado</span>
          )}
        </div>
      </Link>
      <div className="mt-3 flex flex-col gap-1 sm:mt-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <Link href={`/productos/${producto.slug}`} className="min-w-0 rounded-md">
          <h3 className="titulo line-clamp-2 text-[1.35rem] leading-tight sm:truncate sm:text-[1.6rem]">{producto.nombre}</h3>
          <p className="etiqueta mt-1.5 line-clamp-2 leading-relaxed">{producto.marca ? `Inspirada en ${producto.marca}` : "Esencias Robjan's"}</p>
        </Link>
        <p className="cifra shrink-0 text-sm text-bone-dim sm:pt-1.5">desde {money(precioDesde(producto))}</p>
      </div>
      <div className="relative mt-3">
        <ElegirTamano producto={producto} />
        {!agotado && producto.stock <= 4 && <p className="mt-1.5 text-xs text-muted">Quedan {producto.stock}</p>}
      </div>
    </article>
  );
}
