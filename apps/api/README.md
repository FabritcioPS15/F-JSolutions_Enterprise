# F&J Systems Enterprise - Backend REST API

Arquitectura de backend empresarial construida con **Node.js, Express, TypeScript, Zod y Prisma ORM**.

---

## 📁 Estructura del Proyecto

```text
backend/
├── prisma/
│   └── schema.prisma         # Modelos de base de datos PostgreSQL
├── src/
│   ├── config/               # Variables de entorno y configuración de BD
│   │   ├── database.ts
│   │   └── env.ts
│   ├── controllers/          # Controladores HTTP (manejo de req / res)
│   │   ├── auth.controller.ts
│   │   ├── contact.controller.ts
│   │   ├── order.controller.ts
│   │   └── product.controller.ts
│   ├── middleware/           # Middlewares de seguridad, auth y validación
│   │   ├── auth.ts           # JWT y control de roles (RBAC)
│   │   ├── error-handler.ts  # Capturador centralizado de errores
│   │   ├── rate-limiter.ts   # Protección anti fuerza bruta y DDoS
│   │   ├── request-logger.ts # Trazabilidad de peticiones HTTP
│   │   └── validate.ts       # Validador de esquemas Zod
│   ├── models/               # Esquemas de validación Zod
│   │   ├── order.model.ts
│   │   ├── product.model.ts
│   │   └── user.model.ts
│   ├── routes/               # Rutas de la API (v1)
│   │   ├── auth.routes.ts
│   │   ├── contact.routes.ts
│   │   ├── cotizacion.routes.ts
│   │   ├── order.routes.ts
│   │   └── product.routes.ts
│   ├── services/             # Lógica de negocio desacoplada
│   │   ├── auth.service.ts
│   │   ├── email.service.ts
│   │   ├── order.service.ts
│   │   └── product.service.ts
│   ├── types/                # Definiciones de TypeScript
│   │   └── index.ts
│   ├── utils/                # Utilidades auxiliares
│   │   ├── jwt.ts
│   │   ├── logger.ts
│   │   └── response.ts       # Respuestas estándar consistentes
│   ├── app.ts                # Inicialización de middlewares y rutas Express
│   └── server.ts             # Punto de arranque del servidor
├── tests/                    # Pruebas automatizadas (Supertest / Jest)
│   ├── auth.test.ts
│   └── products.test.ts
├── .env.example              # Plantilla de variables de entorno
├── package.json              # Dependencias y scripts
└── tsconfig.json             # Configuración del compilador TypeScript
```

---

## 🚀 Inicio Rápido

### 1. Requisitos
- Node.js >= 18.0.0
- Base de datos PostgreSQL (local o servicio en la nube como Neon / Supabase / AWS RDS)

### 2. Instalación de dependencias
```bash
cd backend
npm install
```

### 3. Configuración de Entorno
Copia el archivo `.env.example` a `.env` y configura los valores necesarios:
```bash
cp .env.example .env
```

### 4. Base de Datos (Prisma)
Generar el cliente de Prisma y ejecutar migraciones:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Iniciar en Modo Desarrollo
```bash
npm run dev
```
El servidor arrancará en `http://localhost:4000`.

---

## 🛣️ Resumen de Endpoints Principales (`/api/v1`)

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/health` | Público | Verificación del estado de salud del servidor |
| `GET` | `/api/v1/products` | Público | Catálogo con paginación, filtros y búsqueda |
| `GET` | `/api/v1/products/:id` | Público | Detalle de producto por ID |
| `POST` | `/api/v1/products` | Admin / Staff | Crear nuevo producto en catálogo |
| `PUT` | `/api/v1/products/:id` | Admin / Staff | Actualizar información de producto |
| `DELETE` | `/api/v1/products/:id` | Solo Admin | Eliminar (soft-delete) producto |
| `POST` | `/api/v1/auth/register` | Público | Registro de nuevos clientes |
| `POST` | `/api/v1/auth/login` | Público | Autenticación y obtención de tokens JWT |
| `POST` | `/api/v1/auth/refresh` | Público | Renovación de token de acceso expirado |
| `GET` | `/api/v1/auth/me` | Autenticado | Perfil del usuario en sesión |
| `POST` | `/api/v1/orders` | Autenticado | Generación de pedidos de compra |
| `GET` | `/api/v1/orders` | Autenticado | Historial de pedidos |
| `POST` | `/api/v1/cotizaciones` | Público | Solicitud formal de cotización B2B |
| `POST` | `/api/v1/contact` | Público | Formulario de contacto general / soporte |
