import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Instrument_Serif, Inter_Tight } from "next/font/google";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/components/CartProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { tienda } from "@/lib/tienda";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});
const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" });
const editorial = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant-garamond",
});

export const metadata: Metadata = {
  title: {
    default: `${tienda.nombre} · Fragancias inspiradas`,
    template: `%s · ${tienda.nombre}`,
  },
  description:
    "Perfumería en Dolores Hidalgo. Fragancias inspiradas en 30, 50 y 100 ml. Recógelas en Querétaro 20 o en Rivera del Río, o apártalas por WhatsApp.",
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable} ${editorial.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#contenido"
          className="sr-only z-[70] rounded-full bg-bone px-4 py-2 text-sm text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Saltar al contenido
        </a>
        <CartProvider>
          <Header />
          <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
