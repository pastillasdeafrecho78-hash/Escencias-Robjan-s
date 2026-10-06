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

El catálogo original ya está incluido en `src/data/catalogo.json`, con sus fotos WebP en `public/catalogo`. El PDF y los scripts históricos de extracción y trazado de marca no estaban en la copia recuperada; no hacen falta para administrar el catálogo actual. Las fotos nuevas se procesan con `scripts/recortar-foto.py`.

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

2. Usa el MongoDB que ya escucha en `127.0.0.1:27017` o inicia uno local si ese puerto está libre:

   ```bash
   npm run mongo:local
   ```

   El comando levanta Mongo en `127.0.0.1:27017` y guarda los datos en `.mongo-local/`. Si ya hay otro Mongo en ese puerto, el comando se detiene y puedes usar el que está corriendo. La base predeterminada `EsenciasRobjans` mantiene estos productos separados.

3. Copia el catálogo a la base:

   ```bash
   npm run sembrar
   ```

   Agrega las 304 esencias por slug sin pisar lo que ya editaste. `npm run sembrar -- --pisar` repone los datos del JSON. Si la colección tiene documentos de otro proyecto, se detiene: usa otra base con `MONGODB_DB` o `MONGODB_COLECCION`.

4. Corre la tienda y el panel, cada uno en su terminal:

   ```bash
   npm run dev -- -p 3457
   npm install --prefix panel
   npm run panel
   ```

   El panel queda en [http://127.0.0.1:3458](http://127.0.0.1:3458) y solo escucha en tu máquina.

   Para subir fotos, instala Pillow en Python (`python -m pip install pillow`). `rembg` es opcional (`python -m pip install rembg`): con él se quitan fondos de cualquier color; sin él, el procesador quita fondos blancos conectados al borde. El panel acepta JPG, PNG y WebP de hasta 8 MB.

### Qué guarda la base

| Colección | Contenido |
| --- | --- |
| `productos` | Una esencia por documento: nombre, inspiración, lado, familia, notas con intensidad y color, precio de 50 ml, stock, si es de la casa y si está oculta. |
| `ajustes_tienda` | El precio de mostrador y los porcentajes de 30, 50 y 100 ml. |
| `fotos_esencias` | Las fotos que se suben desde el panel, ya recortadas. La tienda las sirve en `/fotos/<slug>.webp`. |

La base por omisión es `EsenciasRobjans`, separada de otros proyectos. Usa el mismo `MONGODB_DB` en la tienda y el panel.

### Seguridad del panel

- La contraseña vive solo en `panel/.env.local`.
- La sesión es una cookie httpOnly y `SameSite=Strict`, firmada con HMAC y válida 12 horas.
- Se permiten 5 intentos fallidos cada 15 minutos.
- Cada acción vuelve a revisar la sesión aunque el middleware ya la haya revisado.
- Las fotos se validan por contenido (JPG, PNG o WebP, hasta 8 MB) y se procesan con `scripts/recortar-foto.py`.

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
