# StackBook v1

StackBook es una app local para guardar, organizar, buscar y reutilizar templates/snippets de codigo. Esta version esta pensada como una biblioteca personal: separa los recursos por lenguaje, categoria y subcategoria, permite guardar uno o mas archivos por template y expone endpoints utiles para consumo desde la interfaz y desde un asistente externo como Syn.

## Estado actual

La v1 permite:

- Crear templates con nombre, descripcion, lenguaje, categoria, subcategoria, tags y archivos de codigo.
- Explorar templates por carpetas:
  - Lenguaje
  - Categoria
  - Subcategoria
- Ver badges con la cantidad de templates por carpeta.
- Buscar templates por texto desde la interfaz.
- Ver el detalle de un template y copiar el contenido del archivo activo.
- Editar templates completos.
- Eliminar templates.
- Mover templates entre carpetas desde el detalle del template.
- Alternar tema claro/oscuro.
- Buscar snippets por texto libre para uso externo/local mediante `/api/snippets/buscar`.

## Stack

Backend:

- Node.js
- Express
- TypeORM
- PostgreSQL
- Joi

Frontend:

- React
- Vite
- React Router
- Axios
- SweetAlert2

## Estructura

```text
StackBook/
  backend/
    src/
      config/
      controllers/
      entity/
      handlers/
      routes/
      services/
      validations/
  frontend/
    src/
      components/
      hooks/
      pages/
      services/
      styles/
      utils/
```

## Requisitos

- Node.js instalado.
- PostgreSQL corriendo localmente o accesible desde la maquina.
- Base de datos creada para StackBook.

## Variables de entorno

El backend lee `backend/.env`.

Ejemplo:

```env
PORT=3000
HOST=localhost
DB_USERNAME=postgres
PASSWORD=tu_password
DATABASE=stackbook
DB_PORT=5432
```

Nota: TypeORM esta configurado con `synchronize: true`, por lo que crea/actualiza tablas automaticamente durante el desarrollo.

## Instalacion

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

## Ejecutar en desarrollo

Backend:

```bash
cd backend
npm run dev
```

API:

```text
http://localhost:3000/api
```

Frontend:

```bash
cd frontend
npm run dev
```

App:

```text
http://localhost:5173
```

## Scripts disponibles

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Modelo de datos principal

`Template`

- `id`
- `nombre`
- `descripcion`
- `lenguaje`
- `categoria`
- `subcategoria`
- `tags`
- `createdAt`
- `updatedAt`
- `templateFiles`

`TemplateFile`

- `id`
- `fileName`
- `content`
- `type`
- `template`

## Endpoints principales

Templates:

```http
POST /api/templates
GET /api/templates
GET /api/templates/search?q=texto
GET /api/templates/counts
GET /api/templates/:id
GET /api/templates/:id/files
PATCH /api/templates/:id
PATCH /api/templates/:id/move
DELETE /api/templates/:id
```

Snippets para Syn:

```http
GET /api/snippets/buscar?q=texto
```

Respuesta cuando encuentra:

```json
{
  "encontrado": true,
  "titulo": "Configuracion del Nodemailer",
  "codigo": "import nodemailer from \"nodemailer\";",
  "lenguaje": "JavaScript"
}
```

Respuesta cuando no encuentra:

```json
{
  "encontrado": false
}
```

## Mover templates

Desde el detalle del template existe la accion `Mover`. Permite cambiar:

- Lenguaje
- Categoria
- Subcategoria

Tambien se puede usar por API:

```http
PATCH /api/templates/:id/move
```

Body:

```json
{
  "lenguaje": "JavaScript",
  "categoria": "Backend",
  "subcategoria": "services"
}
```

## Notas de v1

- La app esta pensada para uso personal/local.
- No hay autenticacion en esta version.
- La busqueda de snippets devuelve el primer resultado compatible.
- Los ids de PostgreSQL no se reinician al borrar registros; es normal tener dos templates y que el ultimo id sea, por ejemplo, `6`.
- El filtrado de carpetas es case-insensitive para tolerar datos creados antes de normalizar nombres.

## Verificacion usada durante desarrollo

Frontend:

```bash
npm run lint
npm run build
```

Backend:

```bash
node --check src/services/template.service.js
node --check src/controllers/template.controller.js
node --check src/routes/template.routes.js
node --check src/validations/template.validation.js
```
