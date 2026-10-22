import type { MetadataRoute } from "next";

const origin = "https://esencias-robjans.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/productos", "/contacto", "/aviso-de-privacidad", "/terminos", "/aviso-legal"].map((path) => ({
    url: `${origin}${path}`,
    changeFrequency: path === "/productos" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.5,
  }));
}
