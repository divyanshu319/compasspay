# CompassPay — Compensation Intelligence System

CompassPay is a full-stack, level-first salary intelligence MVP. It makes annual compensation comparable by showing base salary, bonus, and equity separately, then calculating total compensation server-side.

## Chosen scope

- **Role:** Full Stack Engineer
- **Track:** B — Compensation Intelligence System
- **Features:** searchable, sortable and paginated salary data; company discovery/detail pages; level-first compensation analytics; validated ingestion; and side-by-side 2–3 offer comparison.

## Architecture

| Layer | Choice | Why |
|---|---|---|
| UI | Next.js App Router, React, TypeScript, Tailwind | One typed full-stack codebase and responsive UI |
| API | Next.js route handlers | REST endpoints close to the product, easy to deploy to Vercel |
| Data | PostgreSQL + Prisma | Strong relational integrity, indexes, type-safe queries |
| Auth | bcrypt password hashes + signed HTTP-only JWT cookie | Small, secure, explainable implementation without an auth SaaS |

### Data integrity decisions

1. `totalComp` is calculated on the server as `baseSalary + bonus + stock`; it is never trusted from the browser.
2. Bonus and stock default to `0`, as requested. Negative and unrealistic values are rejected by Zod.
3. Company names are normalized (`"Acme, Inc."` → `acmeinc`) before an upsert, preventing accidental duplicate companies.
4. A composite database unique constraint rejects duplicate salary submissions for the same company, role, level, location and compensation values—even under concurrent requests.
5. API list endpoints use database pagination with a hard maximum of 50 records, and the UI exposes page navigation.
6. Production authentication requires a `JWT_SECRET` of at least 32 characters; there is no insecure fallback secret.

## API surface

| Endpoint | Purpose |
|---|---|
| `GET /api/compensation` | Filter by `q`, `level`, `location`; sort by total/base/recent; paginate |
| `POST /api/compensation` | Validate, normalize and save a submission |
| `GET /api/companies` | Paginated company discovery and submission counts |
| `GET /api/companies/:normalizedName` | Company summary, level aggregation, pay-mix inputs, and recent/top records |
| `GET /api/compare?ids=a,b` | Return 2–3 salary records for comparison |
| `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout` | Account/session lifecycle |

## Mandatory research

### Key observations

- Levels.fyi centres its salary discovery around level mappings and displays annual total compensation as salary, stock and bonuses; this informed the level-first data model and explicit pay breakdown.
- 6figr promotes salary search, comparisons, career paths and employer-side salary benchmarking; it validates that structured comparison is a more useful core than a simple job list.
- AmbitionBox combines salary exploration/calculation with company reviews, interviews and comparisons. This MVP deliberately keeps its first release narrowly focused on structured pay data rather than broad workplace content.
- Glassdoor puts salary estimates alongside broader workplace context. CompassPay retains the transparent salary-comparison core, but provides an ingestion flow rather than estimates only.

### Feature comparison sheet

| Feature | Levels.fyi | 6figr | AmbitionBox | Glassdoor | Build? |
|---|---:|---:|---:|---:|---:|
| Level-aware salary comparisons | Yes | Partial | Partial | Partial | Yes |
| Salary search/filtering | Yes | Yes | Yes | Yes | Yes |
| Compensation breakdown | Yes | Yes | Partial | Partial | Yes |
| User salary submission | Yes | Yes | Yes | Yes | Yes |
| Company reviews/interviews | No | No | Yes | Yes | No — outside MVP |
| Career/referral tools | Some | Yes | Some | Some | No — outside MVP |

Research sources: [Levels.fyi](https://www.levels.fyi/), [6figr](https://6figr.com/), [AmbitionBox](https://www.ambitionbox.com/home/), [Glassdoor Salaries](https://www.glassdoor.com/Salaries/index.htm).

## Local setup

```bash
cp .env.example .env
# Set a unique JWT_SECRET of 32+ characters in .env
npm install
npx prisma generate
npm run db:deploy
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. The seeded dataset is synthetic and exists only for a functional demo.

## Deployment

Deploy the Next.js app to Vercel and connect a Neon, Railway, or Render PostgreSQL database. Set `DATABASE_URL` and a long random `JWT_SECRET` in the deployment environment. Apply the committed migration with `npm run db:deploy`, then run `npm run db:seed` once against the production database. Do not run `db:push` against production: it is retained only for disposable local development databases.

Run these quality checks before deployment:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Loom walkthrough outline

1. Demonstrate filtering, sorting, and the compensation breakdown table.
2. Compare two offers and discuss why role, location, and level change interpretation.
3. Submit a compensation record, explain server validation, normalized companies, total-comp calculation, and duplicate rejection.
4. Walk through the Prisma schema, indexes, and deployment variables.
