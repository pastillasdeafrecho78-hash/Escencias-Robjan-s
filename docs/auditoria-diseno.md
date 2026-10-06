# Auditoría de diseño · octubre 2026

Revisión de `src/` con dos skills: `web-design-guidelines` (reglas de interfaz de Vercel) y `redesign-skill` (modo auditoría). Prioridad: **A** se corrige ya, **M** se corrige en esta ronda, **B** queda anotado.

## Reglas de interfaz (Vercel)

### Foco y accesibilidad
- **A** `src/app/globals.css:77` `.field` usa `outline: none` y solo cambia el borde inferior. Falta un foco visible claro con teclado.
- **A** `src/components/Header.tsx:48` y `src/components/Catalogo.tsx:103`: búsqueda y orden con `outline-none` sin anillo de foco.
- **A** No hay un anillo de foco global: enlaces, tarjetas y botones dependen del contorno del navegador, que casi no se ve sobre negro.
- **A** `src/app/layout.tsx` no tiene un enlace "Saltar al contenido", y `<main>` no tiene `id`.
- **M** `src/components/CartDrawer.tsx`: el foco no entra al panel al abrirlo ni regresa al cerrarlo; Tab se escapa detrás; falta `overscroll-behavior: contain` en la lista.
- **M** `src/components/ElegirTamano.tsx`: la hoja del celular no bloquea el desplazamiento del fondo (`overscroll-behavior`).
- **M** `src/app/carrito/page.tsx:50,62`: los botones dicen solo "Disminuir"/"Aumentar", sin decir de qué frasco.
- **B** `src/components/ProductoDetalle.tsx:28`: la palabra gigante de fondo ya tiene `aria-hidden`; bien.

### Formularios
- **A** `src/app/pedido/page.tsx`: los errores salen abajo en un solo texto; deben ir junto al campo, con foco en el primero con error y `aria-invalid`/`aria-describedby`.
- **M** `src/app/pedido/page.tsx:102`: el teléfono necesita `type="tel"` y `name`; el nombre necesita `name`.
- **M** `src/app/pedido/pago/page.tsx`: número y CVC sin `autocomplete="cc-number"`/`cc-csc`, vencimiento sin `cc-exp` ni `inputmode`; `spellCheck={false}` en los tres.
- **M** Placeholders que muestran ejemplo deben terminar en `…` (`"418 000 0000"`, `"Buscar"`).

### Animación
- **M** `src/app/globals.css:152` `.cabecera-catalogo` anima `background`, que no se puede componer en GPU; se cambia por capas con `opacity`.
- ✓ `prefers-reduced-motion` ya apaga todas las animaciones.

### Tipografía
- **M** Títulos sin `text-wrap: balance` (portada, catálogo, ficha): hay viudas como "diseñador." sola en una línea.
- **M** Precios de resumen, carrito y folio sin `tabular-nums` en `src/app/pedido/page.tsx:176`, `src/app/carrito/page.tsx:73`, `src/app/pedido/listo/page.tsx:67`.
- ✓ `money()` ya usa `Intl.NumberFormat("es-MX")`.

### Rendimiento
- **M** `src/components/Catalogo.tsx:152` pinta 304 tarjetas con imagen. Se aplica `content-visibility: auto` con `contain-intrinsic-size` por tarjeta.
- **B** `src/components/ProductCard.tsx:18` sin `sizes`: Next sirve la imagen más grande de lo necesario en el celular.

### Tema, toque y zonas seguras
- **M** `src/app/layout.tsx`: falta `viewport.themeColor` igual al fondo (`#08080a`); la barra del navegador en el celular sale clara.
- **M** `touch-action: manipulation` y `-webkit-tap-highlight-color` intencional en botones y enlaces.
- **M** `src/components/Catalogo.tsx:99` `<select>` nativo: color y fondo explícitos en `<option>` para Windows.
- **B** `translate="no"` en el nombre de la tienda para que el traductor automático no lo cambie.

### Estado en la URL
- **M** `src/components/Catalogo.tsx`: categoría, búsqueda y orden cambian en pantalla pero no en la URL; si compartes el enlace, se pierde el filtro. Se sincroniza con `history.replaceState`, sin volver a pedir la página.

### Excepciones
- La regla de "Title Case" de las guías es para inglés; en español va mayúscula solo al inicio.
- El pago de prueba deja `autocomplete="off"` a propósito: no queremos que el navegador ofrezca una tarjeta real en un cobro de prueba.

## Estado

Corregidos todos los **A** y **M** de reglas de interfaz. Los de layout (catálogo en el celular, tres tamaños, vitrina de la casa, sugerencias por notas, foco en tarjetas) se resuelven en el rediseño guiado por `DESIGN.md`.

## Rediseño (redesign-skill)

### Layout
- **A** Catálogo en el celular: el encabezado ocupa toda la primera pantalla (título, subtítulo, precios, filtros, orden, búsqueda) y no se ve ni un frasco. Debe compactarse y los filtros quedarse a la mano al bajar.
- **M** Portada: "Tres tamaños" es la fila genérica de tres columnas iguales que el skill marca como seña de IA. Se rehace como composición asimétrica, con los tamaños como frascos a escala.
- **M** Portada: después de la apertura no hay ni un perfume; el visitante que no eligió lado no ve producto. Falta una vitrina de "De la casa" con frascos reales.
- **M** Ficha: "También en el anaquel" elige los primeros de la misma categoría, sin relación con el aroma. Se ordena por notas en común y se renombra.
- **B** Ficha: la descripción del producto no aparece en la página (solo en metadata); hoy repite las notas, así que no aporta. Se deja así.

### Estados
- **M** Ficha: al añadir al carrito no hay confirmación junto al botón; solo se abre el panel. Aceptable, se deja.
- ✓ Catálogo vacío, carrito vacío, error y 404 tienen texto propio.

### Superficies e interacción
- **M** Tarjetas: el estado hover solo mueve el frasco; con teclado no hay ninguna señal. Se agrega un anillo con `focus-visible` y luz del lado.
- ✓ Fondo `#08080a`, no negro puro. Dorado desaturado. Sin brillos neón.

### Datos
- **B** `familia` viene escrita de muchas formas ("Fougère", "Fougere", "Fougére", "Florar"). Es dato del dueño; se corrige desde el panel, no en el código.
