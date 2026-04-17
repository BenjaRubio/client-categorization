# Client Categorization

Next.js + Prisma app para categorizar clientes a partir de transcripciones de reuniones de venta usando LLMs, con dashboards de métricas y ventas.

## Requisitos previos

- Node.js 20+
- Docker (para la base de datos local)
- Al menos una API key de LLM (Groq, OpenAI o Gemini)

## Correr en local

### 1. Levantar Postgres con Docker

```bash
docker compose up -d
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Editar `.env.local` y completar al menos una API key de LLM:

```env
DATABASE_URL="postgresql://dev:dev@localhost:5432/client_categorization?schema=public"
DIRECT_URL="postgresql://dev:dev@localhost:5432/client_categorization?schema=public"

GROQ_API_KEY=""    
OPENAI_API_KEY=""
GEMINI_API_KEY=""
```


### 3. Aplicar migraciones y cargar datos de ejemplo

```bash
npm run prisma:migrate:dev   # crea las tablas
npm run prisma:seed          # carga clientes, vendedores y reuniones de ejemplo
npm run classify:pendings    # categoriza las reuniones de ventas con llamada a LLM, también se puede hacer por UI
```

### 4. Arrancar el servidor de desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

---

## Scripts útiles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Build de producción |
| `npm run lint` | Linter ESLint |
| `npm run prisma:migrate:dev` | Crear y aplicar migraciones (lee `.env.local`) |
| `npm run prisma:migrate:deploy` | Aplicar migraciones sin crear nuevas (producción) |
| `npm run prisma:generate` | Regenerar Prisma Client tras cambiar el schema |
| `npm run prisma:seed` | Poblar la base de datos desde los CSV en `src/db/data/` |
| `npm run seed:if-empty` | Seed solo si la BD no tiene clientes |
| `npm run classify:pendings` | Clasificar reuniones sin categoría vía LLM (script CLI) |

---

## Arquitectura

Ver [ARQUITECTURA.md](./ARQUITECTURA.md) para una descripción detallada de la estructura del proyecto, el patrón de fallback de LLMs y las capas de acceso a datos.
