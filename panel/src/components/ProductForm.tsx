"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Categoria, Nota, ProductoGuardado } from "@compartido/catalogo";
import { colorDeNota } from "@compartido/notas";

const VACIO: ProductoGuardado = {
  slug: "", nombre: "", categoria: "Dama", marca: "", familia: "", descripcion: "", notas: [],
  imagen: "", precioBase: 385, stock: 10, destacado: false, oculto: false,
};

function rutaImagen(imagen: string) {
  const match = imagen.match(/^\/(catalogo|fotos)\/([a-z0-9-]+\.webp)$/);
  return match ? `/api/imagen/${match[2]}?origen=${match[1]}` : "";
}

export function ProductForm({ inicial }: { inicial?: ProductoGuardado }) {
  const router = useRouter();
  const [producto, setProducto] = useState<ProductoGuardado>(inicial || VACIO);
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  useEffect(() => {
    if (!foto) { setPreview(""); return; }
    const url = URL.createObjectURL(foto);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [foto]);
  const cambiar = <K extends keyof ProductoGuardado>(campo: K, valor: ProductoGuardado[K]) => setProducto((actual) => ({ ...actual, [campo]: valor }));
  const cambiarNota = (indice: number, campo: keyof Nota, valor: string | number) => setProducto((actual) => ({
    ...actual, notas: actual.notas.map((nota, posicion) => posicion === indice ? { ...nota, [campo]: valor } : nota),
  }));

  async function guardar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault(); setOcupado(true); setError(""); setMensaje("");
    try {
      const existente = Boolean(inicial?.slug);
      const respuesta = await fetch(existente ? `/api/productos/${inicial!.slug}` : "/api/productos", {
        method: existente ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(producto),
      });
      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error || "No se pudo guardar.");
      const slug = datos.producto.slug as string;
      if (foto) {
        const formulario = new FormData(); formulario.append("foto", foto);
        const respuestaFoto = await fetch(`/api/foto/${slug}`, { method: "POST", body: formulario });
        const datosFoto = await respuestaFoto.json();
        if (!respuestaFoto.ok) throw new Error(`La esencia se guardó, pero la foto no: ${datosFoto.error || "error desconocido"}`);
        cambiar("imagen", datosFoto.imagen);
        setFoto(null);
      }
      setMensaje("Esencia guardada.");
      if (!existente) { router.push(`/productos/${slug}`); router.refresh(); }
      else router.refresh();
    } catch (fallo) { setError(fallo instanceof Error ? fallo.message : "Error al guardar."); }
    finally { setOcupado(false); }
  }

  return (
    <form onSubmit={guardar} className="product-form">
      <div className="form-grid">
        <div className="form-main">
          <section className="form-section">
            <p className="eyebrow">Identidad</p>
            <div className="form-two">
              <label className="field-label">Nombre de la esencia<input value={producto.nombre} onChange={(e) => cambiar("nombre", e.target.value)} required minLength={2} maxLength={100} /></label>
              <label className="field-label">Inspirada en<input value={producto.marca} onChange={(e) => cambiar("marca", e.target.value)} maxLength={100} placeholder="Nombre del perfume de referencia" /></label>
            </div>
            <div className="form-two">
              <label className="field-label">Vitrina<select value={producto.categoria} onChange={(e) => cambiar("categoria", e.target.value as Categoria)}><option value="Dama">Dama</option><option value="Caballero">Caballero</option></select></label>
              <label className="field-label">Familia olfativa<input value={producto.familia} onChange={(e) => cambiar("familia", e.target.value)} maxLength={100} placeholder="Floral, amaderado…" /></label>
            </div>
            <label className="field-label">Descripción<textarea value={producto.descripcion} onChange={(e) => cambiar("descripcion", e.target.value)} maxLength={800} rows={3} placeholder="Cómo se siente esta esencia" /></label>
          </section>
          <section className="form-section">
            <div className="section-heading"><div><p className="eyebrow">Aroma</p><h2>Notas</h2></div><button type="button" className="text-button" disabled={producto.notas.length >= 12} onClick={() => cambiar("notas", [...producto.notas, { nombre: "", intensidad: 7, color: "#b9ab8e" }])}>+ Añadir nota</button></div>
            {producto.notas.length === 0 && <p className="subtle">Agrega las notas que reconocerá el cliente.</p>}
            <div className="notes-list">
              {producto.notas.map((nota, indice) => <div className="note-row" key={indice}>
                <label className="field-label">Nota<input value={nota.nombre} maxLength={40} onChange={(e) => { cambiarNota(indice, "nombre", e.target.value); cambiarNota(indice, "color", colorDeNota(e.target.value)); }} placeholder="Vainilla" /></label>
                <label className="field-label">Intensidad<input type="number" min="1" max="10" step="1" value={nota.intensidad} onChange={(e) => cambiarNota(indice, "intensidad", Number(e.target.value))} /></label>
                <label className="field-label color-field">Color<input type="color" value={nota.color} onChange={(e) => cambiarNota(indice, "color", e.target.value)} /></label>
                <button type="button" className="remove-button" aria-label={`Quitar nota ${nota.nombre || indice + 1}`} onClick={() => cambiar("notas", producto.notas.filter((_, posicion) => posicion !== indice))}>×</button>
              </div>)}
            </div>
          </section>
        </div>
        <aside className="form-aside">
          <section className="form-section">
            <p className="eyebrow">Venta</p>
            <label className="field-label">Precio base · 50 ml<span className="currency-input"><span>$</span><input type="number" min="1" max="100000" step="1" value={producto.precioBase} onChange={(e) => cambiar("precioBase", Number(e.target.value))} required /></span></label>
            <label className="field-label">Frascos en stock<input type="number" min="0" max="100000" step="1" value={producto.stock} onChange={(e) => cambiar("stock", Number(e.target.value))} required /></label>
            <label className="check-row"><input type="checkbox" checked={producto.destacado} onChange={(e) => cambiar("destacado", e.target.checked)} /><span>Mostrar como “De la casa”</span></label>
            <label className="check-row"><input type="checkbox" checked={Boolean(producto.oculto)} onChange={(e) => cambiar("oculto", e.target.checked)} /><span>Ocultar de la tienda</span></label>
          </section>
          <section className="form-section">
            <p className="eyebrow">Fotografía</p>
            <div className="photo-preview">{preview || rutaImagen(producto.imagen) ? <Image unoptimized width={500} height={500} src={preview || rutaImagen(producto.imagen)} alt={`Vista previa de ${producto.nombre || "la esencia"}`} /> : <span>Sin foto</span>}</div>
            <label className="field-label">Subir JPG, PNG o WebP<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFoto(e.target.files?.[0] || null)} /></label>
            <p className="subtle tiny">Máximo 8 MB. Se guarda en WebP; con rembg instalado se quita el fondo de cualquier color. Sin rembg se quita el blanco.</p>
          </section>
        </aside>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {mensaje && <p className="form-success" role="status">{mensaje}</p>}
      <div className="form-actions"><button type="submit" className="primary-button" disabled={ocupado}>{ocupado ? "Guardando…" : inicial ? "Guardar cambios" : "Crear esencia"}</button></div>
    </form>
  );
}
