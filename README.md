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
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📦 Paquetes Compartidos

### @fj-solutions/contracts
Contiene los tipos TypeScript compartidos entre web, admin y api:
- Interfaces de dominio (User, Product, Order, etc.)
- Enums (Role, OrderStatus, QuoteStatus)
- Tipos de respuesta de API

Instalado como workspace dependency en todas las apps.

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
- **API Backend**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
