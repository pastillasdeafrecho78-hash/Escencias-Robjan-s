import Link from "next/link";
import { enlaceWhatsapp, sucursales, tienda } from "@/lib/tienda";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="titulo text-3xl">
            Esencias <span className="text-bone-dim italic">Robjan&apos;s</span>
          </p>
          <ul className="mt-3 grid gap-3 text-sm leading-6 text-muted sm:grid-cols-2 sm:gap-8">
            {sucursales.map((sucursal) => (
              <li key={sucursal.id}>
                <span className="text-bone-dim">{sucursal.nombre}</span>
                <br />
                <a href={sucursal.mapaLink} target="_blank" rel="noreferrer" className="hover:text-bone">
                  {sucursal.direccion}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted">
            Dolores Hidalgo, Gto. · {tienda.horario}
          </p>
          <p className="mt-3 text-sm">
            <a className="hover:text-bone-dim" href={`tel:+${tienda.telefonoWa}`}>
              {tienda.telefono}
            </a>
            <span className="px-2 text-muted">/</span>
            <a className="hover:text-bone-dim" href={`mailto:${tienda.email}`}>
              {tienda.email}
            </a>
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          <Link className="hover:text-bone" href="/productos">
            Catálogo
          </Link>
          <Link className="hover:text-bone" href="/carrito">
            Carrito
          </Link>
          <Link className="hover:text-bone" href="/contacto">
            Cómo llegar
          </Link>
          <a className="hover:text-bone" href={enlaceWhatsapp("Hola, quiero conocer las esencias.")} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a className="hover:text-bone" href={tienda.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a className="hover:text-bone" href={tienda.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </nav>
      </div>
      <p className="border-t border-line px-5 py-4 text-xs text-muted">
        © {new Date().getFullYear()} {tienda.nombre}. Fragancias inspiradas, sin afiliación con las marcas originales.
      </p>
    </footer>
  );
}
