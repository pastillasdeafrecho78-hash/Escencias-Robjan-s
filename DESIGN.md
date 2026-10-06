---
version: 1
name: Esencias Robjan's
description: Perfumería de mostrador en Dolores Hidalgo, Gto. Fragancias inspiradas en perfumes de diseñador, en 30, 50 y 100 ml. La tienda se siente como una vitrina de noche. Fondo casi negro, frascos reales iluminados desde un lado (luz fría para caballero, cálida para dama), títulos en serif editorial y un solo acento dorado que sale del logo. Nada brilla de más. El protagonista siempre es el frasco.

colors:
  ink: "#08080a"        # fondo de toda la página; nunca negro puro
  field: "#111113"      # superficies elevadas: hojas, paneles, fondo neutro de frasco
  line: "#26262a"       # bordes finos y divisiones
  bone: "#f2ede3"       # texto principal y botón primario
  bone-dim: "#cfc8ba"   # texto secundario, cursivas de apoyo
  muted: "#8f897e"      # etiquetas, ayudas, texto terciario
  gold: "#d2ad68"       # único acento: logo, palabra clave, foco de teclado
  alert: "#e07a68"      # errores y quitar
  noche: "#0b1219"      # base del lado caballero
  vino: "#160c11"       # base del lado dama

luz:
  caballero: "rgba(120, 166, 204, 0.20) desde la izquierda"
  dama: "rgba(214, 120, 128, 0.20) desde la derecha"
  neutra: "rgba(210, 173, 104, 0.10) al centro"

typography:
  display:
    fontFamily: "Instrument Serif"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: -0.015em
    uso: "títulos, nombres de perfume, precios grandes, tamaños (30 ml)"
  display-italic:
    fontFamily: "Instrument Serif italic"
    uso: "segunda línea de un título, marca inspiradora, palabra clave en dorado"
  body:
    fontFamily: "Inter Tight"
    fontSize: 14px
    lineHeight: 1.6
  etiqueta:
    fontFamily: "Inter Tight"
    fontSize: 11px
    letterSpacing: 0.24em
    textTransform: uppercase
    color: muted
  cifra:
    fontVariantNumeric: tabular-nums

rounded:
  pill: 999px           # botones, filtros, búsqueda
  card: 1.25rem         # tarjetas de frasco, panel de tamaños
  panel: 1.5rem         # hoja inferior en el celular, resúmenes
  option: 1rem          # opciones de tamaño y de entrega

motion:
  entrada: "cubic-bezier(0.16, 1, 0.3, 1)"
  cambio-de-lado: "cubic-bezier(0.65, 0, 0.35, 1)"
  duracion: "200 ms en estados, 400 a 800 ms en entradas"
  reducido: "prefers-reduced-motion apaga todo"
---

## Idea

Una vitrina de perfumería de noche, no una tienda en línea genérica. Se entra eligiendo un lado (Caballero o Dama) y cada lado tiene su propia luz. El resto de la página es oscuro y quieto, para que el frasco y el precio se lean primero.

## Colores

- **Superficie:** `ink` es el fondo de todo. `field` se usa solo para lo que flota encima (hoja de tamaños, panel). No se usan grises intermedios nuevos.
- **Texto:** `bone` para lo que se lee, `bone-dim` para el apoyo y `muted` para etiquetas y ayudas. No hay texto blanco puro.
- **Acento:** `gold` aparece poco: el logo, una palabra clave por sección y el anillo de foco del teclado. Nunca en fondos grandes ni en botones.
- **Lados:** la luz fría o cálida solo vive en el fondo detrás del frasco y en el encabezado del catálogo. El texto no cambia de color por lado.
- **Errores:** `alert` en el texto del error y en la línea del campo. No se usan cajas rojas.

## Tipografía

