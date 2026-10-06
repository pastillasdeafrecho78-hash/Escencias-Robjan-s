"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { money } from "@/lib/money";
import type { Pedido } from "@/lib/pedido";

const STORAGE = "esencias-robjans-pedido";

export default function PagoPruebaPage() {
  const router = useRouter();
  const { clear } = useCart();
  const [pedido, setPedido] = useState<Pedido | null | undefined>(undefined);
  const [numero, setNumero] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE);
    if (!raw) {
      setPedido(null);
      return;
    }
    try {
      setPedido(JSON.parse(raw) as Pedido);
    } catch {
      setPedido(null);
    }
  }, []);

  async function pagar(event: FormEvent) {
    event.preventDefault();
    if (!pedido) return;
    setError(null);
    setEnviando(true);
    try {
      const respuesta = await fetch("/api/pago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero, vencimiento, cvc }),
      });
      const data = (await respuesta.json()) as { error?: string; pago?: "prueba" };
      if (!respuesta.ok) {
        setError(data.error ?? "No se pudo cobrar en modo prueba.");
        return;
      }
      const pagado: Pedido = { ...pedido, pago: "prueba" };
      sessionStorage.setItem(STORAGE, JSON.stringify(pagado));
      clear();
      router.push("/pedido/listo");
    } catch {
      setError("No hubo respuesta del cobro de prueba. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  if (pedido === undefined) {
    return <p className="mx-auto max-w-xl px-5 py-16 text-sm text-muted">Abriendo el pago…</p>;
  }

  if (!pedido) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16">
        <h1 className="titulo text-5xl">No hay un pedido por pagar.</h1>
        <Link href="/productos" className="btn mt-6">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="page-stage mx-auto grid max-w-5xl gap-12 px-5 py-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="etiqueta">Modo prueba</p>
        <h1 className="titulo mt-2 text-6xl sm:text-7xl">Simular pago</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
          Este formulario no procesa pagos reales. Para simular un pago aprobado usa la tarjeta de prueba{" "}
          <span className="text-bone">4242 4242 4242 4242</span>, cualquier vencimiento futuro y un CVC de tres dígitos.
        </p>
        <form onSubmit={pagar} className="mt-8 space-y-6" autoComplete="off">
          <div>
            <label htmlFor="numero" className="etiqueta">
              Número de tarjeta
            </label>
            <input
              id="numero"
              name="numero"
              inputMode="numeric"
              spellCheck={false}
              value={numero}
              onChange={(event) => setNumero(event.target.value)}
              placeholder="4242 4242 4242 4242"
              className="field"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="vence" className="etiqueta">
                Vencimiento
              </label>
              <input
                id="vence"
                name="vence"
                inputMode="numeric"
                spellCheck={false}
                value={vencimiento}
                onChange={(event) => setVencimiento(event.target.value)}
                placeholder="12/30"
                className="field"
              />
            </div>
            <div>
              <label htmlFor="cvc" className="etiqueta">
                CVC
              </label>
              <input
                id="cvc"
                name="cvc"
                inputMode="numeric"
                spellCheck={false}
                value={cvc}
                onChange={(event) => setCvc(event.target.value)}
                placeholder="123"
                className="field"
              />
            </div>
          </div>
          {error && (
            <p className="text-sm text-alert" role="alert">
              {error}
            </p>
          )}
          <button type="submit" disabled={enviando} className="btn disabled:opacity-60">
            {enviando ? "Comprobando…" : `Simular ${money(pedido.total)}`}
          </button>
        </form>
      </div>
      <aside className="checkout-summary h-fit p-6">
        <h2 className="text-lg">{pedido.nombre}</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {pedido.items.map((item) => (
            <li key={`${item.slug}-${item.ml}`} className="flex justify-between gap-3">
              <span>
                {item.cantidad} × {item.nombre}
                <span className="block text-muted">{item.ml} ml</span>
              </span>
              <span className="cifra">{money(item.precio * item.cantidad)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between border-t border-line pt-4 titulo cifra text-4xl">
          <span className="text-base">Total</span>
          {money(pedido.total)}
        </p>
      </aside>
    </div>
  );
}
