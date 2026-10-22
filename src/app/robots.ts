import type { MetadataRoute } from "next";

const origin = "https://esencias-robjans.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/carrito", "/pedido"],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
