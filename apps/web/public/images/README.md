# Carpeta de imágenes (`apps/web/public/images/`)

Todo lo que guardes aquí se sirve desde la raíz del sitio: `public/images/heroes/inicio.jpg` → `/images/heroes/inicio.jpg`.

## Estructura

| Carpeta | Para qué |
| --- | --- |
| `heroes/` | Fondos e imágenes principales de las cabeceras (inicio, servicios, /servicios/[slug], /sistemas, productos, contacto…). |
| `logos/` | Logotipos de la marca. `logo.png` es el que usan el header y el footer. |
| `marcas/` | Logos de marcas aliadas o fabricantes (HP, Lenovo, Asus, TP-Link…). |
| `productos/` | Fotos de productos. Se sugiere una subcarpeta por categoría: `productos/laptops/`, `productos/monitores/`. |
| `servicios/` | Fotos de soporte técnico, cableado, redes, mantenimiento, proyectos en sitio. |
| `sistemas/` | Capturas o mockups de los sistemas y plataformas a medida. |
| `secciones/` | Imágenes de bloques internos (nosotros, cómo trabajamos, proyectos, clientes). |
| `equipo/` | Fotos del equipo o de instalaciones. |
| `og/` | Imágenes para compartir en redes sociales (1200×630 px). |

Si necesitas otra categoría, crea la carpeta; la convención es minúsculas y sin espacios.

## Cómo usarlas

```tsx
{/* Componente de Next.js (recomendado para imágenes de contenido) */}
import Image from 'next/image'
<Image src="/images/heroes/inicio.jpg" alt="Equipo TI en Lima" width={1920} height={1080} priority />

{/* O etiqueta img estándar */}
<img src="/images/logos/logo.png" alt="F&J Systems" />
```

Las imágenes de fondo en CSS/Tailwind también funcionan con la misma ruta:

```tsx
style={{ backgroundImage: 'url(/images/heroes/servicios.jpg)' }}
```

## Convenciones recomendadas

- Nombres en minúsculas, sin acentos ni espacios: `soporte-tecnico-01.jpg`, no `Soporte Técnico 01.JPG`.
- Usa el slug de la página o producto: `heroes/sistemas-web-a-medida.jpg`.
- Formato `.webp` o `.jpg` para fotos; `.png`/`.svg` para logos con transparencia.
- Hero de escritorio: 1920×1080 px aprox. Hero móvil: 1080×1350 px aprox.
- Peso objetivo: menos de 300 KB por imagen (comprime antes de subir).
- Siempre escribe `alt` descriptivo: beneficia accesibilidad y SEO.
- Los archivos de esta carpeta se incluyen en el build; no subas material temporal o de descarte.
