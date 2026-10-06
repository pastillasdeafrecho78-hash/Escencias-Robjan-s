import { Catalogo } from "@/components/Catalogo";
import { obtenerCatalogo } from "@/lib/catalogo-servidor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catálogo",
  description: "Fragancias inspiradas de Esencias Robjan's en 30, 50 y 100 ml.",
};

type Parametros = Record<string, string | string[] | undefined>;

const primero = (valor: string | string[] | undefined) => (Array.isArray(valor) ? valor[0] : valor);

export default async function ProductosPage({ searchParams }: { searchParams: Promise<Parametros> }) {
  const [{ productos, ajustes }, parametros] = await Promise.all([obtenerCatalogo(), searchParams]);
  return (
    <Catalogo
      productos={productos}
      ajustes={ajustes}
      filtros={{ q: primero(parametros.q), categoria: primero(parametros.categoria), orden: primero(parametros.orden) }}
    />
  );
}
