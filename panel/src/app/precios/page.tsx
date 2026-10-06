import { AdminShell } from "@/components/AdminShell";
import { PricesForm } from "@/components/PricesForm";
import { exigirSesion } from "@/lib/auth";
import { leerAjustes } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PreciosPage() {
  await exigirSesion();
  const ajustes = await leerAjustes();
  return <AdminShell><div className="page-heading"><div><p className="eyebrow">Mostrador</p><h1>Precios por tamaño</h1><p className="subtle">Un ajuste para toda la vitrina.</p></div></div><PricesForm ajustes={ajustes} /></AdminShell>;
}
