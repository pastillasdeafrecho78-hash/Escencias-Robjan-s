# Conceptos visuales (image-to-code)

Se generaron tres conceptos con `DESIGN.md` como base y las capturas actuales como referencia. Las imágenes usan frascos genéricos; en la tienda se usan solo los frascos reales del catálogo.

## Portada

**Se toma:**
- Vitrina "De la casa" asimétrica: una tarjeta alta a la izquierda y dos apiladas a la derecha, con luz fría o cálida según el lado.
- "Tres tamaños" como tres frascos de distinta altura sobre una misma repisa, con el tamaño y el precio debajo. Reemplaza la fila de tres columnas iguales.
- Sucursales en dos bloques anchos separados por una línea vertical.

**Se descarta:**
- Etiquetas numeradas ("Sección 1 · Filosofía"): DESIGN.md las prohíbe.
- Las direcciones del concepto; se usan las reales de `src/lib/tienda.ts`.

## Catálogo en el celular

**Se toma:**
- Encabezado compacto (etiqueta, título y subtítulo) y, en la misma pantalla, los filtros y los primeros frascos.
- Filtros de lado y orden en una sola fila de píldoras, y la búsqueda como una línea.
- Botón corto "+ Añadir" en la tarjeta.

**Se ajusta:**
- La fila de filtros se queda pegada bajo el encabezado al bajar, para cambiar de lado sin volver arriba.
- La línea de precios por tamaño sale en escritorio; en el celular ya está en el selector.

## Ficha

**Se toma:**
- Tres notas principales como chips con su color, junto al nombre: la firma del aroma de un vistazo.
- La línea "Recoge en Centro o Rivera del Río" bajo el botón.
- "Si te gusta esta": sugerencias ordenadas por notas en común, no solo por categoría.

**Se descarta:**
- Íconos de bolsa y de ubicación: el sitio no usa íconos y el texto basta.
