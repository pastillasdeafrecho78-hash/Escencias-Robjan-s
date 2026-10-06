"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { TamanoMl } from "@/lib/catalog";

export type CartItem = {
  key: string;
  slug: string;
  nombre: string;
  categoria: string;
  ml: TamanoMl;
  precio: number;
  cantidad: number;
  imagen: string;
  stock: number;
};

type AddInput = Omit<CartItem, "key" | "cantidad"> & { cantidad?: number };

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  total: number;
  ready: boolean;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (input: AddInput) => { ok: true } | { ok: false; message: string };
  setQty: (key: string, cantidad: number) => { ok: true } | { ok: false; message: string };
  remove: (key: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "esencias-robjans-carrito";
const CartContext = createContext<CartContextValue | null>(null);

function usadoDe(items: CartItem[], slug: string, exceptKey?: string) {
  return items
    .filter((item) => item.slug === slug && item.key !== exceptKey)
    .reduce((sum, item) => sum + item.cantidad, 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((item) => item && item.slug && item.ml && item.precio));
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const api = useMemo<CartContextValue>(() => {
    return {
      items,
      totalItems: items.reduce((sum, item) => sum + item.cantidad, 0),
      total: items.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
      ready,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      addItem: (input) => {
        const cantidad = input.cantidad ?? 1;
        const key = `${input.slug}-${input.ml}`;
        const ocupado = usadoDe(items, input.slug);
        if (ocupado + cantidad > input.stock) {
          const quedan = Math.max(input.stock - ocupado, 0);
          return {
            ok: false,
            message:
              quedan === 0
                ? "Ya tienes en el carrito todo el stock de esta esencia."
                : `Solo quedan ${quedan} frasco${quedan === 1 ? "" : "s"} de ${input.nombre}.`,
          };
        }
        setItems((prev) => {
          const existe = prev.find((item) => item.key === key);
          if (existe) {
            return prev.map((item) =>
              item.key === key ? { ...item, cantidad: item.cantidad + cantidad } : item,
            );
          }
          return [...prev, { ...input, key, cantidad }];
        });
        return { ok: true };
      },
      setQty: (key, cantidad) => {
        const actual = items.find((item) => item.key === key);
        if (!actual) return { ok: false, message: "Ese frasco ya no está en el carrito." };
        if (cantidad <= 0) {
          setItems((prev) => prev.filter((item) => item.key !== key));
          return { ok: true };
        }
        const ocupado = usadoDe(items, actual.slug, key);
        if (ocupado + cantidad > actual.stock) {
          return {
            ok: false,
            message: `Solo hay ${actual.stock} frascos de ${actual.nombre} entre todos los tamaños.`,
          };
        }
        setItems((prev) =>
          prev.map((item) => (item.key === key ? { ...item, cantidad } : item)),
        );
        return { ok: true };
      },
      remove: (key) => setItems((prev) => prev.filter((item) => item.key !== key)),
      clear: () => setItems([]),
    };
  }, [items, ready, drawerOpen]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}
