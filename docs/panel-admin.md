# Panel administrativo FJ Systems

Documento de arquitectura y estado del panel. Las **Etapas 0 (fundaciones)**,
**1 (autenticación real)**, **2 (catálogo persistente)**, **3 (clientes y
cotizaciones persistentes)** y **4 (CRM y mesa de ayuda persistente)** quedaron
implementadas el 2026-11-04. El acceso requiere una cuenta activa validada contra
PostgreSQL; catálogo, clientes, cotizaciones y mesa de ayuda se sincronizan con
la API. Proyectos, inventario manual y configuración siguen siendo *local-first*
(`localStorage`) hasta las siguientes etapas.

## Estado actual

- App: `apps/admin` (Next.js App Router, TypeScript, Tailwind).
- Autenticación: pantalla `/login`, Route Handlers `/api/auth/login` y
  `/api/auth/logout`, cookie de sesión `httpOnly` emitida por el servidor Next.
- Protección: el grupo de rutas `(panel)` verifica la sesión contra
  `GET /api/v1/auth/me` antes de renderizar; sin sesión redirige a `/login`.
- Persistencia: `AdminProvider` fusiona el catálogo (`/api/catalog/...`) y los
  datos comerciales (`/api/commercial/...`) de la API sobre el respaldo
  `localStorage` con la clave `fj-systems-admin-v1`. Si la API falla, el panel
  avisa y mantiene el respaldo.
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
lib/services/               Clientes de API (catálogo y comercial) y adaptador local
lib/validations/            Esquemas de validación compartidos
lib/auth/session.ts         Cookie, verificación de sesión y URL interna (servidor)
lib/auth/types.ts           Tipo `SessionUser` compartido con el shell
app/api/catalog/            Proxy autenticado del catálogo (servidor)
app/api/commercial/         Proxy autenticado de clientes y cotizaciones (servidor)
app/api/helpdesk/           Proxy autenticado de la mesa de ayuda (servidor)
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
| Seguridad | `roles`, `permissions`, `role_permissions`, `users` |
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

### Limitaciones conocidas

- **Catálogo, clientes, cotizaciones y mesa de ayuda ya se sincronizan con la
  API; inventario manual, proyectos y configuración siguen en `localStorage`.**
  El panel fusiona los datos remotos sobre el respaldo local y cae a ese respaldo
  si la API no responde; el aviso del shell indica cuál fuente está activa.
- En este entorno **no había PostgreSQL ni Docker**, por lo que la migración, el
  seed y las operaciones contra una base real no se ejecutaron aquí. Las Etapas 2,
  3 y 4 se verificaron en navegador contra una API de contrato en memoria con las
  mismas rutas y formatos, y con pruebas unitarias de los servicios de catálogo,
  comercial y mesa de ayuda.
- La tabla `client_contacts` existe en el esquema, pero la captura de contactos
  secundarios por cliente aún no tiene interfaz ni endpoints propios.
- La sesión de navegación automatizada corre con la pestaña oculta
  (`document.hidden`), y Chrome limita los temporizadores de las pestañas ocultas.
  Las páginas de tienda que usan `Suspense` + `useSearchParams` se abrieron con
  navegación interna; no se trata de un fallo del producto.
- Pendiente: refresh automático de sesión desde el panel, recuperación de
  contraseña, auditoría en `audit_logs`, bloqueo por intentos fallidos y pruebas
  de integración con PostgreSQL.
- `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `API_INTERNAL_URL` y
  `HELPDESK_API_URL` deben permanecer solo en el servidor; nunca en variables
  `NEXT_PUBLIC_*`. La tienda lee el catálogo mediante un proxy interno
  (`/api/catalog/...`), no con una URL privada en el navegador.

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

## Próximos pasos

1. Ejecutar migración y seed en un PostgreSQL real y repetir la verificación de
   catálogo, clientes, cotizaciones, mesa de ayuda, reportes y servicios de TI
   de punta a punta (incluido en Docker).
2. Importador de los respaldos JSON locales que resuelva nombres a IDs.
3. Refresh automático de sesión, recuperación de contraseña y bloqueo por
   intentos fallidos.
4. Añadir pruebas de integración contra una base PostgreSQL de prueba.
5. Interfaz y endpoints para contactos secundarios (`client_contacts`).
6. Conectar las tarjetas de catálogo del resumen a `summary.catalog` y retirar los
   conteos locales cuando la API esté disponible.
7. Continuar con la Etapa 7 (proyectos).
