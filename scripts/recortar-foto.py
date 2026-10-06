#!/usr/bin/env python3
"""Valida JPG/PNG/WebP, elimina un fondo blanco conectado al borde y guarda WebP.

Si rembg está instalado, usa ese modelo para fondos de cualquier color.
Uso: python scripts/recortar-foto.py entrada.jpg salida.webp
"""
import io
from collections import deque
from pathlib import Path
import sys

from PIL import Image, ImageOps, UnidentifiedImageError

Image.MAX_IMAGE_PIXELS = 24_000_000


def quitar_blanco(imagen: Image.Image) -> Image.Image:
    """Solo borra píxeles casi blancos conectados con el borde; conserva el frasco."""
    imagen = imagen.convert("RGBA")
    ancho, alto = imagen.size
    if ancho * alto > 4_000_000:
        imagen.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
        ancho, alto = imagen.size
    pixeles = imagen.load()
    cola = deque()
    vistos = bytearray(ancho * alto)

    def agregar(x: int, y: int) -> None:
        indice = y * ancho + x
        if vistos[indice]:
            return
        vistos[indice] = 1
        r, g, b, _ = pixeles[x, y]
        if min(r, g, b) >= 242 and max(r, g, b) - min(r, g, b) <= 12:
            cola.append((x, y))

    for x in range(ancho):
        agregar(x, 0)
        agregar(x, alto - 1)
    for y in range(alto):
        agregar(0, y)
        agregar(ancho - 1, y)
    while cola:
        x, y = cola.popleft()
        r, g, b, _ = pixeles[x, y]
        pixeles[x, y] = (r, g, b, 0)
        if x > 0:
            agregar(x - 1, y)
        if x + 1 < ancho:
            agregar(x + 1, y)
        if y > 0:
            agregar(x, y - 1)
        if y + 1 < alto:
            agregar(x, y + 1)
    return imagen


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("Uso: recortar-foto.py entrada.jpg salida.webp")
    entrada, salida = map(Path, sys.argv[1:])
    if entrada.stat().st_size > 8 * 1024 * 1024:
        raise ValueError("La foto supera 8 MB")
    try:
        with Image.open(entrada) as original:
            if original.format not in {"JPEG", "PNG", "WEBP"}:
                raise ValueError("Formato no permitido")
            imagen = ImageOps.exif_transpose(original).convert("RGBA")
    except UnidentifiedImageError as error:
        raise ValueError("La foto no es una imagen válida") from error
    if imagen.width < 100 or imagen.height < 100:
        raise ValueError("La foto debe medir al menos 100 × 100 px")
    imagen.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
    try:
        from rembg import remove

        salida_modelo = remove(imagen)
        if isinstance(salida_modelo, bytes):
            imagen = Image.open(io.BytesIO(salida_modelo)).convert("RGBA")
        else:
            imagen = salida_modelo.convert("RGBA")
    except ImportError:
        imagen = quitar_blanco(imagen)
    salida.parent.mkdir(parents=True, exist_ok=True)
    imagen.save(salida, "WEBP", quality=88, method=6)


if __name__ == "__main__":
    main()
