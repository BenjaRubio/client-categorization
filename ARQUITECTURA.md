# Arquitectura y decisiones claves

## Arquitectura

La aplicación consiste en una aplicación en NextJs con React 19, en TypeScript.Con una base de datos relacional con PostgreSQL y Prisma como ORM.
El deploy se hizo en Vercel por facilidad, rapidez, costo y compatibilidad con el Framework.
Para desarrollo local, la base de datos se montó en un contenedor de Docker. Para producción, se montó en Supabase.

## Visión general

Las principales responsabilidades son:

1. **Ventas** (`/ventas`) — tabla de reuniones de venta con filtros y clasificación individual o en lote vía LLM. Para visualizar fácilmente detalles de clientes, reuniones y cómo se categorizaron.
2. **Métricas** (`/metricas`) — dashboards de distribución y segmentación de clientes basados en las categorías clasificadas, pudiendo filtrar por estas mismas.
3. **Clasificación** — pipeline que recibe la transcripción de una reunión, llama a un LLM y persiste los campos categorizados en la base de datos.

---

## Estructura de directorios

Con esta estructurase busca modularizar bastante para aislar responsabilidades y facilitar el agregar más funcionalidades y la mantenibilidad.

```
src/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Landing / home
│   ├── ventas/
│   │   ├── page.tsx
│   │   ├── _components/        # Componentes de UI exclusivos de esta página
│   │   ├── _fetchers/          # Lecturas de servidor (Server Components)
│   │   └── _actions/           # Server Actions (escrituras y mutaciones)
│   └── metricas/
│       ├── page.tsx
│       ├── _components/
│       └── _fetchers/
│
├── services/                   # Lógica de negocio pura, sin dependencias de Next.js
│   ├── llm/                    # Capa de LLM (ver sección dedicada)
│   └── classification/         # Pipeline de clasificación de reuniones
│
├── db/
│   ├── prisma-client.ts        # Singleton de PrismaClient (patrón globalThis)
│   ├── prisma/
│   │   └── schema.prisma       # Modelos y enums de la base de datos
│   ├── repositories/           # Acceso a datos (una función por operación)
│   │   ├── sales-meeting.repository.ts
│   │   ├── meeting-category.repository.ts
│   │   ├── client.repository.ts
│   │   ├── salesman.repository.ts
│   │   └── index.ts            # Barrel con re-exports nombrados
│   └── seed/                   # Scripts de seed desde CSV
│
├── ui/                         # Componentes atómicos reutilizables
│   ├── filters/                # Filtros reutilizables entre páginas
│   └── index.ts                # Barrel export (@/ui)
│
├── lib/
│   └── enum-labels.ts          # Etiquetas en español para los 7 enums de Prisma
│
└── styles/
    ├── tokens.css              # Design tokens (colores, espaciado, tipografía)
    └── base.css                # Reset y estilos globales
```

---

## Convención por página: `_components` / `_fetchers` / `_actions`

Cada directorio de página sigue este patrón:

```
ventas/
├── page.tsx            ← Server Component orquestador; llama fetchers y pasa datos
├── _fetchers/          ← Solo lectura de BD; siempre server-only
│   └── get-meetings.fetcher.ts
└── _actions/           ← Server Actions; validan, llaman services y revalidan caché
    └── classify-meeting.action.ts
```

- Los **fetchers** no se importan desde componentes de cliente; los llama directamente el `page.tsx`.
- Las **actions** se marcan con `'use server'` y son el único punto de escritura por página.
- Los componentes en `_components/` pueden ser Client Components (`'use client'`) si necesitan estado o interactividad.

---

## Capa de LLM — patrón Chain of Responsibility con fallback

Se define el servicio con una estructura que permite agregar nuevos proveedores fácilmente, todos siguiendo la misma estructura para ser llamados con el mismo formato.

```
src/services/llm/
├── types.ts            # Interfaces: LLMProvider, LLMRequest, LLMResponse
├── registry.ts         # LLMRegistry: registra proveedores y ejecuta la cadena
├── index.ts            # Re-export de callLLM (función pública del módulo)
├── prompt-template.ts  # Carga y renderiza plantillas .md con frontmatter
└── providers/
    ├── groq.provider.ts
    ├── openai.provider.ts
    └── gemini.provider.ts
└── prompts/            # archivos .md de prompts en formato estándar para separar el mensaje del sistema y del usuario
```

El orden de registro (prioridad de qué modelo usar) está en `registry.ts`:

```ts
registry.register(new OpenAIProvider());  // 1º
registry.register(new GeminiProvider());  // 2º
registry.register(new GroqProvider());    // 3º
```

Un proveedor se activa o desactiva simplemente añadiendo o no su `API_KEY` en las variables de entorno.

Si la respuesta falla, o hay algún error en la estructura o valores de la respuesta, se gatilla un error y se repite la solicitud al siguiente modelo de la lista.

