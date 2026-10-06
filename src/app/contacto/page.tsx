import type { Metadata } from "next";
import { enlaceWhatsapp, sucursales, tienda } from "@/lib/tienda";

export const metadata: Metadata = {
  title: "Sucursales",
  description: "Esencias Robjan's en Querétaro 20, Centro, y en Rivera del Río, Corredor Turístico, Local 14, Dolores Hidalgo.",
};

export default function ContactoPage() {
  const centro = sucursales.find((sucursal) => sucursal.mapa);

  return (
    <div className="grid lg:min-h-[70vh] lg:grid-cols-[0.8fr_1.2fr]">
      <div className="px-5 py-12 lg:px-12">
        <p className="etiqueta">Dolores Hidalgo</p>
        <h1 className="titulo mt-3 text-6xl sm:text-7xl">Sucursales</h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-muted">
          {tienda.horario}. Si vienes por un frasco que ya elegiste, mándanos el nombre, el tamaño y la sucursal para
          tenerlo separado.
        </p>

        <ul className="mt-8 grid gap-4">
          {sucursales.map((sucursal) => (
            <li key={sucursal.id} className="rounded-2xl border border-line p-5">
              <p className="etiqueta">{sucursal.nombre}</p>
              <p className="titulo mt-2 text-3xl">{sucursal.direccion}</p>
              <p className="mt-1 text-sm text-muted">Dolores Hidalgo, Gto.</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <a href={sucursal.mapaLink} target="_blank" rel="noreferrer" className="btn btn-line">
                  Cómo llegar
                </a>
                <a
                  href={enlaceWhatsapp(`Hola, voy a pasar a la sucursal ${sucursal.nombre}.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-line"
                >
                  Avisar por WhatsApp
                </a>
              </div>
            </li>
          ))}
        </ul>

        <dl className="mt-8 grid gap-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="etiqueta">Teléfono</dt>
            <dd className="mt-1">
              <a className="text-lg hover:text-bone-dim" href={`tel:+${tienda.telefonoWa}`}>
                {tienda.telefono}
              </a>
            </dd>
          </div>
          <div>
            <dt className="etiqueta">Correo</dt>
            <dd className="mt-1">
              <a className="hover:text-bone-dim" href={`mailto:${tienda.email}`}>
                {tienda.email}
              </a>
            </dd>
          </div>
        </dl>
        <p className="mt-8 max-w-md text-sm leading-6 text-muted">
          Los domingos está cerrado. El pedido que armes en la noche queda listo para confirmarlo al día siguiente.
        </p>
      </div>
      {centro?.mapa && (
        <div className="border-t border-line lg:border-t-0 lg:border-l">
          <iframe
            title={`Mapa de la sucursal ${centro.nombre}`}
            src={centro.mapa}
            className="mapa h-80 w-full lg:h-[calc(100%-3.25rem)] lg:min-h-80"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-4 text-sm">
            <p>
              {centro.nombre} · {centro.direccion}
            </p>
            <a href={centro.mapaLink} target="_blank" rel="noreferrer" className="underline underline-offset-4">
              Abrir en Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
