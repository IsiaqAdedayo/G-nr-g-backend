# Gúnrégé Backend

**Properly Arranged** — See clothes on a body like yours before you buy them.

This is the backend API for **Gúnrégé**, a virtual fitting room product. It powers model matching, garment browsing, AI try-on generation, fit analysis, and saved looks.

---

## Table of Contents

1. [What Is This Project?](#what-is-this-project)
2. [Tech Stack (And Why)](#tech-stack-and-why)
3. [Project Structure](#project-structure)
4. [How the Pieces Fit Together](#how-the-pieces-fit-together)
5. [Prerequisites](#prerequisites)
6. [Getting Started](#getting-started)
7. [Environment Variables](#environment-variables)
8. [Database & Prisma](#database--prisma)
9. [Running the Server](#running-the-server)
10. [API Endpoints](#api-endpoints)
11. [Key Concepts](#key-concepts)
12. [Architecture Deep-Dive](#architecture-deep-dive)
13. [Common Commands](#common-commands)
14. [Troubleshooting](#troubleshooting)

---

## What Is This Project?

Gúnrégé answers one question:

> **"Will this clothing fit someone with my body?"**

The flow is simple:

```
Enter your measurements
  → Find the closest model preset to your body
  → Pick a garment from the curated catalog
  → Generate a virtual try-on image (AI-powered, async)
  → See an estimated fit analysis
  → Save it as a "Look" and shop
```

This backend handles everything **after** the user enters measurements — matching them to a model, serving the garment catalog, queuing AI try-on jobs, computing fit estimates, and persisting saved looks.

---

## Tech Stack (And Why)

| Technology | What It Does | Why We Chose It |
|---|---|---|
| **NestJS** | Node.js framework for building the API | Opinionated structure keeps a growing codebase organized. Uses TypeScript natively. Feels like Angular for the backend. |
| **TypeScript** | Superset of JavaScript with types | Catches bugs at compile time. The whole stack (frontend + backend) is TypeScript. |
| **Prisma** | Database ORM (Object-Relational Mapper) | Generates type-safe database queries. Schema-first approach means your database structure lives in one readable file. |
| **PostgreSQL** | Relational database | Battle-tested, handles complex relations well, great for structured data like measurements and garments. |
| **Redis** | In-memory data store | Used as the message broker for background job queues. Fast, reliable. |
| **BullMQ** | Job queue built on Redis | Handles async AI try-on generation. Jobs persist even if the server restarts. |
| **class-validator** | Request validation decorators | Automatically validates incoming API requests with decorators like `@IsNumber()` — no manual checking needed. |
| **@nestjs/throttler** | Rate limiting | Protects expensive AI endpoints from abuse. |
| **@nestjs/swagger** | Auto-generated API docs | Visit `/api/docs` to see interactive documentation for every endpoint. |
| **@nestjs/config** | Environment variable loading | Reads `.env` files cleanly and makes config available everywhere. |

---

## Project Structure

```
gunrege-backend/
├── prisma/
│   ├── schema.prisma          ← THE source of truth for your database
│   ├── seed.ts                ← Fills DB with model presets & garments
│   └── migrations/            ← Auto-generated migration files
│
├── src/
│   ├── main.ts                ← Entry point: starts the server
│   ├── app.module.ts          ← Root module: wires everything together
│   │
│   ├── prisma/
│   │   ├── prisma.service.ts  ← Database connection wrapper
│   │   └── prisma.module.ts   ← Makes Prisma available globally
│   │
│   ├── common/
│   │   ├── dto/               ← Data Transfer Objects (request validation)
│   │   │   ├── measurements.dto.ts
│   │   │   ├── appearance.dto.ts
│   │   │   ├── profile.dto.ts
│   │   │   ├── likeness.dto.ts
│   │   │   ├── garment.dto.ts
│   │   │   ├── try-on.dto.ts
│   │   │   └── look.dto.ts
│   │   └── guards/
│   │       └── auth.guard.ts  ← Protects endpoints that need a logged-in user
│   │
│   └── modules/
│       ├── auth/              ← Register & login (JWT-based)
│       ├── profiles/          ← User profiles, body measurements, appearance
│       ├── likeness/          ← Model matching algorithm
│       ├── models/            ← Browse model presets
│       ├── garments/          ← Browse garment catalog
│       ├── brands/            ← Browse brands
│       ├── try-ons/           ← Create & poll virtual try-on jobs
│       ├── fit-analysis/      ← Fit engine: garmentEase + matchError
│       ├── looks/             ← Save & retrieve saved outfits
│       ├── jobs/              ← BullMQ worker: processes try-on queue
│       ├── ai/                ← AI provider abstraction layer
│       └── uploads/           ← Image upload via Cloudinary
│
├── .env.example               ← Template for environment variables
├── package.json               ← Dependencies & scripts
└── nest-cli.json              ← NestJS build configuration
```

---

## How the Pieces Fit Together

Think of the backend as a **layered cake**:

```
┌─────────────────────────────────────────────────┐
│              HTTP REQUESTS                       │
│         (from the Next.js frontend)              │
├─────────────────────────────────────────────────┤
│              CONTROLLERS                         │
│     Define routes: GET /garments, POST /try-ons  │
│     Validate input using DTOs                    │
├─────────────────────────────────────────────────┤
│              SERVICES                            │
│     Business logic lives here                    │
│     (matching algorithm, fit engine, etc.)        │
├─────────────────────────────────────────────────┤
│              PRISMA SERVICE                      │
│     Type-safe database queries                   │
├─────────────────────────────────────────────────┤
│              POSTGRESQL                          │
│     Actual data storage                          │
├─────────────────────────────────────────────────┤
│              REDIS + BULLMQ                      │
│     Background job queue for AI try-ons          │
└─────────────────────────────────────────────────┘
```

**Request flow example — "Try on this garment":**

1. Frontend sends `POST /try-ons` with a garment ID
2. **Controller** validates the request using `class-validator`
3. **Service** checks for duplicate in-flight requests (idempotency, §6.1)
4. **Service** creates a `TryOn` record in the database with status `queued`
5. **Service** pushes a job onto the BullMQ `try-on-generation` queue
6. **Controller** returns the `jobId` immediately (don't block the HTTP request)
7. **BullMQ worker** (in `jobs/`) picks up the job
8. Worker calls the **AI provider** (Replicate, Fal, etc.) via the `ai/` abstraction
9. Worker stores the result URL and marks the job as `completed`
10. Frontend polls `GET /try-ons/:id/status` until it sees `completed`
11. Frontend displays the result image

---

## Prerequisites

Before you begin, make sure you have:

- **Node.js** v18+ (v20+ recommended) — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** — [Download](https://www.postgresql.org/download/) or use Docker
- **Redis** — [Download](https://redis.io/download) or use Docker

Optional but recommended:
- **Docker Desktop** — easiest way to run PostgreSQL and Redis
- **Prisma Studio** — visual database browser (included via `npx prisma studio`)

---

## Getting Started

### 1. Clone and install

```bash
cd gunrege-backend
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your database URL and Redis connection. See [Environment Variables](#environment-variables) below for details.

### 3. Start your databases

**Option A — Docker (easiest):**

```bash
docker run -d --name gunrege-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=gunrege -p 5432:5432 postgres:16
docker run -d --name gunrege-redis -p 6379:6379 redis:7
```

**Option B — Local install:**

Make sure PostgreSQL and Redis are running on their default ports.

### 4. Run database migrations

```bash
npx prisma migrate dev
```

This reads `prisma/schema.prisma` and creates all the tables in your database.

### 5. Seed the database

```bash
npm run db:seed
```

This fills the database with:
- **15 model presets** with diverse measurements, skin tones, and builds
- **35 curated garments** across all categories
- **5 brands**

### 6. Start the dev server

```bash
npm run start:dev
```

The server starts at **http://localhost:3001**.

### 7. Explore the API docs

Visit **http://localhost:3001/api/docs** for interactive Swagger documentation.

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# ── Database ────────────────────────────────────────────────────────
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gunrege?schema=public"

# ── Redis / BullMQ ─────────────────────────────────────────────────
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# ── CORS ───────────────────────────────────────────────────────────
# Must match where your Next.js frontend runs
CORS_ORIGIN=http://localhost:3000

# ── Server ─────────────────────────────────────────────────────────
PORT=3001

# ── Cloudinary (for image uploads) ────────────────────────────────
# Optional for MVP — needed when storing model/garment images
# CLOUDINARY_CLOUD_NAME=
# CLOUDINARY_API_KEY=
# CLOUDINARY_API_SECRET=

# ── AI Provider (for try-on generation) ───────────────────────────
# Optional for MVP — needed for actual AI inference
# REPLICATE_API_TOKEN=
# FAL_KEY=
```

**Important:** Never commit your `.env` file. It's already in `.gitignore`.

---

## Database & Prisma

### What is Prisma?

Prisma is an ORM (Object-Relational Mapper). Instead of writing raw SQL, you write TypeScript queries like:

```typescript
// Find all garments in the "Tops" category
const tops = await prisma.garment.findMany({
  where: { category: 'Tops' },
  include: { brand: true },  // also fetch the brand name
});
```

Prisma also gives you **type safety** — if you try to access `garment.fooBar`, TypeScript will catch the error immediately.

### The Schema (`prisma/schema.prisma`)

This is the **single source of truth** for your database structure. Every table, column, and relationship is defined here.

**Key models:**

| Model | What it represents |
|---|---|
| `User` | A registered user (or guest) |
| `UserProfile` | Their body shape, linked to body and appearance sub-profiles |
| `BodyProfile` | Height, bust, waist, hips, shoulder, inseam, weight (all in cm/kg) |
| `AppearanceProfile` | Skin tone, hair colour, age range, build |
| `ModelPreset` | A preset model with their own measurements and photo |
| `VirtualLikeness` | The result of matching a user to their closest model preset |
| `Garment` | A clothing item in the curated catalog |
| `Brand` | A fashion brand |
| `TryOn` | An AI try-on job (queued → processing → completed/failed) |
| `FitAnalysis` | The fit estimate for a try-on result |
| `Look` | A saved outfit (likeness + garment + try-on result) |

### Common Prisma Commands

```bash
# Create a new migration after changing schema.prisma
npx prisma migrate dev

# Preview what SQL a migration will run
npx prisma migrate diff

# Open Prisma Studio (visual database browser)
npx prisma studio

# Reset the database completely (deletes all data!)
npx prisma migrate reset

# Regenerate the Prisma Client (after schema changes)
npx prisma generate
```

---

## Running the Server

```bash
# Development (auto-restarts on file changes)
npm run start:dev

# Production build
npm run build
npm run start:prod

# Debug mode (with inspector)
npm run start:debug
```

The server runs on **http://localhost:3001** by default.

**Health check:** `GET /` returns `{ status: 'ok', service: 'gunrege-backend' }`.

---

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Create an account | No |
| `POST` | `/auth/login` | Get a JWT token | No |
| `GET` | `/auth/me` | Get current user info | Yes |

### Profiles

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/profiles/body` | Get body measurements | Yes |
| `PUT` | `/profiles/body` | Update body measurements | Yes |
| `GET` | `/profiles/appearance` | Get appearance profile | Yes |
| `PUT` | `/profiles/appearance` | Update appearance profile | Yes |

### Likeness (Model Matching)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/likeness/match` | Find the closest model preset | Yes |
| `GET` | `/likeness` | Get current likeness | Yes |
| `PATCH` | `/likeness` | Update likeness (adjust model) | Yes |

### Garments & Brands

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/garments` | List garments (with filters) | No |
| `GET` | `/garments/:id` | Get a single garment | No |
| `GET` | `/brands` | List all brands | No |

### Try-Ons

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/try-ons` | Create a try-on job | Yes |
| `GET` | `/try-ons/:id` | Get try-on result | Yes |
| `GET` | `/try-ons/:id/status` | Poll job status | Yes |

### Looks

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/looks` | List saved looks | Yes |
| `POST` | `/looks` | Save a look | Yes |
| `DELETE` | `/looks/:id` | Delete a look | Yes |

### Models

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/models` | List all model presets | No |

### Swagger Docs

Visit **http://localhost:3001/api/docs** for auto-generated, interactive API documentation.

---

## Key Concepts

### Model Matching (§3 of the spec)

When a user enters their measurements, the backend finds the **closest model preset** using a weighted Euclidean distance algorithm:

1. **Normalize** each measurement by its range across the model library (so height in cm doesn't dominate waist in cm)
2. **Weight** torso measurements higher (bust/waist/hips = 1.2) than height (0.8) or shoulders (0.6), because garment fit depends more on torso proportions
3. **Filter** first by appearance (skin tone, hair, age, build) — these narrow the candidate pool
4. **Rank** the filtered candidates by measurement distance
5. **Return** the top match, plus 3–5 runner-ups for the "Adjust" feature

The result is a `VirtualLikeness` with:
- The matched model's ID
- A `matchDistance` (lower = better)
- A `matchConfidenceTier`: `"close"`, `"moderate"`, or `"loose"`

### Fit Analysis (§9, §10)

Fit is **estimated, never guaranteed**. The engine computes two things:

1. **Garment Ease** = garment measurement − model measurement
   - Positive = roomy, negative = tight
2. **Match Error** = model measurement − user measurement
   - How far off the model is from the real user

Both are shown to the user. When match confidence is `"moderate"` or `"loose"`, a qualifier is appended:
> *"Estimated fit (based on your closest match — may vary)"*

### Try-On Job Lifecycle (§6, §6.1)

```
POST /try-ons
  → Create TryOn record (status: "queued")
  → Push job to BullMQ queue
  → Return jobId immediately

BullMQ worker picks up job
  → status: "processing"
  → Calls AI provider (Replicate/Fal/etc.)
  → Validates returned image (URL exists, non-zero size)
  → If valid: status: "completed", stores resultUrl
  → If invalid: status: "failed", stores error

Frontend polls GET /try-ons/:id/status
  → Sees "completed" → displays the image
  → Sees "failed" → shows retry UI
```

**Idempotency:** Duplicate requests with the same `inputSignature` return the existing job instead of creating a new one.

**Caching (§27):** The `inputSignature` is a hash of `likenessVersion + garmentVersion + aiModelVersion + renderConfigVersion`. If a completed result already exists for that signature, it's reused.

### BullMQ Queues (§7)

| Queue | Purpose |
|---|---|
| `try-on-generation` | AI try-on image generation (the only queue in MVP) |

Future queues (not yet implemented):
- `image-processing` — resizing, watermarking
- `fit-analysis` — advanced fit computation
- `model-generation` — creating new model presets
- `recommendations` — personalized garment suggestions

### Rate Limiting (§25.1)

- General: 60 requests per minute per IP
- Try-on endpoint: 20 requests per rolling hour per user (token bucket)
- Rate-limit rejections return a clear `429` error, distinct from AI provider failures

---

## Architecture Deep-Dive

### NestJS Modules

NestJS uses **modules** to organize code. Each feature (auth, garments, try-ons, etc.) has its own module containing:

- **Controller** — defines HTTP routes and handles request/response
- **Service** — contains business logic
- **Module** — wires the controller and service together, declares dependencies

```
@Module({
  imports: [PrismaModule],        // inject Prisma
  controllers: [GarmentsController],  // routes
  providers: [GarmentsService],       // logic
})
export class GarmentsModule {}
```

The `AppModule` (`src/app.module.ts`) imports all feature modules and configures cross-cutting concerns (rate limiting, Redis, environment variables).

### Prisma Service Pattern

Instead of instantiating `PrismaClient` everywhere, we wrap it in a NestJS service:

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

This makes `PrismaService` injectable into any other service via NestJS's dependency injection:

```typescript
constructor(private prisma: PrismaService) {}
```

### DTOs and Validation

**DTOs** (Data Transfer Objects) define the shape and validation rules for incoming requests:

```typescript
export class UpsertBodyDto {
  @IsNumber()
  @Min(100)
  @Max(250)
  heightCm: number;

  @IsNumber()
  @Min(40)
  @Max(200)
  bustCm: number;

  // ... etc
}
```

The `ValidationPipe` in `main.ts` automatically validates every incoming request against these DTOs. Invalid requests get a `400 Bad Request` with detailed error messages — no manual checking needed.

### Guards

The `AuthGuard` protects endpoints that require a logged-in user. It checks for a valid JWT in the `Authorization` header and attaches the user to the request.

```typescript
@UseGuards(AuthGuard)
@Get('me')
getMe(@Request() req) {
  return req.user;  // populated by the guard
}
```

### AI Provider Abstraction (§6)

The `ai/` module defines an interface that any AI provider must implement:

```typescript
interface VirtualTryOnProvider {
  generateTryOn(input: TryOnInput): Promise<TryOnResult>;
}
```

Implementations can be swapped without changing any business logic:
- `ReplicateVirtualTryOnProvider`
- `FalVirtualTryOnProvider`
- `SelfHostedVirtualTryOnProvider`

This keeps the domain code decoupled from any specific AI vendor.

---

## Common Commands

```bash
# ── Development ────────────────────────────────────────────────────
npm run start:dev          # Start dev server with hot-reload
npm run build              # Build for production
npm run start:prod         # Run production build

# ── Database ───────────────────────────────────────────────────────
npm run db:migrate         # Create a new migration
npm run db:seed            # Populate with model presets & garments
npm run db:reset           # Drop & recreate all tables, then seed
npm run db:studio          # Open visual database browser

# ── Testing ────────────────────────────────────────────────────────
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage report
npm run test:e2e           # Run end-to-end tests

# ── Code Quality ───────────────────────────────────────────────────
npm run lint               # Run ESLint
npm run format             # Format code with Prettier

# ── Prisma ─────────────────────────────────────────────────────────
npx prisma generate        # Regenerate Prisma Client
npx prisma migrate dev     # Apply migrations in dev mode
npx prisma studio          # Open database in browser
npx prisma db push         # Push schema changes without migration (prototyping)
```

---

## Troubleshooting

### "Cannot find module" errors

```bash
# Rebuild Prisma Client (most common fix)
npx prisma generate

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Database connection refused

- Make sure PostgreSQL is running: `pg_isready` (or check Docker)
- Verify `DATABASE_URL` in `.env` matches your PostgreSQL setup
- Default port is `5432`

### Redis connection refused

- Make sure Redis is running: `redis-cli ping` (should return `PONG`)
- Verify `REDIS_HOST` and `REDIS_PORT` in `.env`
- Default port is `6379`

### Port 3001 already in use

```bash
# Find what's using the port
lsof -i :3001

# Kill it (or change PORT in .env)
kill -9 <PID>
```

### Prisma migration errors

```bash
# Nuclear option: reset everything
npx prisma migrate reset --force

# Then re-seed
npm run db:seed
```

### TypeScript errors after pulling latest code

```bash
# Regenerate Prisma Client (schema may have changed)
npx prisma generate

# Reinstall if new dependencies were added
npm install
```

---

## Related

- **Frontend:** See `/forme-fashion` (Next.js app)
- **Spec:** See `gunrege-mvp-engineering-spec-v2.md` for the full product specification
- **NestJS docs:** https://docs.nestjs.com
- **Prisma docs:** https://www.prisma.io/docs
- **BullMQ docs:** https://docs.bullmq.io

---

## License

Proprietary — Gúnrégé. All rights reserved.
