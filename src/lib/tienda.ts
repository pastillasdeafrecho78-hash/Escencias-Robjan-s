export const tienda = {
  nombre: "Esencias Robjan's",
  ciudad: "Dolores Hidalgo, Guanajuato",
  direccion: "Querétaro 20, Centro",
  cp: "37800 Dolores Hidalgo Cuna de la Independencia Nacional, Gto.",
  horario: "Lunes a sábado, 10:00 a 20:00",
  telefono: "418 305 6738",
  telefonoWa: "524183056738",
  email: "escenciasrobjans@gmail.com",
  facebook: "https://www.facebook.com/share/1ABvtdNdz4/?mibextid=wwXIfr",
  instagram:
    "https://www.instagram.com/explore/locations/505829956452206/perfumeria-esencias-robjans/",
  mapa: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d930.8123612065694!2d-100.93353407078688!3d21.159112095411456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842b3f071b338b0f%3A0xa8fa347ed3e05c17!2sQuer%C3%A9taro%2020%2C%20Centro%2C%2037800%20Dolores%20Hidalgo%20Cuna%20de%20la%20Independencia%20Nacional%2C%20Gto.!5e0!3m2!1ses-419!2smx!4v1714134553399!5m2!1ses-419!2smx",
  mapaLink:
    "https://www.google.com/maps/search/?api=1&query=Quer%C3%A9taro%2020%20Centro%20Dolores%20Hidalgo%20Guanajuato",
};

export type Sucursal = {
  id: "centro" | "rivera";
  nombre: string;
  direccion: string;
  mapaLink: string;
  mapa?: string;
};

/** Mismo teléfono y horario en las dos; si cambian, se ponen aquí por sucursal. */
export const sucursales: Sucursal[] = [
  {
    id: "centro",
    nombre: "Centro",
    direccion: "Querétaro 20, Centro",
    mapaLink: tienda.mapaLink,
    mapa: tienda.mapa,
  },
  {
    id: "rivera",
    nombre: "Rivera del Río",
    direccion: "Rivera del Río, Corredor Turístico, Local 14",
    mapaLink:
      "https://www.google.com/maps/search/?api=1&query=Rivera%20del%20R%C3%ADo%20Corredor%20Tur%C3%ADstico%20Local%2014%20Dolores%20Hidalgo%20Guanajuato",
  },
];

export type Entrega = Sucursal["id"] | "envio";

export function textoEntrega(entrega: string) {
  if (entrega === "envio") return "Envío local, por cotizar";
  const sucursal = sucursales.find((s) => s.id === entrega) ?? (entrega === "tienda" ? sucursales[0] : null);
  return sucursal ? `Recoger en ${sucursal.direccion}` : "Por confirmar";
}

export function enlaceWhatsapp(texto: string) {
  return `https://wa.me/${tienda.telefonoWa}?text=${encodeURIComponent(texto)}`;
}
