"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import type { Producto, TamanoMl } from "@/lib/catalog";

/** Añade un frasco al carrito y lo abre; devuelve el mensaje de stock si no cupo. */
export function useAgregar(producto: Producto) {
  const { addItem, openDrawer } = useCart();
  return (ml: TamanoMl, cantidad = 1): string | null => {
    const resultado = addItem({
      slug: producto.slug,
      nombre: producto.nombre,
      categoria: producto.categoria,
      ml,
      precio: producto.precios[ml],
      imagen: producto.imagen,
      stock: producto.stock,
      cantidad,
    });
    if (!resultado.ok) return resultado.message;
    openDrawer();
    return null;
  };
}

export function AddButton({
  producto,
  ml = 50,
  cantidad = 1,
  etiqueta = "Añadir 50 ml",
  className = "btn w-full disabled:cursor-not-allowed",
}: {
  producto: Producto;
  ml?: TamanoMl;
  cantidad?: number;
  etiqueta?: string;
  className?: string;
}) {
  const agregar = useAgregar(producto);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const agotado = producto.stock === 0;

  return (
    <div>
      <button
        type="button"
        disabled={agotado}
        className={className}
        onClick={() => setMensaje(agregar(ml, cantidad))}
      >
        {agotado ? "Agotada" : etiqueta}
      </button>
      {mensaje && (
        <p className="mt-2 text-xs text-alert" role="status">
          {mensaje}
        </p>
      )}
    </div>
  );
}
