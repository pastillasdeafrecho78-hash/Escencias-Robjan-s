import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24">
      <p className="etiqueta">404</p>
      <h1 className="titulo mt-3 text-5xl sm:text-6xl">Esa página no está en la tienda.</h1>
      <p className="mt-4 text-sm text-muted">El anaquel sí sigue abierto. Puedes volver al catálogo o a la portada.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/productos" className="btn">
          Ver esencias
        </Link>
        <Link href="/" className="btn btn-line">
          Inicio
        </Link>
      </div>
    </div>
  );
}
