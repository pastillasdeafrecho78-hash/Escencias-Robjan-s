# Esencias Robjan's

Tienda de fragancias inspiradas en Dolores Hidalgo, Guanajuato. El sitio parte del repositorio [escencias-robjans](https://github.com/PastMilk78/escencias-robjans) y reemplaza el escaparate anterior. Tiene dos aplicaciones:

- **La tienda** (raíz del repositorio): lo que ven los clientes.
- **El panel** (`panel/`): una aplicación aparte, con contraseña, donde el dueño da de alta esencias, cambia precios y stock, y sube fotos. La tienda no tiene ninguna ruta de administración.

## Qué puedes hacer en la tienda

- Abrir eligiendo Caballero o Dama. La elección queda guardada y el catálogo la respeta; «Ver las 304» muestra las dos.
- Recorrer el catálogo, buscar por nota o inspiración y filtrar por caballero o dama.
- Ver en cada esencia la intensidad de sus notas con barras de color.
- Elegir frasco de 30, 50 o 100 ml: $275, $385 y $550. Los precios se cambian en el panel.
- Armar un carrito que se guarda en el navegador.
- Pagar en modo prueba con la tarjeta `4242 4242 4242 4242`. No hay cargo real. La tarjeta `4000 0000 0000 0002` se rechaza para probar el error.

El catálogo sale del PDF de Whatsie (`scripts/extraer-catalogo.py`) y queda en `src/data/catalogo.json`. Cada foto se extrae a su tamaño nativo, se le quita el fondo con rembg y se guarda en WebP dentro de `public/catalogo`. La marca se vectoriza desde la placa con `scripts/trazar-marca.py`.

## Cómo correrlo

### Solo la tienda

```bash
npm install
npm run dev -- -p 3457
```

Abre [http://localhost:3457](http://localhost:3457). Sin `MONGODB_URI` la tienda lee `src/data/catalogo.json`.

### Tienda con base de datos y panel

1. Copia los ejemplos de configuración:

   ```bash
   cp .env.example .env.local
   cp panel/.env.example panel/.env.local
   ```

   En `panel/.env.local` pon una `PANEL_PASSWORD` de al menos 10 caracteres y un `PANEL_SECRET` (`openssl rand -hex 32`). Esos archivos no se suben al repositorio.

2. Enciende MongoDB. Para probar sin instalar nada:

   ```bash
   npm run mongo:local
   ```

   Levanta un Mongo en `127.0.0.1:27017` que guarda los datos en `.mongo-local/`. En producción, apunta `MONGODB_URI` a tu base.

3. Copia el catálogo a la base:

   ```bash
   npm run sembrar
   ```

   Agrega las 304 esencias por slug sin pisar lo que ya editaste. `npm run sembrar -- --pisar` las vuelve a dejar como en el PDF. Si la colección tiene documentos de otro proyecto, se detiene: usa otra base con `MONGODB_DB` o `MONGODB_COLECCION`.

4. Corre la tienda y el panel, cada uno en su terminal:

   ```bash
   npm run dev -- -p 3457
   npm install --prefix panel
   npm run panel
   ```

   El panel queda en [http://127.0.0.1:3458](http://127.0.0.1:3458) y solo escucha en tu máquina.

### Qué guarda la base

| Colección | Contenido |
| --- | --- |
| `productos` | Una esencia por documento: nombre, inspiración, lado, familia, notas con intensidad y color, precio de 50 ml, stock, si es de la casa y si está oculta. |
| `ajustes_tienda` | El precio de mostrador y los porcentajes de 30, 50 y 100 ml. |
| `fotos_esencias` | Las fotos que se suben desde el panel, ya recortadas. La tienda las sirve en `/fotos/<slug>.webp`. |

La base por omisión es `FrateliFinal`. Si ese nombre ya lo usa otro proyecto, cambia `MONGODB_DB` en los dos `.env.local`.

### Seguridad del panel

- La contraseña vive solo en `panel/.env.local`.
- La sesión es una cookie httpOnly y `SameSite=Strict`, firmada con HMAC y válida 12 horas.
- Se permiten 5 intentos fallidos cada 15 minutos.
- Cada acción vuelve a revisar la sesión aunque el middleware ya la haya revisado.
- Las fotos se validan por contenido (JPG, PNG o WebP, hasta 8 MB) y se recortan con `scripts/recortar-foto.py`, que usa rembg si está instalado (`pip install rembg pillow`).

## Publicar en Vercel

Solo se publica la tienda; `.vercelignore` deja fuera el panel y los scripts.

1. En Vercel, **Add New → Project** e importa este repositorio. Vercel detecta Next.js; no cambies el directorio raíz.
2. Sin variables de entorno, la tienda sale con las 304 esencias de `src/data/catalogo.json` y el pago de prueba.
3. Para que lo que edita el dueño en el panel se vea en línea, agrega en **Settings → Environment Variables**:
   - `MONGODB_URI`: una base accesible desde internet, por ejemplo MongoDB Atlas, con un usuario de solo lectura para la tienda.
   - `MONGODB_DB` y, si hace falta, `MONGODB_COLECCION`.

   El panel corre en la máquina del dueño apuntando a esa misma base con un usuario que sí puede escribir.

Desde la terminal también funciona: `npx vercel` para una vista previa y `npx vercel --prod` para producción.

## Datos de la tienda

- Querétaro 20, Centro, Dolores Hidalgo, Guanajuato
- 418 305 6738
- escenciasrobjans@gmail.com
- Lunes a sábado, 10:00 a 20:00

Las fragancias están descritas como inspiraciones. La tienda no está afiliada a las marcas originales.
