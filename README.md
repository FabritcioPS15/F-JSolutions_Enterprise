# FJ Solutions - Monorepo E-commerce

Estructura monorepo para el proyecto e-commerce de FJ Tech Solutions usando pnpm workspaces.

## 📁 Estructura del Proyecto

```
ecommerce/
├── apps/
│   ├── web/                         # Tienda pública (Next.js)
│   │   └── src/
│   │       ├── app/                # App Router
│   │       ├── layouts/            # Layouts compartidos
│   │       ├── pages/              # Páginas
│   │       │   ├── Home/          # Página de inicio
│   │       │   ├── Catalog/       # Catálogo de productos
│   │       │   ├── ProductDetail/ # Detalle de producto
│   │       │   ├── Brand/         # Página de marca
│   │       │   └── Quotation/     # Solicitar cotización
│   │       ├── components/         # Componentes UI
│   │       └── features/          # Features específicas
│   │
│   ├── admin/                       # Panel de administración (Next.js)
│   │   └── src/
│   │       ├── app/                # App Router
│   │       ├── layouts/            # Layouts del admin
│   │       ├── pages/              # Páginas del admin
│   │       ├── components/         # Componentes del admin
│   │       └── features/           # Features del admin
│   │           ├── dashboard/      # Dashboard principal
│   │           ├── products/       # Gestión de productos
│   │           ├── categories/     # Gestión de categorías
│   │           ├── brands/         # Gestión de marcas
│   │           ├── attributes/     # Atributos de productos
│   │           ├── inventory/      # Control de inventario
│   │           ├── quotations/     # Gestión de cotizaciones
│   │           ├── customers/      # Gestión de clientes
│   │           ├── orders/         # Gestión de pedidos
│   │           ├── media/          # Gestión de medios
│   │           └── settings/       # Configuración general
│   │
│   └── api/                         # Backend Node.js + TypeScript
│       └── src/
│           ├── modules/            # Módulos por dominio
│           │   ├── auth/           # Autenticación
│           │   ├── users/          # Usuarios
│           │   ├── products/       # Productos
│           │   ├── categories/     # Categorías
│           │   ├── brands/         # Marcas
│           │   ├── attributes/     # Atributos
│           │   ├── inventory/      # Inventario
│           │   ├── media/          # Medios
│           │   ├── quotations/     # Cotizaciones
│           │   ├── customers/      # Clientes
│           │   ├── orders/         # Pedidos
│           │   └── payments/       # Pagos
│           ├── plugins/            # Plugins de terceros
│           └── shared/             # Código compartido
│               ├── config/         # Configuración
│               ├── middleware/     # Middleware
│               └── utils/          # Utilidades
│
├── packages/
│   └── contracts/                  # Tipos y esquemas compartidos
│       ├── src/
│       │   └── index.ts           # Interfaces y enums
│       └── package.json
│
├── database/
│   ├── schema.prisma               # Schema de Prisma
│   ├── migrations/                 # Migraciones
│   └── seeds/                      # Seeds
│
├── docker-compose.yml              # Docker compose
├── package.json                    # Root package.json
└── pnpm-workspace.yaml             # Configuración de workspaces
```

## 🚀 Comandos

### Instalación
```bash
# IMPORTANTE: Usa pnpm, no npm
# pnpm maneja los workspaces automáticamente
pnpm install

# Generar cliente de Prisma
pnpm db:generate
```

### Desarrollo
```bash
# IMPORTANTE: Ejecutar siempre desde la raíz del proyecto
# cd C:\Users\Sistemas\Downloads\fj_solutions

# Ejecutar todos los servicios
pnpm dev

# Solo tienda pública
pnpm dev:web

# Solo panel de administración
pnpm dev:admin

# Solo API
pnpm dev:api
```

### Build
```bash
# Build de todas las apps
pnpm build

# Build de contracts (tipos compartidos)
pnpm build:contracts
```

### Base de Datos
```bash
# Ejecutar migraciones
pnpm db:migrate

# Abrir Prisma Studio
pnpm db:studio

# Seed de datos
pnpm db:seed
```

### Docker
```bash
# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## 🔧 Variables de Entorno

Copia `.env.example` a `.env` y configura las variables:

```env
DATABASE_URL=postgresql://fj_solutions:fj_solutions_password@localhost:5432/fj_solutions
PORT=4000
NODE_ENV=development
JWT_SECRET=change-me-dev-jwt-secret-0123456789abcdef
JWT_REFRESH_SECRET=change-me-dev-refresh-secret-0123456789
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

El archivo `.env.example` incluye todas las variables (seguridad, SMTP, seed y
URLs internas). `API_INTERNAL_URL` y `HELPDESK_API_URL` son de uso exclusivo del
servidor de Next.js: nunca se exponen al navegador.

Tras `pnpm db:migrate` y `pnpm db:seed`, el panel en `/login` autentica contra la
base de datos. El seed crea un superadministrador con `SEED_ADMIN_EMAIL` y
`SEED_ADMIN_PASSWORD` (si no se define la contraseña, usa un valor de desarrollo
y lo advierte en consola).

## 📦 Paquetes Compartidos

### @fj-solutions/contracts
Contiene los tipos TypeScript compartidos entre web, admin y api:
- Contratos legacy de la API (`User`, `Product`, `Order`, `Cotizacion`, etc.)
- Modelo del panel administrativo en el namespace `admin`
  (`import type { admin } from '@fj-solutions/contracts'`)
- Enums compartidos (`Role`, `OrderStatus`, `QuoteStatus`)

El paquete se compila a `dist/`; los scripts `predev`/`prebuild` de las apps lo
compilan automáticamente si falta.

## 🛠️ Stack Tecnológico

- **Frontend (Web)**: Next.js 16, React 19, Tailwind CSS 4, shadcn/ui
- **Frontend (Admin)**: Next.js 16, React 19, Tailwind CSS 4, shadcn/ui
- **Backend**: Express, TypeScript, Prisma
- **Database**: PostgreSQL
- **Cache**: Redis
- **Package Manager**: pnpm workspaces
- **Container**: Docker & Docker Compose

## 🌐 Puertos

- **Tienda Pública**: http://localhost:3000
- **Panel Admin**: http://localhost:3002
- **API Backend**: http://localhost:4000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
