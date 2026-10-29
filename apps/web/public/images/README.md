# Carpeta de Imágenes Locales (`apps/web/public/images/`)

Puedes colocar aquí tus imágenes locales para usarlas en cualquier parte de la aplicación.

## ¿Cómo referenciarlas en el código?
En Next.js, todo archivo dentro de `public/` se sirve desde la raíz `/`.
Por ejemplo, si guardas una imagen como `public/images/mi-imagen.jpg`:

```tsx
// Con etiqueta <img /> estándar o Next.js <Image />:
<img src="/images/mi-imagen.jpg" alt="Descripción" />
```

## Estructura sugerida (opcional):
- `images/products/`: Fotos de laptops, componentes, servidores, accesorios.
- `images/services/`: Fotos de soporte técnico, cableado, proyectos TI.
- `images/heroes/`: Fondos o elementos visuales destacados de los encabezados.
- `images/brands/`: Logos de marcas aliadas o clientes.

