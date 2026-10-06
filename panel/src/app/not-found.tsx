import Link from "next/link";

export default function NotFound() {
  return <main className="login-page"><div className="login-card"><p className="eyebrow">No encontrada</p><h1>Esa esencia no está aquí.</h1><Link href="/" className="primary-button">Volver al catálogo</Link></div></main>;
}
