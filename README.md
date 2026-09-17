# AuditFlow

AuditFlow is a portfolio-grade internal audit management system for planning engagements, documenting fieldwork, tracking findings, coordinating corrective actions, verifying remediation, and reporting assurance outcomes.

The product is intentionally designed as a calm, information-dense enterprise workspace rather than a generic admin dashboard. Its primary demonstration follows an inventory discrepancy from physical count through a controlled finding workflow, audit trail, dashboard update, and Excel report.

## Problem and solution

Internal audit work is often fragmented across spreadsheets, email, shared folders, and manual reminders. AuditFlow centralizes that lifecycle while preserving ownership, evidence context, controlled status transitions, and a defensible activity history.

## Features

- Executive dashboard with audit, finding, exposure, severity, trend, department, and activity views
- Audit plans and full audit engagement records
- Finding register with severity, ownership, dates, status, and financial impact
- Inventory reconciliation with automatic variance and financial-difference calculations
- One-click inventory discrepancy conversion into a finding
- PIC corrective-action submission and auditor verification/closure flow
- Guarded state transitions: a finding cannot close before verification
- Activity trail for important business events
- Multi-sheet `.xlsx` workbooks with native numeric fields and practical widths
- Role-aware navigation for Administrator, Auditor, Manager, and Auditee/PIC
- Responsive tables, mobile navigation, keyboard focus states, semantic labels, and text-supported severity indicators
- Production-oriented Prisma/PostgreSQL schema with relations and filtering indexes
- Zod validation contracts and a serverless health route
- Portfolio case study at `/case-study`

## Technology stack

Next.js 16.3 App Router, React, TypeScript, Prisma, PostgreSQL, Auth.js-ready session architecture, Zod, Recharts, SheetJS, Lucide Icons, Sonner, and CSS design tokens. It is deployable on Vercel with Neon or Supabase Postgres.

## Architecture

```text
Browser
   ↓
Next.js App Router (Server + Client Components)
   ↓
Route Handlers / Server Actions
   ↓
Zod validation + server-side RBAC
   ↓
Prisma ORM
   ↓
Managed PostgreSQL (Neon / Supabase)
```

The included portfolio demo uses browser storage so reviewers can immediately exercise the complete workflow without provisioning infrastructure. The normalized Prisma schema, seed script, environment contract, and server boundary are included for the production database path. Demo storage is device-local and must not be used for real audit data.

## Database schema

Core models: `User`, `Role`, `Department`, `AuditPlan`, `Audit`, `AuditTeam`, `AuditChecklist`, `Finding`, `CorrectiveAction`, `Evidence`, `InventoryAudit`, `InventoryAuditItem`, and `ActivityLog`. UUID keys, timestamps, enums, relations, cascades, unique business IDs, and indexes for status, severity, department, audit, PIC, and due date are defined in `prisma/schema.prisma`.

## Local installation

Requirements: Node.js 20.9+ and PostgreSQL 15+.

```bash
npm install
copy .env.example .env
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. A database is optional for the self-contained portfolio demo but required for a production persistence integration.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Managed PostgreSQL connection string with SSL |
| `AUTH_SECRET` | High-entropy Auth.js signing secret |
| `NEXTAUTH_URL` | Canonical application URL for local auth callbacks |
| `BLOB_READ_WRITE_TOKEN` | Optional persistent evidence storage token |

Generate a secret with `openssl rand -base64 32`. Never commit `.env` files.

## Demo accounts

All accounts use password `AuditFlow2026!`.

| Role | Email |
| --- | --- |
| Administrator | `admin@auditflow.demo` |
| Auditor | `auditor@auditflow.demo` |
| Audit Manager | `manager@auditflow.demo` |
| Auditee / PIC | `pic@auditflow.demo` |

The sign-in screen also provides one-click account selection. Demo authentication is intentionally local; connect the supplied user and role models to Auth.js Credentials or an enterprise OIDC provider before production use.

## Excel export

Audit workbooks contain professional worksheets for Audit Summary, Findings, Corrective Actions, and Inventory Audit. Dates remain ISO-compatible, currency fields are numeric, completion is numeric, and column widths are set for readability. Inventory-only and filtered-finding exports are also available.

## Evidence storage

The demo stores evidence metadata only. For Vercel, use Vercel Blob or an S3-compatible provider, persist only object keys in `Evidence.storageKey`, validate MIME type and size before upload, use signed URLs, and scan untrusted uploads. Serverless local disk is ephemeral and is not a persistent storage solution.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Deploy to Vercel

1. Push the repository to GitHub and import it into Vercel.
2. Create a Neon or Supabase PostgreSQL database.
3. Add all variables from `.env.example` to the Vercel project.
4. Run `npx prisma migrate deploy` against the production database.
5. Run `npm run db:seed` only for a dedicated demo environment.
6. Configure Vercel Blob if evidence objects must persist.
7. Deploy. Next.js Route Handlers run as serverless functions; no custom always-on server is required.

For a production rollout, replace demo local storage with repository functions backed by Prisma, connect Auth.js sessions, enforce the role matrix at every server mutation, enable rate limiting, configure file scanning, and retain activity logs under the organization's records policy.

## Future improvements

- Enterprise SSO, MFA, and SCIM provisioning
- Versioned audit programs and reusable control libraries
- Email/Teams reminders and escalation rules
- PDF report rendering and digital approvals
- Continuous-control monitoring connectors
- Test coverage with Vitest, Playwright, and database integration fixtures
