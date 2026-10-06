"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-5 py-24">
      <h1 className="titulo text-5xl">Algo se atoró al abrir la tienda.</h1>
      <p className="mt-3 text-sm text-muted">Puedes reintentar esta página. El catálogo sigue en su lugar.</p>
      <button type="button" onClick={reset} className="btn mt-6">
        Reintentar
      </button>
    </div>
  );
}
