# AguaFix API

API para que los ciudadanos reporten fugas de agua en la via publica. Al crear un reporte,
se guarda en PostgreSQL y se envia un correo de aviso a la cuadrilla de mantenimiento
(usuarios `SYSTEM_USER` con `isNotificationEnabled = true`; si no hay ninguno, se usa
`MAINTENANCE_FALLBACK_EMAIL`).

## Stack

- NestJS 11 + TypeScript
- PostgreSQL + TypeORM (migraciones, `synchronize: false`)
- `env-var` + `dotenv` para variables de entorno (`src/config/envs.ts`)
- `bcryptjs` para hashear contraseñas
- `nodemailer` para el envio de correos
- `class-validator` / `class-transformer` para los DTOs

## Estructura

```
src/
  config/envs.ts            # variables de entorno
  db/
    data-source.ts          # DataSource de TypeORM
    migrations/              # migraciones
  auth/                      # AuthController: register / login
  users/                     # entidad SYSTEM_USER (cuadrilla de mantenimiento)
  reports/                   # entidad WATER_REPORT, ReportsController
    templates/report.template.ts
  email/                     # EmailService (nodemailer)
```

## Requisitos previos

- Node.js 20+
- Docker (para PostgreSQL)

## Configuracion

1. Copia el archivo de entorno de ejemplo:

   ```bash
   cp .env.example .env
   ```

2. Completa `.env` con tus credenciales de correo (si usas Gmail, `MAILER_PASS` debe ser
   un [App Password](https://myaccount.google.com/apppasswords), no la contraseña normal).

3. Instala dependencias:

   ```bash
   npm install
   ```

## Base de datos con Docker

```bash
docker compose up -d
```

Esto levanta un contenedor de PostgreSQL 16 en el puerto `5432` con los datos definidos en
`compose.yaml` (deben coincidir con las variables `DB_*` de tu `.env`).

## Migraciones

```bash
npm run migration:run
```

Crea las tablas `SYSTEM_USER` y `WATER_REPORT`. Para revertir la ultima migracion:

```bash
npm run migration:revert
```

## Levantar la API

```bash
npm run start:dev
```

La API queda disponible en `http://localhost:3000/api`.

## Endpoints

### Reportes

| Metodo | Ruta          | Descripcion                                    |
| ------ | ------------- | ----------------------------------------------- |
| POST   | `/reports`    | Crea un reporte y notifica a la cuadrilla       |
| GET    | `/reports`    | Lista todos los reportes                        |

`POST /reports` body (`CreateReportDto`):

```json
{
  "address": "Av. Siempre Viva 742",
  "description": "Fuga de agua en la tuberia principal frente a la casa",
  "severity": "high",
  "reporterPhone": "+50412345678"
}
```

`severity` solo acepta `low`, `medium` o `high`.

### Autenticacion

| Metodo | Ruta             | Descripcion                          |
| ------ | ---------------- | ------------------------------------- |
| POST   | `/auth/register`  | Registra un usuario (`CreateUserDto`) |
| POST   | `/auth/login`      | Login (`LoginDto`)                    |

`POST /auth/register` body:

```json
{
  "name": "Cuadrilla Central",
  "email": "cuadrilla@aguafix.local",
  "password": "secret123",
  "isNotificationEnabled": true
}
```

`POST /auth/login` body:

```json
{
  "email": "cuadrilla@aguafix.local",
  "password": "secret123"
}
```

Si las credenciales son invalidas, responde `400 Bad Request` con un mensaje claro.

## Probar con Bruno

La carpeta [`bruno/AguaFixAPI`](bruno/AguaFixAPI) trae una coleccion lista para importar en
Bruno, con el environment `Local` apuntando a `http://localhost:3000/api`.
