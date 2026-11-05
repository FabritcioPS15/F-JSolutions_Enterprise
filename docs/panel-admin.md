# Panel administrativo FJ Systems

Documento de arquitectura y estado del panel. Las **Etapas 0 (fundaciones)**,
**1 (autenticación real)**, **2 (catálogo persistente)**, **3 (clientes y
cotizaciones persistentes)**, **4 (CRM y mesa de ayuda persistente)**,
**5 (métricas y reportes)**, **6 (servicios TI)**, **7 (proyectos web)**,
**8 (inventario y configuración persistentes)** y **9 (verificación en dos pasos
y credenciales de desarrollo)** quedaron implementadas el 2026-11-04. El acceso
requiere una cuenta activa validada contra PostgreSQL; catálogo, clientes,
cotizaciones, mesa de ayuda, servicios, proyectos, inventario y configuración se
sincronizan con la API. El navegador conserva solo una caché de respaldo para
cuando la API no responde.

## Estado actual

- App: `apps/admin` (Next.js App Router, TypeScript, Tailwind).
- Autenticación: pantalla `/login` de dos pasos, Route Handlers
  `/api/auth/login`, `/api/auth/logout` y `/api/auth/2fa/*`, cookies de sesión
  `httpOnly` emitidas por el servidor Next (`fj_admin_access`,
  `fj_admin_refresh`) y cookie temporal de desafío (`fj_admin_2fa`, 10 minutos).
- Verificación en dos pasos opcional por usuario (TOTP o correo) configurable en
  Configuración → Seguridad de la cuenta. Si está activa, el login devuelve un
  desafío antes de emitir la sesión.
- Credenciales de desarrollo: bloque informativo en `/login` con el correo y la
  contraseña del seed y un botón “Usar credenciales”, visible solo cuando
  `NODE_ENV !== 'production'`; no se renderiza en producción.
- Protección: el grupo de rutas `(panel)` verifica la sesión contra
  `GET /api/v1/auth/me` antes de renderizar; sin sesión redirige a `/login`.
- Persistencia: `AdminProvider` fusiona el catálogo (`/api/catalog/...`), los
  datos comerciales (`/api/commercial/...`), los servicios TI
  (`/api/services/...`), los proyectos web (`/api/projects/...`), el historial
  de inventario (`/api/inventory/...`) y la configuración (`/api/settings`) de la
  API sobre el respaldo `localStorage` con la clave `fj-systems-admin-v1`. Si la
  API falla, el panel avisa y mantiene el respaldo.
- Inventario y configuración: el registro manual de entradas, salidas y ajustes
  se persiste en `inventory_movements` y actualiza el stock del producto en una
  transacción; la configuración de tienda se guarda como JSON en `settings`
  (clave `store`). Ambos módulos muestran un aviso con “Reintentar” cuando la
  API no responde y revierten los cambios locales.
- Comercial: proxy `/api/commercial/[...path]` (restringido a `clients` y
  `quotes`) que reenvía el Bearer del servidor; `lib/services/commercial.ts`
  adapta los contratos y `AdminProvider` sincroniza altas, ediciones, cambios de
  estado y borrados con actualización optimista.
- Solicitud pública: la tienda envía a `/api/cotizacion`, que valida en servidor
  y reenvía a `POST /api/v1/quotes/public`; la API crea o reutiliza el cliente y
  genera la cotización con estado `NEW` y correlativo `COT-00002`.
- Datos iniciales: catálogo de demostración en `src/lib/admin/seed.ts`; el seed
  de PostgreSQL puebla roles, permisos, configuración y secuencias.
- Mesa de ayuda: el panel llama a su proxy `/api/helpdesk`, que reenvía a la API
  Express (`/api/v1/helpdesk`) con el token Bearer del usuario autenticado. Las
  consultas se guardan en `service_requests` (Prisma), se vinculan al cliente por
  correo y a la cotización por código, y el seguimiento (estados, notas y
  respuestas) queda en `service_request_activities`.
- Rutas implementadas:
  - `/` resumen
  - `/productos`, `/productos/nuevo`, `/productos/[id]`, `/productos/[id]/editar`
  - `/categorias`, `/marcas`
  - `/clientes`, `/cotizaciones`, `/solicitudes`, `/proyectos`
  - `/inventario`, `/actividad`, `/configuracion`
- Módulos futuros marcados como “Pronto” en la navegación, sin páginas falsas.

## Capas

```
app/                        Rutas y composición de pantallas
components/admin/           Presentación y formularios
lib/admin/types.ts          Reexporta el modelo del paquete compartido
lib/admin/seed.ts           Datos de demostración
lib/admin/helpdesk.ts       Cliente del proxy de mesa de ayuda
lib/services/               Clientes de API (catálogo, comercial, inventario, configuración) y adaptador local
lib/validations/            Esquemas de validación compartidos
lib/auth/session.ts         Cookie, verificación de sesión y URL interna (servidor)
lib/auth/types.ts           Tipo `SessionUser` compartido con el shell
app/api/catalog/            Proxy autenticado del catálogo (servidor)
app/api/commercial/         Proxy autenticado de clientes y cotizaciones (servidor)
app/api/helpdesk/           Proxy autenticado de la mesa de ayuda (servidor)
app/api/dashboard/          Proxy autenticado de métricas y reportes (servidor)
app/api/services/           Proxy autenticado de servicios TI (servidor)
app/api/projects/           Proxy autenticado de proyectos web (servidor)
app/api/inventory/          Proxy autenticado del historial de inventario (servidor)
app/api/settings/           Proxy autenticado de configuración de tienda (servidor)
app/login/                  Pantalla pública de acceso
app/(panel)/                Rutas protegidas por sesión verificada en servidor
```

