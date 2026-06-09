# Implementation Plan: Government Queue Tracking Platform (Lessa?)

**Branch**: `001-government-queue-platform` | **Date**: 2026-06-09 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-government-queue-platform/spec.md`

<!-- SPECKIT START -->
<!-- SPECKIT END -->

## Summary

Build a bilingual (Arabic/English) web platform that lets citizens book queue slots at a government service branch, track their turn, and lets staff manage the queue in real time. The system uses a strict three-tier architecture: React (Lovable + Tailwind + TanStack Query) frontend → Node.js (Express) REST API → Supabase PostgreSQL with RLS. JWT with custom role claims enforces five-role RBAC at both API middleware and database layers.

## Technical Context

**Language/Version**: TypeScript — Node.js 20 LTS (backend), React 18 (frontend)

**Primary Dependencies**:
- Backend: Express, @supabase/supabase-js, jsonwebtoken, zod
- Frontend: React 18, Tailwind CSS, TanStack Query v5, react-i18next, Supabase JS client (read-only calls via backend API only)

**Storage**: Supabase PostgreSQL — RLS enabled on all user-data tables; migrations versioned in `/backend/migrations/`

**Testing**: Vitest + Supertest (backend integration), Vitest + Testing Library (frontend component)

**Target Platform**: Web — backend on Railway/Render; frontend on Vercel (or Lovable hosted preview)

**Project Type**: Web application — separate frontend and backend directories

**Performance Goals**:
- Queue position visible within 5 s of staff action (manual refresh acceptable for MVP; SC-003)
- Window open/close propagated within 10 s (SC-006)

**Constraints**:
- 8-hour hackathon delivery window (Constitution Principle I)
- Single-branch scope (no multi-branch)
- No native mobile app; responsive web only

**Scale/Scope**: One branch, ≤10 concurrent windows, hundreds of daily tickets

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked post-design below.*

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| I | MVP-First Delivery | ✅ PASS | Single-branch scope; P2 analytics deferred until core queue works |
| II | Queue-Workflow Priority | ✅ PASS | Ticket issuance, status tracking, and staff management are the primary deliverables |
| III | Node.js Backend | ✅ PASS | Express on Node.js 20; no additional backend runtimes |
| IV | Supabase PostgreSQL Persistence | ✅ PASS | All data in Supabase; RLS required on all user-data tables |
| V | Layered Architecture | ✅ PASS | Frontend calls Node.js API only; no direct Supabase writes from browser |
| VI | AI-Accelerated Development | ✅ PASS | Lovable for UI scaffolding; Claude Code for backend generation |
| VII | Maintainable & Documented Code | ✅ PASS | OpenAPI annotations required on all endpoints; `.env.example` required |
| VIII | Simplicity Over Engineering | ✅ PASS | YAGNI applied; no ORM (raw Supabase client queries); no WebSocket in MVP |
| IX | Bilingual UI — Arabic & English | ✅ PASS | react-i18next with `ar.json` / `en.json`; RTL CSS logical properties |
| X | Role-Based Access Control | ✅ PASS | 5 roles; JWT middleware + Supabase RLS dual enforcement |

**No violations. Phase 0 research may proceed.**

## Project Structure

### Documentation (this feature)

```text
specs/001-government-queue-platform/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── openapi.yml
│   └── roles.md
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── routes/          # Express route declarations (thin: parse, validate, call controller)
│   ├── controllers/     # Request/response handling; calls service layer
│   ├── services/        # Business logic (queue management, booking rules, RBAC guards)
│   ├── middleware/       # JWT auth, role enforcement, error handler
│   ├── db/              # Supabase client initialization
│   └── lib/             # Shared utilities (zod schemas, error types)
├── migrations/          # SQL migration files (numbered, reproducible)
├── .env.example
└── package.json

frontend/
├── src/
│   ├── components/      # Reusable UI components (queue card, ticket badge, window status)
│   ├── pages/           # Route-level views (Home, BookingFlow, QueueStatus, StaffDashboard, etc.)
│   ├── hooks/           # TanStack Query hooks wrapping backend API calls
│   ├── services/        # Axios/fetch wrappers for backend REST calls
│   ├── i18n/
│   │   ├── ar.json
│   │   └── en.json
│   └── lib/             # Auth context, JWT storage, RTL helpers
├── public/
└── package.json
```

**Structure Decision**: Web application (Option 2) — distinct `backend/` and `frontend/` directories. Lovable generates the initial React scaffold under `frontend/`; backend is hand-authored or AI-scaffolded in `backend/`.

## Complexity Tracking

> No constitution violations to justify.
