"use client";

import { FormEvent, useState } from "react";
import type { Ajustes } from "@compartido/catalogo";

export function PricesForm({ ajustes }: { ajustes: Ajustes }) {
  const [chico, setChico] = useState(Math.round(ajustes.precioMostrador * ajustes.factores[30]));
  const [mediano, setMediano] = useState(ajustes.precioMostrador);
  const [grande, setGrande] = useState(Math.round(ajustes.precioMostrador * ajustes.factores[100]));
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [ocupado, setOcupado] = useState(false);
  async function guardar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setOcupado(true); setError(""); setMensaje("");
    try {
      const respuesta = await fetch("/api/ajustes", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chico, mediano, grande }) });
      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error || "No se pudieron guardar los precios.");
      setMensaje("Precios guardados. La tienda conectada a esta base los mostrará en la próxima visita.");
    } catch (fallo) { setError(fallo instanceof Error ? fallo.message : "Error al guardar."); }
    finally { setOcupado(false); }
  }
  return (
    <form onSubmit={guardar} className="prices-form">
      <p className="subtle">Estos son los precios del mostrador para una esencia con precio base de 50 ml. Si cambias los tamaños, el factor se aplica a todo el catálogo; cada esencia conserva su precio base individual.</p>
      <div className="prices-grid">
        {([
          { id: "chico", etiqueta: "Chico", ml: 30, valor: chico, cambiar: setChico },
          { id: "mediano", etiqueta: "Mediano", ml: 50, valor: mediano, cambiar: setMediano },
          { id: "grande", etiqueta: "Grande", ml: 100, valor: grande, cambiar: setGrande },
        ] as const).map((item) => (
          <label key={item.id} className="price-card"><span className="eyebrow">{item.etiqueta}</span><strong>{item.ml} ml</strong><span className="price-input"><span>$</span><input type="number" min="1" max="100000" step="1" value={item.valor} onChange={(evento) => item.cambiar(Number(evento.target.value))} required /></span></label>
        ))}
      </div>
      {error && <p role="alert" className="form-error">{error}</p>}
      {mensaje && <p role="status" className="form-success">{mensaje}</p>}
      <button className="primary-button" type="submit" disabled={ocupado}>{ocupado ? "Guardando…" : "Guardar precios"}</button>
    </form>
  );
}