Los contratos de dominio viven en `packages/contracts/src/admin.ts` y el panel
los consume mediante `export type * from '@fj-solutions/contracts/admin'`. Así
existe una sola definición de `AdminProduct`, `Client`, `Quote`, etc. para el
panel y para los futuros módulos de la API.

El adaptador local concentra las mutaciones en `AdminProvider`. Para conectar la
base de datos se reemplazan esas operaciones por funciones de `lib/services` sin
cambiar las pantallas.

## Modelo de datos canónico

`database/schema.prisma` es la fuente de verdad del modelo PostgreSQL. Ya no es
una propuesta: la Etapa 0 lo consolidó y generó la migración inicial.

### Grupos de tablas

| Dominio | Tablas |
| --- | --- |
| Seguridad | `roles`, `permissions`, `role_permissions`, `users`, `two_factor_recovery_codes`, `two_factor_challenges` |
| Catálogo | `categories` (árbol de 3 niveles), `brands`, `products`, `product_images`, `product_specs`, `inventory_movements` |
| CRM | `clients`, `client_contacts` |
| Cotizaciones | `quotes`, `quote_items`, `quote_status_history`, `document_sequences` |
| Mesa de ayuda | `service_requests`, `service_request_activities` |
| Proyectos | `projects`, `project_tasks`, `project_deployments`, `project_documents` |
| Operación | `notifications`, `audit_logs`, `settings`, `media_assets` |
| Compatibilidad | `orders`, `order_items` (se conservan del esquema anterior) |

Detalles relevantes:

- `categories.parent_id` modela categoría → subcategoría → tipo con `level`.
- `products` referencia categoría y marca con `onDelete: SetNull`; el stock se
  audita en `inventory_movements` con instantáneas de nombre y SKU.
- `quotes` guarda datos del cliente (snapshot), totales, IGV e historial de
  estados; `quote_items` conserva un `snapshot` JSON del producto cotizado.
- `service_requests` unifica la mesa de ayuda y puede vincularse a cliente y
  cotización, con prioridad, responsable y bitácora de actividades.
- `document_sequences` entrega correlativos (`COT`, `SOL`) sin carreras.
- `users` incorpora `twoFactorEnabled`, `twoFactorMethod`, `twoFactorSecret`,
  `twoFactorPendingSecret`, `twoFactorConfirmedAt` y `twoFactorLastStep`. Los
  secretos TOTP se guardan cifrados; las columnas `two_factor_recovery_codes` y
  `two_factor_challenges` almacenan hashes HMAC, intentos y vencimiento.
- Los estados de Prisma usan mayúsculas (`PUBLISHED`, `NEW`, `PENDING`), mientras
  que el frontend conserva sus etiquetas en minúsculas (`active`, `new`, …). El
  mapeo se hace en la capa de persistencia, no en la UI.

### Migración y seed

```bash
# Validar y generar el cliente
pnpm db:generate

# Aplicar migraciones (requiere PostgreSQL activo)
pnpm db:migrate

# Cargar roles, permisos, superadmin, configuración y secuencias
pnpm db:seed
```

- Migración base: `database/migrations/20261104120000_init/migration.sql`
  (28 tablas y 23 enums), junto con `migration_lock.toml`.
- Migración 2FA: `database/migrations/20261104234500_two_factor_auth/migration.sql`
  (enum `TwoFactorMethod`, columnas de 2FA en `users`, tablas de códigos de
  recuperación y desafíos).
- Seed idempotente: `apps/api/src/prisma/seed.ts`.
  - Roles: `superadmin`, `admin`, `ventas`, `soporte`, `consulta`.
  - Permisos por módulo y acción (`products.create`, `quotes.manage-status`, …).
  - Superadmin: `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`. Si no se define la
    contraseña se usa `Admin12345!` y se imprime una advertencia.
  - Configuración de tienda y secuencias `COT`/`SOL`.
- La migración fue generada y validada con `prisma validate`/`migrate diff`. En
  este entorno no había PostgreSQL ni Docker activos, por lo que **no se ejecutó
  contra una base real**; queda pendiente verificarla en un entorno con base de
  datos antes de producción.

## Seguridad

### Implementado en la Etapa 1

1. **Contraseñas con bcrypt** (costo 12). El login compara contra
   `users.password_hash` y usa un hash ficticio cuando el correo no existe para
   no filtrar cuentas por tiempo de respuesta.
2. **JWT de acceso y refresco** firmados con secretos separados. El payload
   incluye el rol, pero los permisos se resuelven desde la base de datos en cada
   petición: un cambio de rol aplica sin esperar a que expire el token.
3. **Sesión del panel en cookie `httpOnly`** (`fj_admin_access` /
   `fj_admin_refresh`), `SameSite=Lax`, `Secure` en producción. El navegador
   nunca recibe los tokens en el HTML ni en `localStorage`.
4. **Verificación en servidor**: el layout de `(panel)` llama a `/auth/me` antes
   de renderizar. Si la API o la base de datos no están disponibles, la sesión se
   considera inválida y se redirige a `/login` (no hay modo bypass).
5. **Permisos en rutas de la API** con `authenticate` + `requirePermission`
   (`products.create`, `products.update`, `products.delete`, `quotes.view`,
   `quotes.manage-status`, `requests.view/create/update/delete/reply`, etc.).
6. **Registro público cerrado**: crear usuarios exige sesión y permiso
   `users.create`; ya no existe autorregistro abierto.
7. **Mesa de ayuda sin clave compartida**: el proxy reenvía el Bearer del usuario
   y la API valida permisos de `requests.*`. Se eliminó `ADMIN_API_KEY` y
   `HELPDESK_ADMIN_KEY`.
