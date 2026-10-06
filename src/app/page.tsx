import { Apertura } from "@/components/Apertura";
import Image from "next/image";
import Link from "next/link";
import type { Lado } from "@/lib/lado";
import { TAMANOS, type Producto } from "@/lib/catalog";
import { obtenerCatalogo } from "@/lib/catalogo-servidor";
import { money } from "@/lib/money";
import { sucursales, tienda } from "@/lib/tienda";

export const dynamic = "force-dynamic";

const PORTADA: Record<Lado, { slugs: string[]; linea: string }> = {
  Caballero: {
    slugs: ["le-male-elixir-parfum-jean-paul-gaultier", "sauvage-dior", "acqua-di-gio-absolut-armani"],
    linea: "Maderas, cuero, lavanda y especias. Luz fría.",
  },
  Dama: {
    slugs: ["good-girls-carolina-herrera", "jadore-dior", "yara-tous-lattafa"],
    linea: "Flores, frutas y vainilla. Luz cálida.",
  },
};

function frascosDe(productos: Producto[], lado: Lado) {
  const conFoto = productos.filter((producto) => producto.categoria === lado && producto.imagen);
  const elegidos = PORTADA[lado].slugs
    .map((slug) => conFoto.find((producto) => producto.slug === slug))
    .filter((producto): producto is Producto => Boolean(producto));
  const relleno = conFoto.filter((producto) => !elegidos.includes(producto));
  return [...elegidos, ...relleno].slice(0, 3);
}

export default async function HomePage() {
  const { productos, ajustes } = await obtenerCatalogo();
  const vitrinas = (["Caballero", "Dama"] as const).map((lado) => ({
    lado,
    frascos: frascosDe(productos, lado),
    total: productos.filter((producto) => producto.categoria === lado).length,
    linea: PORTADA[lado].linea,
  }));
  const destacados = [vitrinas[0].frascos[0], vitrinas[1].frascos[0], vitrinas[1].frascos[1]].filter(
    (producto): producto is Producto => Boolean(producto),
  );
  const frascoMuestra = destacados[0];

  return (
    <div>
      <Apertura vitrinas={vitrinas} total={productos.length} />
      {destacados.length > 0 && (
        <section className="border-t border-line" aria-labelledby="titulo-vitrina">
          <div className="mx-auto max-w-6xl px-5 py-18 sm:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="etiqueta">Selección Robjan&apos;s</p>
                <h2 id="titulo-vitrina" className="titulo mt-4 text-[clamp(2.75rem,6vw,5.5rem)]">El aroma <span className="text-gold italic">que eliges.</span></h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-bone-dim">Tres inspiraciones para empezar a recorrer nuestras vitrinas.</p>
              </div>
              <Link href="/productos?categoria=Todas" className="btn btn-line">Ver el catálogo <span aria-hidden>→</span></Link>
            </div>
            <div className="vitrina-destacados mt-10">
              {destacados.map((producto, indice) => (
                <Link
                  key={producto.slug}
                  href={`/productos/${producto.slug}`}
                  className={`vitrina-destacado grupo-vitrina fondo-${producto.categoria.toLowerCase()} ${indice === 0 ? "vitrina-principal" : ""}`}
                >
                  <span className="etiqueta relative z-10 text-bone-dim">{producto.categoria} · Inspirada en {producto.marca}</span>
                  <span className="vitrina-foto apoyo">
                    <Image src={producto.imagen} alt={`Frasco de ${producto.nombre}`} width={560} height={700} sizes={indice === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"} className="frasco h-full w-full object-contain" />
                  </span>
                  <span className="relative z-10 flex items-end justify-between gap-4">
                    <span>
                      <span className="titulo block text-[clamp(2rem,3.4vw,3.5rem)]">{producto.nombre}</span>
                      <span className="etiqueta mt-2 block text-bone-dim">{producto.marca}</span>
                    </span>
                    <span className="cifra shrink-0 text-sm text-bone-dim">desde {money(producto.precios[30])}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
            <div>
              <p className="etiqueta">Nuestra forma de elegir</p>
              <h2 className="titulo mt-5 max-w-4xl text-[clamp(2.5rem,5.2vw,5rem)]">
                Una inspiración puede convertirse en <span className="text-gold italic">tu esencia.</span>
              </h2>
            </div>
            <div className="flex flex-col justify-end border-l border-gold/40 pl-6">
              <p className="text-base leading-7 text-bone-dim">
                Explora por notas, descubre el perfume que inspira cada fragancia y elige el tamaño que va contigo.
                También puedes venir a conocerlas en nuestras dos sucursales de Dolores Hidalgo.
              </p>
              <p className="mt-5 text-xs leading-5 text-muted">
                Somos una perfumería independiente. Las marcas mencionadas identifican inspiraciones; no existe afiliación con ellas.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 pt-18 pb-14 sm:pt-24">
          <p className="etiqueta">Elige tu medida</p>
          <h2 className="titulo mt-4 text-[clamp(2.5rem,5vw,4.5rem)]">
            Tu esencia,
            <br />
            <span className="text-bone-dim italic">a tu medida.</span>
          </h2>
          <dl className="repisa-tamanos mt-12">
            {TAMANOS.map((tamano) => (
              <div key={tamano.ml} className="tamano-vitrina">
                {frascoMuestra?.imagen && (
                  <div className="tamano-vitrina-foto" style={{ height: `${38 + tamano.ml * 0.48}%` }}>
                    <Image src={frascoMuestra.imagen} alt="" width={220} height={300} sizes="(min-width: 640px) 180px, 28vw" className="frasco h-full w-full object-contain" />
                  </div>
                )}
                <dt className="etiqueta">{tamano.etiqueta}</dt>
                <dd className="titulo mt-2 text-[clamp(2rem,4vw,3.5rem)]">{tamano.ml} ml</dd>
                <dd className="cifra mt-1 text-sm text-bone-dim">
                  {money(Math.round(ajustes.precioMostrador * ajustes.factores[tamano.ml]))}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-xs text-muted">Imagen de referencia. La presentación del frasco puede variar.</p>
        </div>
        <div className="mx-auto max-w-6xl px-5 pb-18">
          <p className="etiqueta">Visítanos</p>
          <p className="mt-3 text-sm text-muted">Dos sucursales en {tienda.ciudad}. {tienda.horario}.</p>
          <div className="mt-8 grid gap-0 border-t border-line sm:grid-cols-2">
          {sucursales.map((sucursal) => (
            <a
              key={sucursal.id}
              href={sucursal.mapaLink}
              target="_blank"
              rel="noreferrer"
              className="group border-b border-line py-6 text-sm sm:px-6 first:sm:pl-0 last:sm:border-l"
            >
              <span className="etiqueta">{sucursal.nombre}</span>
              <span className="titulo mt-3 block text-2xl text-bone-dim group-hover:text-bone">{sucursal.direccion}</span>
              <span className="mt-4 block text-xs text-muted group-hover:text-bone-dim">Cómo llegar →</span>
            </a>
          ))}
          </div>
        </div>
      </section>
    </div>
  );
}
