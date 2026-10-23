# Guía de Configuración Rápida

## Requisitos Previos

- Node.js 20+
- pnpm 12.3.4
- PostgreSQL (o usar Docker)
- Docker (opcional, para contenedores)

## Instalación

1. **Instalar pnpm** (si no lo tienes):
```bash
npm install -g pnpm@12.3.4
```

2. **Instalar dependencias del monorepo** (desde la raíz):
```bash
cd C:\Users\Sistemas\Downloads\fj_solutions
pnpm install
```

Este comando instalará:
- Dependencias de `apps/web`
- Dependencias de `apps/admin`
- Dependencias de `apps/api`
- Dependencias de `packages/contracts`

⚠️ **IMPORTANTE**: No uses `npm install` dentro de las carpetas individuales. El protocolo `workspace:*` solo funciona con pnpm desde la raíz del monorepo.

## Configuración de Base de Datos

3. **Configurar variables de entorno**:
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de base de datos.

4. **Ejecutar migraciones**:
```bash
pnpm db:migrate
```

## Ejecutar el Proyecto

5. **Opción A: Ejecutar todo junto**:
```bash
pnpm dev
```

6. **Opción B: Ejecutar servicios individuales**:
```bash
# Terminal 1 - Tienda pública
pnpm dev:web

# Terminal 2 - Panel de administración
pnpm dev:admin

# Terminal 3 - API Backend
pnpm dev:api
```

## Acceso a las Aplicaciones

- **Tienda Pública**: http://localhost:3000
- **Panel Admin**: http://localhost:3002
- **API Backend**: http://localhost:3001

## Docker (Opcional)

Si prefieres usar Docker:
```bash
docker-compose up -d
```

## Problemas Comunes

### Error: "Unsupported URL Type workspace:*"
**Causa**: Usaste `npm install` en lugar de `pnpm install`
**Solución**: Usa `pnpm install` desde la raíz del proyecto

### Error: Module not found
**Causa**: No instalaste las dependencias del paquete contracts
**Solución**: Ejecuta `pnpm install` desde la raíz

### Error: Database connection failed
**Causa**: Variables de entorno incorrectas o base de datos no iniciada
**Solución**: Verifica `.env` y asegúrate de que PostgreSQL esté corriendo
