"use client";

import { FormEvent, useState } from "react";

export function LoginForm() {
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [ocupado, setOcupado] = useState(false);
  async function entrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setOcupado(true);
    setError("");
    try {
      const respuesta = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contrasena }) });
      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error || "No se pudo entrar.");
      window.location.href = "/";
    } catch (fallo) {
      setError(fallo instanceof Error ? fallo.message : "No se pudo entrar.");
      setOcupado(false);
    }
  }
  return (
    <form onSubmit={entrar} className="login-card">
      <p className="eyebrow">Acceso privado</p>
      <h1>Tu mostrador,<br /><em>en orden.</em></h1>
      <p className="subtle">Edita las esencias, el stock y los precios desde esta máquina.</p>
      <label htmlFor="contrasena" className="field-label">Contraseña</label>
      <input id="contrasena" type="password" autoComplete="current-password" value={contrasena} onChange={(evento) => setContrasena(evento.target.value)} required autoFocus />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="primary-button" disabled={ocupado}>{ocupado ? "Entrando…" : "Entrar al panel"}</button>
    </form>
  );
}
