# Panel administrativo FJ Systems

Documento de arquitectura del panel local actual y del esquema relacional propuesto. **Nada de lo descrito como propuesta está aplicado todavía**: el panel funciona con `localStorage` y no incluye autenticación real.

## Estado actual

- App: `apps/admin` (Next.js App Router, TypeScript, Tailwind).
- Persistencia: React Context `AdminProvider` + `localStorage` con la clave `fj-systems-admin-v1`.
- Datos iniciales: catálogo de demostración en `src/lib/admin/seed.ts`.
- Rutas implementadas:
  - `/` resumen
  - `/productos`, `/productos/nuevo`, `/productos/[id]`, `/productos/[id]/editar`
  - `/categorias`, `/marcas`
  - `/actividad`
  - `/configuracion`
- Módulos futuros marcados como “Pronto” en la navegación, sin páginas falsas.

## Capas propuestas

```
app/                  Rutas y composición de pantallas
components/admin/     Presentación y formularios
lib/admin/types.ts    Contratos de dominio del panel
lib/admin/seed.ts     Datos de demostración
lib/services/         Acceso a datos (adaptador local hoy, Supabase mañana)
lib/validations/      Esquemas de validación compartidos
lib/auth/             Sesión y permisos (pendiente, solo servidor)
```

El adaptador local concentra las mutaciones en `AdminProvider`. Para conectar la base de datos se reemplazan esas operaciones por funciones de `lib/services` sin cambiar las pantallas.

## Modelo relacional propuesto

El esquema actual de `database/schema.prisma` es del catálogo público y no cubre el panel. Se propone el siguiente modelo PostgreSQL; no modifica ni reemplaza el esquema existente hasta que se planifique la migración.

### Tablas

```sql
create type product_status  as enum ('draft', 'published', 'archived');
create type category_status as enum ('active', 'inactive');
create type brand_status    as enum ('active', 'inactive');

create table brands (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  logo_url    text,
  status      brand_status not null default 'active',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint brands_name_unique unique (name)
);

create table categories (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid references categories(id) on delete restrict,
  name        text not null,
  slug        text not null unique,
  description text,
  image_url   text,
  status      category_status not null default 'active',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint categories_sibling_name_unique unique (parent_id, name)
);

create table products (
  id                 uuid primary key default gen_random_uuid(),
  category_id        uuid not null references categories(id) on delete restrict,
  brand_id           uuid references brands(id) on delete set null,
  name               text not null,
  slug               text not null unique,
  sku                text not null unique,
  internal_code      text,
  model              text,
  short_description  text,
  description        text,
  reference_price    numeric(12, 2),
  cost               numeric(12, 2),
  show_price         boolean not null default true,
  commercial_message text,
  stock              integer not null default 0 check (stock >= 0),
  min_stock          integer not null default 0 check (min_stock >= 0),
  availability       text not null default 'available'
                     check (availability in ('available', 'limited', 'consult')),
  status             product_status not null default 'draft',
  featured           boolean not null default false,
  seo_title          text,
  seo_description    text,
  published_at       timestamptz,
  archived_at        timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index products_category_idx on products (category_id);
create index products_brand_idx on products (brand_id);
create index products_status_idx on products (status);
create index products_updated_idx on products (updated_at desc);

create table product_images (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url        text not null,
  alt        text,
  position   integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index product_images_product_idx on product_images (product_id, position);

create table product_specifications (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name       text not null,
  value      text not null,
  unit       text,
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

create index product_specs_product_idx on product_specifications (product_id, position);

create table activity_log (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references users(id) on delete set null,
  entity_type text not null,
  entity_id   uuid,
  action      text not null,
  summary     text not null,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

create index activity_created_idx on activity_log (created_at desc);
```

### Relaciones

- `categories.parent_id` modela la jerarquía de tres niveles del panel (categoría → subcategoría → tipo) sin columnas duplicadas.
- `products.category_id` apunta al nodo hoja; la ruta completa se resuelve con una CTE recursiva.
- `brands` y `categories` se desactivan con `status`; no se eliminan si tienen productos.
- Imágenes y especificaciones se eliminan en cascada con el producto.

### Búsqueda

Para búsqueda por nombre, SKU y código interno se propone un índice de texto:

```sql
create index products_search_idx on products
using gin (to_tsvector('spanish', coalesce(name, '') || ' ' || coalesce(short_description, '')));
```

## Seguridad (pendiente de implementar)

El panel actual **no valida usuarios ni permisos**. Antes de publicarlo:

1. Autenticación con Supabase Auth (o equivalente) y sesión verificada en el servidor.
2. Rutas `/admin` protegidas en middleware del servidor; no confiar en el cliente.
3. Roles `admin`, `editor`, `viewer`; escrituras solo para roles autorizados.
4. Row Level Security en todas las tablas de escritura.
5. Claves privadas (`service_role`, `DATABASE_URL`) solo en el servidor; nunca en `NEXT_PUBLIC_*`.
6. Validación compartida cliente/servidor (Zod u otra) y registro en `activity_log`.
7. Validación de archivos por MIME, tamaño y extensión antes de subirlos.

Ejemplo de políticas mínimas (borrador, revisar según el modelo de roles final):

```sql
alter table products enable row level security;

create policy "catalogo publico lee publicados"
  on products for select
  using (status = 'published');

create policy "administradores gestionan productos"
  on products for all
  using ((auth.jwt() ->> 'role') in ('admin', 'editor'))
  with check ((auth.jwt() ->> 'role') in ('admin', 'editor'));
```

## Integración futura

1. Crear el esquema propuesto en una migración revisada (no ejecutar sobre producción sin backup).
2. Implementar `lib/services/products.ts`, `categories.ts`, `brands.ts` y `activity.ts`.
3. Sustituir las llamadas de `AdminProvider` por esos servicios, manteniendo los tipos de `lib/admin/types.ts`.
4. Añadir carga/error por operación y paginación del lado del servidor.
5. Migrar los respaldos JSON locales con un importador que resuelva nombres a IDs.

Mientras tanto, la app no presenta datos financieros inventados ni afirma tener seguridad, base de datos o autenticación activas.