8. **Errores genéricos de login** (`Credenciales incorrectas`) y rate limiting
   global de la API.

### Verificación en dos pasos (Etapa 9)

1. **Opcional por usuario**: cada cuenta la activa desde Configuración →
   Seguridad de la cuenta. Mientras esté inactiva, el login sigue siendo solo con
   contraseña; al activarla, la API devuelve un desafío antes de emitir tokens.
2. **Métodos**: TOTP (aplicación de autenticación, QR + clave manual) o código
   de 6 dígitos por correo (SMTP existente). El secreto TOTP se cifra con
   AES-256-GCM usando una clave derivada de `TWO_FACTOR_SECRET`.
3. **Desafío temporal**: el login 2FA responde con `challengeToken` (JWT de
   alcance `2fa`, 10 minutos) en la cookie `fj_admin_2fa`; la sesión definitiva
   solo se crea tras verificar el código.
4. **Códigos de recuperación**: 10 códigos `XXXX-XXXX` de un solo uso, guardados
   como HMAC; el panel los muestra una única vez y permite regenerarlos pidiendo
   la contraseña.
5. **Código por correo**: 6 dígitos generados con `randomInt`, hash HMAC, 10
   minutos de vigencia, máximo 5 intentos y reenvío con enfriamiento de 30
   segundos. El correo mostrado en el desafío va enmascarado (`ad***@dominio`).
6. **TOTP sin repetición**: se rechaza un código ya usado comparando el paso de
   tiempo (`twoFactorLastStep`).
7. **Desactivación y regeneración** requieren la contraseña actual; desactivar
   borra el secreto, los códigos de recuperación y los desafíos abiertos.
8. **BFF del panel**: `/api/auth/2fa/verify` y `/api/auth/2fa/resend` leen el
   desafío de la cookie `httpOnly`; `/api/auth/2fa/{status,setup,enable,disable,
   recovery-codes}` exigen sesión y reenvían el Bearer desde el servidor. Ningún
   secreto TOTP ni token se expone en `localStorage`.
9. **Atajo de desarrollo local**: con `NODE_ENV=development`, `POST
   /auth/2fa/verify` acepta el código `000000` para cualquier desafío válido. Es
   una comodidad exclusiva de localhost: no se aplica en `test` ni en
   `production` y no debe usarse en un entorno compartido.

### Limitaciones conocidas

- **Catálogo, clientes, cotizaciones, mesa de ayuda, servicios, proyectos,
  inventario y configuración ya se sincronizan con la API.** Solo la bitácora de
  actividad visible y el respaldo JSON manual siguen viviendo en el navegador.
  El panel fusiona los datos remotos sobre el respaldo local y cae a ese respaldo
  si la API no responde; el aviso del shell indica cuál fuente está activa.
- En este entorno **no había PostgreSQL ni Docker**, por lo que la migración, el
  seed y las operaciones contra una base real no se ejecutaron aquí. Las Etapas 2
  a 8 se verificaron en navegador contra una API de contrato en memoria con las
  mismas rutas y formatos, y con pruebas unitarias de los servicios de catálogo,
  comercial, mesa de ayuda, métricas, servicios, proyectos, inventario y
  configuración. La Etapa 9 se verificó contra un stub en memoria que simula
  TOTP, el código por correo, los códigos de recuperación y el enfriamiento de
  reenvío; **falta repetir 2FA contra PostgreSQL y SMTP reales** (entrega de
  correo incluida).
- La tabla `client_contacts` existe en el esquema, pero la captura de contactos
  secundarios por cliente aún no tiene interfaz ni endpoints propios.
- La sesión de navegación automatizada corre con la pestaña oculta
  (`document.hidden`), y Chrome limita los temporizadores de las pestañas ocultas.
  Las páginas de tienda que usan `Suspense` + `useSearchParams` se abrieron con
  navegación interna; no se trata de un fallo del producto.
- Pendiente: refresh automático de sesión desde el panel, recuperación de
  contraseña, auditoría en `audit_logs`, bloqueo por intentos fallidos y pruebas
  de integración con PostgreSQL.
