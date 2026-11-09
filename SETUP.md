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

4. **Ejecutar migraciones y seed**:
```bash
pnpm db:migrate
pnpm db:seed
```

Define `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` en `.env` antes del seed. Si
omites la contraseña se usa un valor de desarrollo y el seed lo advierte.

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
- **Panel Admin**: http://localhost:3002 (`/login` valida las credenciales en
  local, sin API ni PostgreSQL; por defecto `admin@fjsolutions.com.pe` /
  `Admin12345!`, o los valores de `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`)
- **API Backend**: http://localhost:4000

### Cuentas del panel

No existe registro público: la cuenta base (superadministrador) se define por
variables de entorno y, desde **Usuarios**, es la única que puede registrar
nuevas cuentas con su contraseña inicial, rol y estado. Las cuentas creadas se
guardan en `apps/admin/.data/admin-users.json` con la contraseña hasheada
(scrypt); ese archivo está en `.gitignore` y no se versiona. Borrarlo reinicia
el panel dejando solo la cuenta base.

Los roles `admin`, `ventas`, `soporte` y `consulta` pueden ver la lista de
usuarios, pero no crear, editar ni eliminar cuentas.

### Cuentas web de clientes

Los clientes sí pueden crear su propia cuenta desde la tienda (`/registro`) con
correo y contraseña, o con Google/Facebook cuando el entorno define las
credenciales (`GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`,
`FACEBOOK_APP_ID`/`FACEBOOK_APP_SECRET`). Sin ellas, esos botones aparecen
desactivados y solo se puede usar el correo.

Con la opción de correo, la cuenta queda **pendiente** hasta que el cliente abre
el enlace de confirmación enviado a su bandeja; no puede iniciar sesión antes.
En el panel, **Clientes → Cuentas web** lista las cuentas creadas y permite
reenviar la confirmación, verificarla manualmente, bloquear o reactivar el
acceso. Reenviar y verificar requieren permiso `clients.update`.

El registro se guarda en `.data/customer-accounts.json` (raíz del repositorio,
compartido por tienda y panel; cambia `FJ_DATA_DIR` para moverlo) y los correos
de confirmación en `.data/outbox/`. Ambos están en `.gitignore`. Sin SMTP
configurado el correo no sale: queda en la bandeja local y el panel muestra el
enlace de confirmación. Al definir `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (y
opcionalmente `SMTP_PORT`, `EMAIL_FROM`) en el `.env` de la tienda y del panel,
el envío es real.

La sesión de la tienda se firma con `CUSTOMER_SESSION_SECRET` (si falta, usa
`ADMIN_SESSION_SECRET`) y los enlaces de confirmación se arman con
`CUSTOMER_APP_URL` (por defecto `http://localhost:3000`).

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
