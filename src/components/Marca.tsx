import { useId } from "react";
import { PIEZAS, TRAZO } from "@/components/marca-trazos";

const simbolo = PIEZAS.find((pieza) => pieza.id === "simbolo")!;
const letras = PIEZAS.filter((pieza) => pieza.id !== "simbolo");

const VISTA = {
  completa: "92 108 846 770",
  simbolo: "288 112 500 494",
};

// Una ola de 256 de largo repetida a lo ancho; se desliza una longitud exacta para que el ciclo no salte.
const OLA = (() => {
  let d = "M-512 0";
  for (let x = -512; x < 1536; x += 256) {
    d += ` q64 -18 128 0 t128 0`;
  }
  return d;
})();

export function Marca({
  tamano = "portada",
  quieta = false,
  className,
}: {
  tamano?: "portada" | "header";
  quieta?: boolean;
  className?: string;
}) {
  const header = tamano === "header";
  const uid = useId().replace(/:/g, "");
  const ids = {
    oro: `oro-${uid}`,
    brillo: `brillo-${uid}`,
    simbolo: `simbolo-${uid}`,
    forma: `forma-${uid}`,
    nivel: `nivel-${uid}`,
    revela: `revela-${uid}`,
    pluma: `pluma-${uid}`,
  };

  return (
    <div className={`${header || quieta ? "marca-quieta" : "marca-viva"} ${className ?? (header ? "w-8" : "mx-auto w-[min(84vw,460px)]")}`}>
      <svg
        viewBox={header ? VISTA.simbolo : VISTA.completa}
        className="block h-auto w-full overflow-visible"
        role={header ? "presentation" : "img"}
        aria-label={header ? undefined : "Esencias Robjan's"}
        aria-hidden={header ? true : undefined}
      >
        <defs>
          <linearGradient id={ids.oro} gradientUnits="userSpaceOnUse" x1="280" y1="110" x2="760" y2="880">
            <stop offset="0" stopColor="#f7e9c2" />
            <stop offset="0.34" stopColor="#d9b56c" />
            <stop offset="0.62" stopColor="#a47c3c" />
            <stop offset="0.86" stopColor="#d8bd80" />
            <stop offset="1" stopColor="#efdcab" />
          </linearGradient>
          <linearGradient id={ids.brillo} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0.4" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={ids.simbolo}>
            <path transform={TRAZO} d={simbolo.d} />
          </clipPath>
          <mask id={ids.forma} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024">
            {PIEZAS.map((pieza) => (
              <path key={pieza.id} transform={TRAZO} d={pieza.d} fill="#fff" />
            ))}
          </mask>
          <mask id={ids.nivel} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024">
            <g className="nivel">
              <path className="ola" d={`${OLA} V700 H-512 Z`} fill="#fff" />
            </g>
          </mask>
          <linearGradient id={ids.pluma} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0.62" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={ids.revela} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024">
            <rect className="revela revela-esencias" x="0" y="620" width="1560" height="130" fill={`url(#${ids.pluma})`} />
            <rect className="revela revela-robjans" x="0" y="780" width="1560" height="90" fill={`url(#${ids.pluma})`} />
          </mask>
        </defs>

        <path
          className="contorno"
          transform={TRAZO}
          d={simbolo.d}
          pathLength={1}
          fill="none"
          stroke={`url(#${ids.oro})`}
          strokeWidth={1.2}
          vectorEffect="non-scaling-stroke"
        />
        <g clipPath={`url(#${ids.simbolo})`}>
          <rect x="0" y="0" width="1024" height="1024" fill={`url(#${ids.oro})`} mask={`url(#${ids.nivel})`} />
          {!header && !quieta && (
            <g className="nivel">
              <path className="ola" d={OLA} fill="none" stroke="#fff6dc" strokeOpacity={0.7} strokeWidth={3} />
            </g>
          )}
        </g>
        {!header && (
          <g mask={`url(#${ids.revela})`}>
            {letras.map((pieza) => (
              <path key={pieza.id} className="letra" transform={TRAZO} d={pieza.d} fill={`url(#${ids.oro})`} />
            ))}
          </g>
        )}
        <g mask={`url(#${ids.forma})`}>
          <rect className="brillo-marca" x="-900" y="0" width="900" height="1024" fill={`url(#${ids.brillo})`} />
        </g>
      </svg>
    </div>
  );
}
