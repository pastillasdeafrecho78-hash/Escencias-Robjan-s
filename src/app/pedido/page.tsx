"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { money } from "@/lib/money";
import type { Pedido } from "@/lib/pedido";
import { sucursales, type Entrega } from "@/lib/tienda";

const STORAGE = "esencias-robjans-pedido";

type Campo = "nombre" | "telefono" | "entrega" | "nota";
type Errores = Partial<Record<Campo, string>>;
const ORDEN: Campo[] = ["nombre", "telefono", "entrega", "nota"];

function validar(datos: { nombre: string; telefono: string; entrega: string }): Errores {
  const errores: Errores = {};
  if (datos.nombre.trim().length < 2) errores.nombre = "Escribe tu nombre para apartar el pedido.";
  if (datos.telefono.replace(/\D/g, "").length < 10)
    errores.telefono = "El WhatsApp necesita 10 dígitos, por ejemplo 418 123 4567.";
  if (!datos.entrega) errores.entrega = "Elige en qué sucursal recoges o si quieres envío.";
  return errores;
}

function enfocar(campo: Campo) {
  const destino =
    campo === "entrega"
      ? document.querySelector<HTMLInputElement>('input[name="entrega"]')
      : document.getElementById(campo);
  destino?.focus();
}

export default function PedidoPage() {
  const router = useRouter();
  const { items, total, ready } = useCart();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [entrega, setEntrega] = useState<Entrega | "">("");
  const [nota, setNota] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errores, setErrores] = useState<Errores>({});
  const [enviando, setEnviando] = useState(false);
  const [saliendo, setSaliendo] = useState(false);

  async function enviar(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const encontrados = validar({ nombre, telefono, entrega });
    setErrores(encontrados);
    const primero = ORDEN.find((campo) => encontrados[campo]);
    if (primero) {
      enfocar(primero);
      return;
    }
    setEnviando(true);
    try {
      const respuesta = await fetch("/api/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          telefono,
          entrega,
          nota,
          items: items.map((item) => ({
            slug: item.slug,
            nombre: item.nombre,
            ml: item.ml,
            cantidad: item.cantidad,
            precio: item.precio,
          })),
        }),
      });
      const data = (await respuesta.json()) as Pedido & { error?: string; campo?: Campo };
      if (!respuesta.ok) {
        const mensaje = data.error ?? "No se pudo armar el pedido. Inténtalo de nuevo.";
        if (data.campo && ORDEN.includes(data.campo)) {
          setErrores({ [data.campo]: mensaje });
          enfocar(data.campo);
        } else {
          setError(mensaje);
        }
        return;
      }
      sessionStorage.setItem(STORAGE, JSON.stringify(data));
      setSaliendo(true);
      router.push("/pedido/pago");
    } catch {
      setError("No hubo respuesta de la tienda. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  const limpiar = (campo: Campo) => setErrores((previos) => ({ ...previos, [campo]: undefined }));
  const ayuda = (campo: Campo) =>
    errores[campo] ? (
      <p id={`${campo}-error`} className="mt-2 text-sm text-alert">
        {errores[campo]}
      </p>
    ) : null;
  const marcas = (campo: Campo) => ({
    "aria-invalid": errores[campo] ? true : undefined,
    "aria-describedby": errores[campo] ? `${campo}-error` : undefined,
  });

  if (!ready || saliendo) {
    return <p className="mx-auto max-w-3xl px-5 py-16 text-sm text-muted">Apartando tu pedido…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16">
        <h1 className="titulo text-5xl">No hay nada que apartar.</h1>
        <p className="mt-3 text-sm text-muted">Agrega una esencia antes de dejar tus datos.</p>
        <Link href="/productos" className="btn mt-6">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-5 py-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <h1 className="titulo text-6xl sm:text-7xl">Apartar pedido</h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted">
          Dejas tus datos y pasas al pago de prueba. No se hace un cargo real: la tarjeta que acepta esta pantalla es la de prueba de Stripe.
        </p>
        <form onSubmit={enviar} className="mt-8 space-y-6" noValidate>
          <div>
            <label htmlFor="nombre" className="etiqueta">
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={(event) => {
                setNombre(event.target.value);
                limpiar("nombre");
              }}
              autoComplete="name"
              placeholder="Ej.: Ana Ruiz…"
              required
              className="field"
              {...marcas("nombre")}
            />
            {ayuda("nombre")}
          </div>
          <div>
            <label htmlFor="telefono" className="etiqueta">
              WhatsApp
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              value={telefono}
              onChange={(event) => {
                setTelefono(event.target.value);
                limpiar("telefono");
              }}
              autoComplete="tel-national"
              inputMode="tel"
              placeholder="Ej.: 418 123 4567…"
              required
              className="field"
              {...marcas("telefono")}
            />
            {ayuda("telefono")}
          </div>
          <fieldset {...marcas("entrega")}>
            <legend className="etiqueta">Entrega</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {[
                ...sucursales.map((sucursal) => ({
                  id: sucursal.id as Entrega,
                  titulo: `Recoger en ${sucursal.nombre}`,
                  detalle: sucursal.direccion,
                })),
                { id: "envio" as Entrega, titulo: "Envío local", detalle: "Se cotiza aparte" },
              ].map((opcion) => (
                <label
                  key={opcion.id}
                  className={`cursor-pointer rounded-2xl border px-4 py-4 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${
                    entrega === opcion.id
                      ? "border-bone"
                      : errores.entrega
                        ? "border-alert/60 text-muted hover:border-muted"
                        : "border-line text-muted hover:border-muted"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="entrega"
                      className="accent-bone"
                      checked={entrega === opcion.id}
                      onChange={() => {
                        setEntrega(opcion.id);
                        limpiar("entrega");
                      }}
                    />
                    <span className={entrega === opcion.id ? "text-bone" : ""}>{opcion.titulo}</span>
                  </span>
                  <span className="mt-1.5 block pl-5 text-xs leading-5 text-muted">{opcion.detalle}</span>
                </label>
              ))}
            </div>
            {ayuda("entrega")}
          </fieldset>
          <div>
            <label htmlFor="nota" className="etiqueta">
              Nota para la tienda
            </label>
            <textarea
              id="nota"
              name="nota"
              value={nota}
              onChange={(event) => {
                setNota(event.target.value);
                limpiar("nota");
              }}
              maxLength={280}
              rows={3}
              autoComplete="off"
              placeholder="Ej.: paso después de las 5…"
              className="field"
              {...marcas("nota")}
            />
            {ayuda("nota")}
          </div>
          {error && (
            <p className="text-sm text-alert" role="alert">
              {error}
            </p>
          )}
          <button type="submit" disabled={enviando} className="btn disabled:opacity-60">
            {enviando ? "Armando pedido…" : "Continuar al pago de prueba"}
          </button>
        </form>
      </div>
      <aside className="h-fit rounded-3xl border border-line p-6">
        <h2 className="text-lg">Resumen</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.key} className="flex justify-between gap-3">
              <span>
                {item.cantidad} × {item.nombre}
                <span className="block text-muted">{item.ml} ml</span>
              </span>
              <span className="cifra">{money(item.precio * item.cantidad)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
          <span>Total</span>
          <span className="titulo cifra text-4xl">{money(total)}</span>
        </p>
      </aside>
    </div>
  );
}