- `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `TWO_FACTOR_SECRET`,
  `API_INTERNAL_URL` y `HELPDESK_API_URL` deben permanecer solo en el servidor;
  nunca en variables `NEXT_PUBLIC_*`. `TWO_FACTOR_SECRET` debe ser distinto de
  los secretos JWT y de al menos 32 caracteres. La tienda lee el catálogo
  mediante un proxy interno (`/api/catalog/...`), no con una URL privada en el
  navegador.

## Etapa 0 — cambios aplicados

- Esquema Prisma consolidado con RBAC, CRM, cotizaciones, mesa de ayuda,
  proyectos, notificaciones, auditoría, configuración y medios.
- Migración base + `migration_lock.toml` y cliente Prisma generado.
- Seed idempotente de roles, permisos, superadmin, settings y secuencias.
- Tipos de dominio unificados en `packages/contracts` (namespace `admin`).
- Eliminadas las carpetas duplicadas `apps/api/src/modules` y
  `apps/api/src/shared` (sin importaciones).
- Typecheck limpio en web, admin y API; alineación de Prisma CLI/cliente a 5.22.
- Pruebas de API ejecutables con `supertest` + Vitest (`pnpm test`).
- CI en `.github/workflows/ci.yml`: instalación, contracts, validación/generación
  de Prisma, typecheck y tests.
- Puerto de la API estandarizado en **4000**; `.env.example`, `docker-compose.yml`,
  README y SETUP actualizados; `HELPDESK_API_URL`/`HELPDESK_ADMIN_KEY` añadidos a
  los contenedores de admin y web.

## Etapa 1 — cambios aplicados

- Servicio de autenticación real con `AuthRepository` inyectable, bcrypt (costo
  12), login genérico, rotación de tokens y validación de cuentas activas.
- Repositorio Prisma (`prisma-auth.repository.ts`) que carga rol y permisos.
- Middleware `authenticate` asíncrono con verificación en base de datos y
  `requirePermission`; rutas de productos, pedidos, cotizaciones y mesa de ayuda
  migradas a permisos.
- Eliminados `requireAdminKey`, `ADMIN_API_KEY`, `HELPDESK_ADMIN_KEY` y los
  avisos asociados; Docker Compose actualizado con `API_INTERNAL_URL`.
- Panel: `/login`, Route Handlers de login/logout, cookies `httpOnly`, layout
  `(panel)` con sesión verificada, shell con usuario y rol reales y cierre de
  sesión funcional.
- Proxy de mesa de ayuda autenticado mediante Bearer; ya no usa una clave
  compartida.
- Pruebas: 13 casos de autenticación (servicio con repositorio falso y guardas
  HTTP) más las pruebas existentes; 16/16 en verde.

## Etapa 2 — cambios aplicados

- **API de catálogo con Prisma**: `catalog.repository.ts` (interfaz),
  `prisma-catalog.repository.ts` (implementación) y `catalog.service.ts`.
  Productos, categorías de tres niveles y marcas se leen y escriben en
  PostgreSQL; las imágenes y especificaciones se guardan en tablas relacionadas.
- **Endpoints** `GET/POST/PUT/DELETE /products`, `/categories` y `/brands`.
  Las lecturas públicas solo devuelven productos `PUBLISHED` y nodos activos;
  `?scope=admin` exige sesión y permisos `*.view`. Las escrituras exigen
  `products.create/update/delete`, `categories.*` o `brands.*`.
- **Eliminar un producto lo archiva** (`ARCHIVED`) en lugar de borrar historial;
  categorías y marcas con productos o hijos vinculados no se pueden eliminar.
- **Panel**: proxy autenticado `/api/catalog/[...path]` que reenvía el Bearer del
  servidor; `lib/services/catalog.ts`; `AdminProvider` carga el catálogo remoto,
  lo fusiona sobre el respaldo local y sincroniza altas, ediciones, duplicados,
  estados, movimientos de stock, categorías y marcas. Si la API falla, muestra
  un aviso y mantiene el respaldo local.
- **Tienda**: `lib/catalog-api.ts` y proxy `/api/catalog/[...path]`; el listado y
  el detalle muestran los productos publicados de la API y conservan el catálogo
  estático como respaldo cuando la API no está disponible.
- **Pruebas**: 24/24 en verde, incluidos casos del servicio de catálogo con un
  repositorio falso (jerarquía, marca automática, slug único, actualización
  parcial, borrados bloqueados y filtrado de categorías inactivas).
- **Verificado en navegador** contra una API de contrato: iniciar sesión, editar
  un producto del catálogo remoto, guardar, recargar la tienda y ver el cambio.
  Queda pendiente repetir la prueba contra PostgreSQL real.

## Etapa 3 — cambios aplicados

- **Repositorio y servicio comercial en la API**: `commercial.repository.ts`,
  `prisma-commercial.repository.ts` y `commercial.service.ts` gestionan clientes y
  cotizaciones, con historial de estados, correlativos desde
  `document_sequences` y totales calculados (subtotal neto, IGV 18 % y total).
- **Endpoints** `GET/POST/PUT/DELETE /clients`, `GET/POST/PUT/DELETE /quotes`,
  `PATCH /quotes/:id/status` y `POST /quotes/public`. Las lecturas y escrituras
  internas exigen `clients.*` / `quotes.*`; la solicitud pública no requiere
  sesión, pero valida el cuerpo y limita la cantidad de ítems.
- **Solicitud pública**: crea o reutiliza el cliente por correo/documento, genera
  la cotización en estado `NEW`, deja los precios en cero para que ventas los
  complete y descarta identificadores de producto que no sean UUID para no romper
  la clave foránea.
- **Panel**: proxy `/api/commercial/[...path]`, `lib/services/commercial.ts` y
  sincronización en `AdminProvider` (optimista, con fusión sobre el respaldo
  local). Antes de guardar una cotización se asegura el cliente en la API; el
  código correlativo generado por el servidor reemplaza al provisional en la UI.
- **Tienda**: `quote-page.tsx` envía la solicitud a `/api/cotizacion`; la ruta
  valida nombre, correo, teléfono, documento e ítems, reenvía a la API con
  timeout de 15 s y muestra el código devuelto por el servidor. Los errores de
  validación o conexión se muestran sobre el botón de envío.
- **Pruebas**: 34/34 en verde, incluidas 10 pruebas del servicio comercial con
  repositorio falso (correlativos, transiciones de estado, cliente nuevo,
  reutilización por correo, precios en cero y filtrado de productos inexistentes).
- **Verificado en navegador** contra la API de contrato:
  - Alta de cotización desde el panel → `COT-00001` persistida.
  - Edición de observaciones, guardado y recarga → el cambio se conserva.
  - Envío desde la tienda con un producto del catálogo → `COT-00002` con estado
    `Nueva` y su cliente visibles en el panel tras recargar.
  - Queda pendiente repetir ambas pruebas contra PostgreSQL real.

## Etapa 4 — cambios aplicados

- **Repositorio y servicio de mesa de ayuda**: `helpdesk.repository.ts`,
  `prisma-helpdesk.repository.ts` y un `HelpdeskService` con repositorio
  inyectable. La consulta y su bitácora viven en `service_requests` y
  `service_request_activities`; ya no se usa el archivo `data/helpdesk.json`.
- **Correlativo y vínculos**: `nextTicketSequence()` usa `document_sequences`
  (`SOL`, 5 dígitos) en una transacción `Serializable`. Al registrar una consulta
  se busca el cliente por correo (sin distinguir mayúsculas); al asociar una
  cotización por código se valida que exista y se hereda su cliente. La API
  devuelve `clientId` y `quoteId` además de `quoteCode`.
- **Seguimiento persistente**: los cambios de estado, las notas internas y las
  respuestas quedan como actividades (`STATUS`, `NOTE`, `REPLY`). Una respuesta
  entregada marca `repliedAt`/`resolvedAt` y el estado `ATTENDED`; si el correo no
  se envía, la respuesta se registra sin cambiar el estado.
- **Endpoints**: se conservan `GET/POST /helpdesk`, `PATCH/DELETE /helpdesk/:id`,
  `POST /helpdesk/:id/reply` y el público `POST /contact`, con los mismos permisos
  `requests.*`. El formulario de la tienda sigue creando la consulta y disparando
  la notificación por correo.
- **Panel**: `mapTicket` prioriza `clientId`/`quoteId` del API y cae al cruce por
  `quoteCode` con las cotizaciones cargadas. El detalle de la consulta muestra el
  cliente y la cotización vinculados, la última respuesta y el botón
  “Ver cotización”.
- **Configuración**: se eliminó `HELPDESK_DATA_DIR` de `env.ts`, `vitest.config.ts`,
  los `.env.example` y `docker-compose.yml`, junto con el volumen `/app/data`.
- **Pruebas**: 40/40 en verde en 5 archivos, con 6 casos nuevos del servicio de
  mesa de ayuda (correlativo, vínculo por correo, validaciones, cotización por
  código, respuesta entregada/no entregada y borrado).
- **Verificado en navegador** contra una API de contrato en memoria:
  - Envío desde `/contacto` → `SOL-00002` aparece en la mesa de ayuda con sus
    datos y canal “Formulario web”.
  - Cambio a “En revisión” y nota interna → guardados en la API y conservados tras
    recargar el panel.
  - Respuesta por correo → estado “Atendida”, última respuesta y fecha visibles.
  - “Convertir en cotización” → crea el cliente y `COT-00001`, vincula la consulta
    y, tras recargar, el detalle muestra “Vinculado / COT-00001”.
  - Queda pendiente repetir el flujo contra PostgreSQL real.

## Etapa 5 — cambios aplicados

- **Contratos**: `packages/contracts/src/admin.ts` define `DashboardSummary`,
  `SalesReport` y `HelpdeskReport`, con conteos por estado/canal, montos separados
  por moneda (`PEN`/`USD`), rangos de fechas y rankings de clientes y productos.
- **Métricas en la API**: `dashboard.repository.ts` (interfaz),
  `prisma-dashboard.repository.ts` (consultas con Prisma) y `dashboard.service.ts`
  (agregaciones). El resumen calcula catálogo, clientes, cotizaciones y
  solicitudes; la conversión es `aprobadas / decididas`
  (`approved + rejected + expired`). Las fechas se resuelven en UTC y los rangos
  son inclusivos.
- **Endpoints** bajo `/api/v1/dashboard`, protegidos con sesión:
  `GET /summary` (`dashboard.view`), `GET /reports/sales` y
  `GET /reports/helpdesk` (`reports.view`). Los reportes aceptan `from` y `to` en
  formato `AAAA-MM-DD`; sin parámetros usan los últimos 30 días. Un rango
  invertido responde 400 y un formato inválido 422.
- **Permisos**: se añadió el módulo `reports` con `reports.view` al seed y se
  asignó a los roles `ventas` y `soporte` (superadmin y admin lo heredan;
  `consulta` lo recibe por sus permisos de lectura).
- **Proxy del panel**: `apps/admin/src/app/api/dashboard/[...path]` solo acepta
  `GET`, valida los segmentos (`summary` o `reports/{sales|helpdesk}`), inyecta el
  token en el servidor y conserva estado y tipo de respuesta.
- **Resumen del panel**: las tarjetas de cotizaciones, conversión, solicitudes y
  clientes, además de las listas “Últimas cotizaciones” y “Últimas solicitudes”,
  se alimentan de `GET /dashboard/summary`. El bloque de catálogo superior sigue
  leyendo el respaldo local del navegador.
- **Vista `/reportes`**: rango de fechas con reinicio a “Últimos 30 días”, KPIs de
  ventas y mesa de ayuda, tablas por mes, estado, canal, principales clientes y
  productos más cotizados. Los montos se muestran en columnas separadas PEN y USD.
  Exportación CSV con BOM UTF-8 para ventas y mesa de ayuda.
- **Pruebas**: 46/46 en verde en 6 archivos, con 6 casos nuevos de dashboard
  (resumen completo y vacío, agregación de ventas, rango por defecto, rango
  invertido y reporte de mesa de ayuda).
- **Verificado en navegador** contra una API de contrato en memoria:
  - Resumen con 7 cotizaciones, 60% de conversión, 5 solicitudes y 3 clientes;
    listas recientes con códigos, estados, fechas y montos correctos.
  - `/reportes` con el rango por defecto (30 días): 6 cotizaciones, 75% de
    conversión y 66.67% de atención; al ampliar a 65 días se incorporan la
    cotización vencida y la solicitud descartada de septiembre.
  - Columnas PEN/USD correctas en clientes y productos (por ejemplo, un cliente
    solo en USD ya no aparece como `S/ 0.00` sin alternativa).
  - Exportación CSV con el rango y totales vigentes; los datos se conservan tras
    recargar la página.
  - Queda pendiente repetir la verificación contra PostgreSQL real.

## Etapa 6 — cambios aplicados

- **Contratos**: `packages/contracts/src/admin.ts` define `ServiceOffering`,
  `ServiceOfferingInput`, `ServiceOfferingCategory` (`Soporte TI`,
  `Infraestructura TI`, `Desarrollo de software`), `ServiceOfferingStatus`
  (`draft`, `published`, `archived`), alcances, preguntas frecuentes e imagen
  destacada.
- **Modelo de datos**: `database/schema.prisma` añade los enums `ServiceCategory`
  y `ServiceStatus` y la tabla `service_offerings` (slug único, `includes` y `faq`
  en JSON, `related` como arreglo de slugs, índice por estado/categoría/orden).
  La migración vive en
  `database/migrations/20261104210000_service_offerings/migration.sql`.
- **API de servicios**: `service-offering.repository.ts`,
  `prisma-service-offering.repository.ts` y `ServiceOfferingService`. El servicio
  valida contenido, impide slugs duplicados (409), rechaza relaciones consigo
  mismo o hacia slugs inexistentes (400), exige al menos un alcance antes de
  publicar y reserva los cambios de estado/publicación para `services.publish`.
- **Endpoints**: públicos `GET /services/public` y `GET /services/public/:slug`
  (solo publicados; el detalle responde 404 si está en borrador o archivado).
  Administrativos `GET/POST /services`, `GET/PUT/DELETE /services/:id` y
  `PATCH /services/:id/status`, protegidos con `services.view/create/update/delete`
  y `services.publish`.
- **Permisos**: el seed incorpora el módulo `services` con
  `view/create/update/delete/publish`; los roles `ventas` y `soporte` reciben
  `services.view`.
- **Panel**: proxy opcional `/api/services/[[...path]]` que valida segmentos e
  inyecta el token en el servidor. `/servicios` lista el catálogo con búsqueda,
  filtros por categoría/estado, conteos y acciones de ver, editar,
  publicar/despublicar y eliminar. El editor (`/servicios/nuevo` y
  `/servicios/[id]/editar`) cubre identidad, slug automático, imagen, alcances,
  preguntas frecuentes, servicios relacionados, orden y estado; el enlace a la
  tienda se calcula según la categoría.
- **Tienda**: `apps/web/src/lib/service-offerings.ts` consulta
  `GET /services/public` con `revalidate: 60` y timeout de 2,5 s. Los servicios
  publicados se fusionan con las definiciones estáticas: reemplazan el contenido
  del mismo slug y añaden páginas nuevas; si la API no responde, la tienda sigue
  funcionando con las páginas estáticas. Los servicios de "Desarrollo de
  software" se publican en `/sistemas/[slug]`; el resto en `/servicios/[slug]`.
  También se actualizaron las portadas `/sistemas` e `/infraestructura-ti`, el
  sitemap, la búsqueda del sitio y los servicios relacionados.
- **Pruebas**: 62/62 en verde en 7 archivos, con 16 casos nuevos del servicio de
  servicios TI (normalización, permisos de publicación, slugs duplicados,
  relaciones inválidas, cambios de estado, borrado lógico del catálogo público y
  404 de borradores).
- **Verificado en navegador** contra una API de contrato en memoria:
  - Alta de "Monitoreo de infraestructura" con alcance, FAQ, relación con
    "Redes empresariales" y estado Publicado; aparece en el listado tras recargar.
  - Edición del título a "Monitoreo de infraestructura 24/7", guardado y recarga
    → el cambio se conserva y el slug no se altera.
  - Publicación de un borrador desde la fila y eliminación con confirmación,
    ambas conservadas tras recargar el panel.
  - Tienda: `/servicios/soporte-remoto` muestra el contenido publicado en la API
    en lugar del estático; `/servicios/monitoreo-de-infraestructura` y
    `/sistemas/sistema-de-ventas` renderizan páginas nuevas creadas en el panel;
    los relacionados enlazan a la ruta correcta según la categoría.
  - Queda pendiente repetir la verificación contra PostgreSQL real.

## Etapa 7 — cambios aplicados

- **Contratos**: `packages/contracts/src/admin.ts` amplía `WebProjectType` con
  `software` para alinear el panel con el enum `SOFTWARE` que ya existía en
  Prisma; las etiquetas se actualizan en `lib/admin/format.ts`.
- **Modelo de datos**: `database/schema.prisma` añade `responsibleName` (texto
  libre) al modelo `Project`, porque el panel captura el responsable como nombre
  y `responsibleId` es una clave foránea a `users`. La migración vive en
  `database/migrations/20261104230000_project_responsible/migration.sql`.
- **API de proyectos**: `project.repository.ts` (interfaz),
  `prisma-project.repository.ts` (consultas y transacciones) y `ProjectService`.
  El servicio normaliza el payload, exige un nombre de al menos dos caracteres,
  valida URLs de producción/staging/repositorio, acepta solo `clientId` con
  formato UUID y comprueba que el cliente exista (400 si no). El registro de un
  despliegue exige URL válida, usa `production` por defecto y, en una transacción,
  actualiza la URL de producción o staging del proyecto.
- **Endpoints** bajo `/api/v1/projects`: `GET /` con filtros `q`/`status`/`type`,
  `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` y
  `POST /:id/deployments`, protegidos con `projects.view/create/update/delete` y
  `projects.manage-deployments`. Los despliegues se devuelven del más reciente al
  más antiguo.
- **Panel**: proxy opcional `/api/projects/[[...path]]` que valida segmentos e
  inyecta el token en el servidor. `lib/services/projects.ts` expone el cliente y
  las operaciones `saveProject`/`ensureProject`: los proyectos de ejemplo con id
  de slug se promueven a la API (alta) antes de editarlos o desplegarlos, y una
  edición con id remoto se guarda con `PUT` (con alta de respaldo si la API
  responde 404). El `clientId` solo se envía cuando es un UUID, porque los
  clientes del respaldo local usan slugs.
- **Sincronización**: `AdminProvider` incorpora `projectsSource`,
  `projectsError` y `refreshProjects`; las altas, ediciones, despliegues y
  borrados son optimistas y se reconcilian con la API. Si una operación falla, la
  fila se restaura o se informa con un aviso y el botón “Reintentar” en
  `/proyectos`.
- **Pruebas**: 77/77 en verde en 8 archivos, con 15 casos nuevos del servicio de
  proyectos (filtros, normalización, nombre corto, URLs inválidas, cliente no
  UUID o inexistente, actualización parcial, limpieza de fecha, 404 de
  actualización/borrado, URL de despliegue obligatoria, despliegue exitoso y
  actualización de la URL del proyecto).
- **Verificado en navegador** contra la API de contrato en memoria:
  - Alta de “Monitoreo de sedes” con cliente, URLs, hosting, dominio,
    responsable y referencia de credenciales; persistió tras recargar.
  - Edición a “Monitoreo de sedes y red”, guardado y recarga → el nombre se
    conserva.
  - Registro de un despliegue de producción (`v0.1.0`) → aparece en el historial
    y como último despliegue; se conserva tras recargar.
  - Eliminación con confirmación → desaparece del listado y no reaparece tras
    recargar; consola sin errores.
  - Queda pendiente repetir la verificación contra PostgreSQL real.

## Etapa 8 — cambios aplicados

- **Modelo de datos reutilizado**: no hizo falta una migración nueva.
  `InventoryMovement` (`inventory_movements`) y `Setting` (`settings`, clave
  única) ya existían en la migración base. La configuración se guarda como JSON
  bajo la clave `store`, que el seed inicializa con los datos de la tienda.
- **API de configuración**: `settings.repository.ts`,
  `prisma-settings.repository.ts` y `SettingsService`. `GET` combina la fila
  guardada con los valores por defecto; `PUT` normaliza los textos y valida
  nombre comercial, correo, RUC de 11 dígitos, IGV entre 0 y 100 y umbral de
  stock entero mayor o igual a 0. La escritura usa `upsert`. Endpoints
  `GET/PUT /api/v1/settings` con permisos `settings.view` y `settings.update`.
- **API de inventario**: `inventory.repository.ts`,
  `prisma-inventory.repository.ts`, `InventoryService` y su controlador.
  `GET /api/v1/inventory/movements` admite filtros `q`, `type`, `productId` y
  `limit` (máximo 500) con permiso `inventory.view`. `POST` exige
  `inventory.manage`, valida el UUID del producto, el tipo (`in`/`out`/
  `adjustment`), las cantidades y el motivo. En una transacción actualiza el
  stock del producto y crea el movimiento con instantáneas de nombre y SKU.
  Bloquea salidas sin stock (400 con las unidades disponibles) y ajustes que no
  cambian el stock; registra el `actorId` del usuario autenticado.
- **Permisos**: el seed ya declaraba `inventory.view/manage` y
  `settings.view/update`. Ventas y soporte reciben `inventory.view` (ventas
  también `settings.view`); la gestión de inventario y la actualización de
  configuración quedan en `admin` y `superadmin`.
- **Proxy y clientes del panel**: `/api/inventory/[[...path]]` y `/api/settings`
  reenvían el Bearer desde el servidor y validan la ruta; `lib/services/inventory.ts`
  y `lib/services/settings.ts` adaptan los contratos y errores.
- **Sincronización**: `AdminProvider` incorpora `inventorySource`,
  `inventoryError`, `refreshInventory`, `settingsSource`, `settingsError` y
  `refreshSettings`, carga ambos módulos al hidratar y expone reintento. El
  registro de movimientos es optimista: primero persiste el producto con su
  stock original (`saveProduct`, que promueve los productos de ejemplo con id de
  slug a la API), luego crea el movimiento y reconcilia stock e identificador con
  la respuesta. Si algo falla, restaura el stock local, retira el movimiento
  provisional y muestra el error. La configuración también es optimista y se
  revierte si la API rechaza el cambio.
- **Interfaz**: `/inventario` muestra un aviso ámbar con “Reintentar” cuando el
  historial no está sincronizado y el modal deshabilita el envío mientras
  registra. `/configuracion` guarda contra la API, revierte el formulario ante un
  error y deshabilita el botón durante la petición. Los textos pasan de
  “almacenamiento local” a “caché local / persistencia centralizada” y la tarjeta
  de seguridad refleja la sesión y los permisos reales.
- **Pruebas**: 99/99 en verde en 10 archivos, con 11 casos de configuración
  (valores por defecto, fusión parcial, normalización, validaciones y moneda) y
  11 de inventario (filtros, UUID, tipo, cantidades, 404, stock insuficiente,
  ajuste sin cambio y entradas/salidas/ajustes con actualización de stock).
- **Verificado en navegador** contra la API de contrato en memoria:
  - Configuración: cambio a USD, IGV 19 y umbral 7 → guardado, visible en
    `GET /settings` y conservado tras recargar; se restauró a PEN/18/5.
  - Inventario: entrada de Access Point (3 → 7), salida de Laptop HP Pavilion
    (12 → 10, promovida a producto con UUID) y ajuste de Router MikroTik
    (17 → 20); el historial queda con 4 movimientos y se conserva tras recargar.
  - Fallos: con la API detenida, guardar configuración muestra el aviso, revierte
    el valor y ofrece “Reintentar”; registrar un movimiento muestra el error en
    el modal y no altera el stock. Al restablecer la API, “Reintentar” limpia
    ambos avisos.
  - Queda pendiente repetir la verificación contra PostgreSQL real.

## Etapa 9 — cambios aplicados

- **Credenciales de desarrollo**: `/login` recibe desde el servidor el correo y
  la contraseña del seed solo cuando `NODE_ENV !== 'production'`
  (`apps/admin/src/app/login/page.tsx`) y muestra un bloque “Acceso de
  desarrollo” con un botón que rellena el formulario. En producción el bloque no
  se renderiza y las credenciales no se envían al navegador.
- **Modelo de datos**: `database/schema.prisma` añade el enum `TwoFactorMethod`
  (`TOTP`, `EMAIL`), las columnas de 2FA en `User` y las tablas
  `two_factor_recovery_codes` y `two_factor_challenges`. La migración vive en
  `database/migrations/20261104234500_two_factor_auth/migration.sql`.
- **Utilidades criptográficas**: `apps/api/src/utils/two-factor.ts` cifra el
  secreto TOTP con AES-256-GCM, hashea códigos con HMAC-SHA256, genera códigos
  de recuperación y validaciones TOTP con `otplib` (tolerancia de un periodo de
  30 s) y produce el QR con `qrcode`.
- **Repositorio**: `two-factor.repository.ts` (interfaz) y
  `prisma-two-factor.repository.ts`, además de los métodos de 2FA en
  `auth.repository.ts` y `prisma-auth.repository.ts`. La verificación de
  credenciales ahora devuelve una sesión o un desafío.
- **Endpoints** bajo `/api/v1/auth`:
  - Públicos: `POST /2fa/verify` y `POST /2fa/resend` (usan el `challengeToken`
    del cuerpo; el reenvío solo aplica a `EMAIL` y respeta 30 s de enfriamiento).
  - Autenticados: `GET /2fa/status`, `POST /2fa/setup`, `POST /2fa/enable`,
    `POST /2fa/disable` y `POST /2fa/recovery-codes`. Desactivar y regenerar
    exigen la contraseña actual.
  - `POST /login` responde `{ twoFactorRequired, method, challengeToken,
    expiresAt, email }` cuando la cuenta tiene 2FA activa.
- **Desafío**: JWT de alcance `2fa` firmado con `TWO_FACTOR_SECRET`, vigencia de
  10 minutos. Los códigos por correo vencen a los 10 minutos, admiten 5 intentos
  y se invalidan al consumirse o reenviarse. Los códigos de recuperación son 10,
  de un solo uso, y el correo del desafío se muestra enmascarado.
- **BFF del panel**: `apps/admin/src/app/api/auth/login/route.ts` guarda el
  desafío en la cookie `fj_admin_2fa`; `.../2fa/verify/route.ts` crea la sesión y
  borra esa cookie; `.../2fa/resend/route.ts` reenvía el código; y
  `.../2fa/[[...path]]/route.ts` expone `status`, `setup`, `enable`, `disable` y
  `recovery-codes` con el Bearer del servidor.
- **Interfaz**: `/login` pasa a dos pasos (credenciales → código), con reenvío
  con cuenta regresiva, alternancia a código de recuperación y mensajes de error.
  `/configuracion` incorpora la tarjeta “Seguridad de la cuenta” con estado,
  método, fecha de activación, códigos restantes, alta TOTP (QR y clave manual),
  alta por correo, regeneración y desactivación.
- **Pruebas**: `apps/api/tests/two-factor.test.ts` añade 7 casos (desafío por
  correo, límite de intentos, reenvío con enfriamiento, recuperación de un solo
  uso, activación TOTP/EMAIL y rechazo de códigos inválidos). Total: **106/106**
  en verde y typecheck limpio en admin, web y API.
- **Verificado en navegador** contra un stub de API en memoria:
  - El bloque de credenciales de desarrollo rellena el formulario y el login sin
    2FA entra al panel.
  - TOTP: QR y clave manual, activación con código, 10 códigos de recuperación,
    regeneración con contraseña, desafío al iniciar sesión, rechazo de repetición
    del mismo código, acceso con código de recuperación (queda en 9) y
    desactivación con contraseña.
  - EMAIL: activación con código, estado “Código por correo electrónico”,
    desafío con correo enmascarado, error ante código inválido, reenvío
    habilitado solo tras 30 s con aviso de entrega no confirmada y login con el
    código válido.
  - Queda pendiente repetir TOTP, correo y recuperación contra PostgreSQL y SMTP
    reales.

## Próximos pasos

1. Ejecutar migración y seed en un PostgreSQL real y repetir la verificación de
   catálogo, clientes, cotizaciones, mesa de ayuda, reportes, servicios de TI,
   proyectos web, inventario, configuración y 2FA de punta a punta (incluido en
   Docker y con SMTP real para el código por correo).
2. Importador de los respaldos JSON locales que resuelva nombres a IDs.
3. Refresh automático de sesión, recuperación de contraseña y bloqueo por
   intentos fallidos de contraseña (el código 2FA ya limita a 5 intentos).
4. Añadir pruebas de integración contra una base PostgreSQL de prueba.
5. Interfaz y endpoints para contactos secundarios (`client_contacts`).
6. Conectar las tarjetas de catálogo del resumen a `summary.catalog` y retirar los
   conteos locales cuando la API esté disponible.
