import { money } from "@/lib/money";
import { textoEntrega, type Entrega } from "@/lib/tienda";

export type ItemPedido = {
  slug: string;
  nombre: string;
  ml: number;
  cantidad: number;
  precio: number;
};

export type Pedido = {
  folio: string;
  nombre: string;
  telefono: string;
  entrega: Entrega;
  nota: string;
  items: ItemPedido[];
  total: number;
  creado: string;
  pago: "pendiente" | "prueba";
};

export function mensajePedido(pedido: Pedido) {
  const lineas = pedido.items
    .map(
      (item) =>
        `• ${item.cantidad} × ${item.nombre} (${item.ml} ml) — ${money(item.precio * item.cantidad)}`,
    )
    .join("\n");
  const entrega = textoEntrega(pedido.entrega);
  const nota = pedido.nota.trim() ? `\nNota: ${pedido.nota.trim()}` : "";
  return `Hola, soy ${pedido.nombre}. Quiero confirmar el pedido ${pedido.folio}.\n${lineas}\nTotal estimado: ${money(pedido.total)}\nEntrega: ${entrega}\nTeléfono: ${pedido.telefono}${nota}\nPago pendiente de acordar con la tienda.`;
}
