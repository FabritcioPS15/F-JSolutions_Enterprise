# Configuración de Prisma en el Monorepo

## ✅ SOLUCIÓN IMPLEMENTADA

El proyecto ya está configurado correctamente con Prisma. La solución utilizada fue agregar la configuración `allowBuilds` en `pnpm-workspace.yaml` para permitir los scripts de build de Prisma y esbuild.

## Configuración Actual

El archivo `pnpm-workspace.yaml` incluye:

```yaml
allowBuilds:
  '@prisma/client': true
  '@prisma/engines': true
  esbuild: true
  prisma: true
```

## Pasos para Instalación

1. **Instalar dependencias**:
```bash
pnpm install
```

2. **Generar cliente de Prisma**:
```bash
cd apps/api
npx prisma generate --schema=../../database/schema.prisma
```

3. **Ejecutar migraciones** (cuando tengas base de datos configurada):
```bash
cd apps/api
npx prisma migrate dev --schema=../../database/schema.prisma
```

## Comandos Útiles

```bash
# Desde la raíz del proyecto
pnpm db:generate    # Generar cliente de Prisma
pnpm db:migrate     # Ejecutar migraciones
pnpm db:studio      # Abrir Prisma Studio
```

## Estructura de Prisma

- **Schema**: `database/schema.prisma` - Schema centralizado
- **Migraciones**: `database/migrations/` - Historial de migraciones
- **Seeds**: `database/seeds/` - Datos de prueba
- **Cliente**: Se genera en `node_modules/.pnpm/@prisma+client/...`

## Para Producción

En producción, usa Docker donde los scripts de build se ejecutan durante el build de la imagen:

```bash
docker-compose build
docker-compose up -d
```

## Notas

- El cliente de Prisma se genera automáticamente durante el `pnpm install` gracias a la configuración `allowBuilds`
- Si necesitas regenerar el cliente después de cambios en el schema, ejecuta `pnpm db:generate`
- El schema está centralizado en `database/` para ser compartido entre todas las apps