- Los títulos van en Instrument Serif, a tamaño grande con `clamp()`. La segunda línea va en cursiva y `bone-dim`. Ejemplo: "Tres tamaños, *un mismo mostrador*."
- Las etiquetas van en mayúsculas pequeñas con mucho espacio entre letras, y nombran el tema en palabras ("Lo que hacemos"), nunca con números de sección.
- Todo precio lleva la clase `cifra`. Los precios grandes van en serif.
- Los títulos llevan `text-wrap: balance` para que no quede una palabra sola en la última línea.
- Texto en español de México, mayúscula solo al inicio, en segunda persona ("Elige", "Recoge") y con verbos concretos.

## Layout

- El contenedor es `max-w-6xl` con `px-5`, y las secciones se separan con `border-t border-line`, sin cajas.
- Las composiciones son asimétricas (`1.2fr / 2fr`, texto de un lado y frasco del otro). No se hacen filas de tres tarjetas iguales para vender algo.
- En el celular, el producto aparece en la primera pantalla siempre que se pueda. Los filtros se compactan y se quedan a la mano.
- Grilla de catálogo: 2 columnas en el celular, 3 en tablet y 4 en escritorio.

## Componentes

- **Botón primario** (`.btn`): píldora `bone` con texto `ink`, y con hover blanco. Hay uno por pantalla.
- **Botón de línea** (`.btn btn-line`): píldora transparente con borde `line`, y con hover borde `bone`.
- **Campo** (`.field`): solo una línea inferior. Con foco se pone dorada y más gruesa; con error se pone `alert` y el mensaje va debajo.
- **Tarjeta de frasco:** fondo de luz por lado, frasco recortado con sombra elíptica de apoyo, nombre en serif, marca como etiqueta y precio "desde". Con hover o foco, el frasco sube 8 px.
- **Selector de tamaño:** tres opciones Chico, Mediano y Grande con su precio. En escritorio flota sobre la tarjeta; en el celular sale como hoja desde abajo.
- **Carrito:** panel a la derecha, con el foco atrapado adentro mientras está abierto.
- **Notas:** barras finas con el color de cada nota, que se llenan al entrar en pantalla.
- **Pasos del pedido:** Datos, Pago de prueba y Folio, en etiquetas con el paso actual en `bone`.

## Imágenes

- Solo se usan los frascos reales de la tienda, recortados sobre fondo transparente (`/catalogo/*.webp`). Nunca fotos oficiales de las marcas ni fotos de stock.
- El frasco siempre lleva sombra de apoyo; no flota.
- Si un producto no tiene foto, se muestra "Sin foto" en serif cursiva, sin placeholder gris.

## Movimiento

- La apertura dibuja el logo, lo llena de perfume, revela el nombre con una orilla suave y termina con un brillo. Solo pasa la primera visita.
- Se anima con `transform` y `opacity`. Si se cambia el fondo, se hace con capas que cambian de opacidad.
- Todo se apaga con `prefers-reduced-motion`.

## Accesibilidad

- Anillo de foco dorado de 2 px con separación de 3 px en todo lo interactivo.
- Hay un enlace "Saltar al contenido" al inicio.
- Los diálogos atrapan el foco, cierran con Esc y lo devuelven al cerrar.
- Los errores van junto a su campo, con `aria-invalid`, y el foco se pone en el primero.

## Contenido fijo

- Todas las fragancias son inspiraciones. El aviso de no afiliación vive una vez en la portada y en el pie de página, no en cada ficha.
- Hay dos sucursales: Centro (Querétaro 20) y Rivera del Río (Corredor Turístico, Local 14).
- Los precios salen de los ajustes del panel (hoy $275, $385 y $550). Nunca se escriben a mano en un componente.

## Qué evitar

- Brillos neón, texto con degradado, negro puro, cursores personalizados.
- Etiquetas tipo "01 / Catálogo", insignias de "Nuevo" o "Beta".
- Verbos de relleno ("eleva", "descubre la magia"), nombres inventados, números falsos.
- Copiar el diseño de otra marca.