```

### Plantillas de prompt

Los prompts viven en `src/services/llm/prompts/*.md` con frontmatter YAML para los parámetros del modelo y secciones `# System` / `# User`. `PromptTemplate.render(variables)` sustituye `{{placeholder}}` con los valores concretos.

---

## Capa de acceso a datos

```
Server Component / Server Action
  │
  ├── _fetchers/*.fetcher.ts    → llaman a repositories (solo lectura)
  └── _actions/*.action.ts      → llaman a services o repositories (escritura)
                                   └── revalidatePath / revalidateTag
                                         └── Next.js invalida la caché del RSC

repositories/
  └── *.repository.ts           → funciones puras sobre PrismaClient
        └── prisma-client.ts    → singleton con patrón globalThis
```

### Singleton de Prisma

Para evitar que el hot-reload de Next.js cree múltiples conexiones, el cliente se guarda en `globalThis`:

```ts
// src/db/prisma-client.ts
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Repositorios

Cada fichero de repositorio exporta funciones nombradas. El barrel `repositories/index.ts` las agrupa en objetos con namespace para mayor claridad en los imports:

```ts
import { salesMeetingRepository, meetingCategoryRepository } from '@/db/repositories';
```

---

## Esquema de base de datos


| Modelo | Descripción |
|--------|-------------|
| `Client` | Datos de contacto del cliente |
| `Salesman` | Vendedor que realizó la reunión |
| `SalesMeeting` | Reunión: fecha, transcripción, cerrada o no |
| `MeetingCategory` | Categorización LLM 1-a-1 con `SalesMeeting` |

`MeetingCategory` almacena 7 campos enum clasificados por el LLM:

| Campo | Enum | Valores |
|-------|------|---------|
| `WeeklyVolume` | 0-100, 101-500, 501-2000, 2000+, undefined |
| `UseCase` | customer_service, scheduling, technical_support, ads, other |
| `Industry` | 19 sectores |
| `AwarenessChannel` | internet_search, networking, linkedin, … |
| `Seasonality` | constant, seasonal, undefined |
| `IntegrationLevel` | low, medium, high |
| `Urgency` | low, medium, high |

---

Dado que las categorizaciones se hacían a partir de transcripciones, estas están asociadas a las reuniones de ventas y no necesariamente con un cliente. Es decir, un cliente podría tener más de una reunión de ventas, con distintas transcripciones y estas reflejar distintas categorías ya que valores como la demanda, urgencia, caso de uso, pueden cambiar en el tiempo.

## Estilos

- **CSS Modules** por componente, sin Tailwind.
- Design tokens globales en `src/styles/tokens.css` (variables CSS: colores, espaciado, radios, tipografía).
- Base styles y reset en `src/styles/base.css`.
- Componentes de UI atómicos en `src/ui/` importables vía alias `@/ui`.

---

## Decisiones clave y métricas presentadas

Para todas las métricas se puedne aplicar filtros, ya sea por datos de vendedor o clientes, de la venta misma (cerrada o no) o las categorías definidas para cada transcripción.

### Matriz de segmentación

Cruza la dificultad o esfuerzo de la integración de la solicitud del cliente con la urgencia que este tiene, pudiendo así identificar "Easy win", "Cuentas estratégicas" o "No prioritarios" desde un punto de vista de negocio.

Además se considera el volumen de demanda declarado por el cliente, lo cual se puede asociar al nivel de facturación.
Hay un toggle que cambia si los colores muestra la estacionalidad de la demanda del cliente o si la venta se cerró o no.
La estacionalidad de su demanda, ya que aquellos que tienen períodos de alta demanda en fechas específicas, podrían requerir alta urgencia para esas fechas, y si no se atacan rápido podría perderse la oportunidad.
Por cierre se puede analizar qué segmentos de cliente se están atacando más o siendo más eficiente.

Esta matriz utiliza datos cualitativos, de modo que se utilizó un valor random de dispersión al colocar a cada cliente en el gráfico y poder ver las nubes. Sino quedarían estrictamente uno sobre otro en una grilla de 3x3.

### Reuniones por vendedor

Gráfico de barras indicando la cantidad de reuniones de cada vendedor, pudiendo discernir entre las cerradas y abiertas. Permitiendo medir eficiencia y resultados.

### Canales de adquisición

Gráfico de torta que permite ver la distribución de los distintos canales por los cuales el cliente conoce Vambe.
Útil para definir estrategias de marketing.

### Servicios solicitados

Gráfico de torta que permite ver la distribución por el caso de uso requerido por el cliente.
Útil para definir estrategias de producto con soluciones generales y reutilizables.

### Industrias principales

Gráfico de torta para ver cómo distribuyen las industrias asociadas a los clientes, para ver en cuáles se vende más y definir estrategias de producto y marketing.
