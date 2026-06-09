<!-- SYNC IMPACT REPORT
Version: N/A → 1.0.0
Change type: MAJOR (initial authorship — full constitution created from blank template)
Modified principles: N/A (first version)
Added sections:
  - Core Principles (I–X)
  - Technology Stack & Architecture
  - Role Definitions & Access Control
  - Governance
Removed sections: N/A
Templates reviewed:
  ✅ .specify/templates/plan-template.md — "Constitution Check" gate is generic; compatible as-is
  ✅ .specify/templates/spec-template.md — Scope/requirements structure aligned; no changes needed
  ✅ .specify/templates/tasks-template.md — Phase/task categorization compatible; no changes needed
Follow-up TODOs: None — all placeholders resolved
-->

# Lessa? Constitution

## Core Principles

### I. MVP-First Delivery (NON-NEGOTIABLE)

The team MUST ship a functional, demonstrable MVP within the 8-hour hackathon window.
Every decision — scope, design, implementation — MUST be evaluated against this hard time constraint first.
Features that cannot be delivered within the window MUST be deferred without debate; a working core beats a
half-finished full system. If any implementation path produces no visible progress within 30 minutes, the
team MUST pivot to the simplest viable alternative immediately.

### II. Queue-Workflow Priority

Core queue workflows — ticket issuance, real-time status tracking, and staff service management — are the
primary and non-deferrable deliverables of this project.
Secondary features (analytics dashboards, notification emails, admin reporting) MUST NOT block or delay
delivery of any core queue capability.
When a trade-off arises between a core queue feature and any secondary feature, the core queue feature
MUST win unconditionally.

### III. Node.js Backend

All backend API services MUST be implemented in Node.js (Express or Fastify).
No additional backend runtimes (Python, Java, Go, etc.) are permitted; context-switching overhead is
incompatible with an 8-hour delivery.
REST endpoints are the default API contract. WebSockets are permitted exclusively for real-time queue
status push updates.
Backend code MUST be structured with clear separation of routes, controllers, and service/business logic.

### IV. Supabase PostgreSQL Persistence

All persistent data MUST be stored in Supabase-managed PostgreSQL.
Direct database access from the frontend layer is PROHIBITED; all data operations MUST transit through
the Node.js API layer.
Supabase Row-Level Security (RLS) MUST be enabled as the database-level enforcement layer for role-based
access control.
Schema definitions MUST be version-controlled and reproducible via migration scripts.

### V. Layered Architecture (STRICT SEPARATION)

The system MUST maintain strict separation across three layers — frontend, backend API, and database — with
no cross-layer shortcuts permitted.

- **Frontend**: UI rendering, user interaction, locale switching. No direct DB access; no business logic.
- **Backend API (Node.js)**: Business logic, authentication, authorization, queue state management.
- **Database (Supabase PostgreSQL)**: Persistence, RLS enforcement, schema definitions only.

Any frontend call that bypasses the Node.js API to write data directly to Supabase is a constitution
violation and MUST be refactored before merge.

### VI. AI-Accelerated Development

The team MUST leverage AI tooling to compress development time across all activities:

- **Code generation**: Scaffold routes, models, controllers, and test stubs via AI prompts.
- **Documentation**: Generate API docs, README, and data-model docs using AI.
- **Testing**: Draft unit and integration test cases with AI assistance.
- **Presentation**: Generate pitch deck content and demo scripts using AI.

All AI-generated output MUST be reviewed and validated by a human team member before it is merged or
presented. AI accelerates; humans verify.

### VII. Maintainable & Documented Code

Code MUST be self-documenting through precise naming; inline comments are reserved for non-obvious
invariants, hidden constraints, or deliberate workarounds — never for describing what the code does.
Every public API endpoint MUST carry a JSDoc or OpenAPI annotation (route, params, response shape, role
required).
All environment variables MUST be documented in a `.env.example` file with descriptions.
Any code block that cannot be understood within 60 seconds by a new team member MUST be refactored or
annotated before the PR is merged.

### VIII. Simplicity Over Engineering

YAGNI (You Aren't Gonna Need It) is a hard rule: implement only what the current user story explicitly
requires. No speculative features, no forward-compatibility shims.
Abstractions MUST NOT be introduced until at least three concrete, existing use cases demand them.
Heavy dependencies, ORMs, and framework magic MUST be justified against a simpler direct alternative.
When choosing between two solutions, the one with fewer lines of code and fewer moving parts MUST be
preferred, all else equal.

### IX. Bilingual UI — Arabic & English

The UI MUST support both Arabic (RTL) and English (LTR) without a full-page reload on language switch.
All user-facing strings MUST be externalized into locale files (`ar.json` / `en.json`); hard-coded UI
text is PROHIBITED.
Arabic MUST be the default locale for all government-facing flows; English is the secondary locale.
Layout MUST respect RTL direction when Arabic is active; CSS MUST use logical properties
(`margin-inline-start`, `padding-inline-end`, etc.) rather than directional aliases (`margin-left`).

### X. Role-Based Access Control

The system MUST enforce access control for five distinct roles:
**Guest**, **Citizen**, **Staff**, **Supervisor**, and **Admin**.

Role enforcement MUST occur at two independent layers:

1. **Node.js API middleware**: validate JWT role claims on every protected route.
2. **Supabase RLS policies**: enforce read/write permissions at the database row level.

Bypassing role checks via URL manipulation, token forgery, or direct DB calls is a critical violation.
Every new feature MUST declare its minimum required role in the spec before implementation begins.
Privilege escalation attempts MUST return HTTP 403 and produce a logged audit event.

## Technology Stack & Architecture

- **Backend**: Node.js with Express or Fastify — REST APIs; Socket.IO or Supabase Realtime for push updates
- **Database**: Supabase PostgreSQL with Row-Level Security enabled on all user-data tables
- **Frontend**: React or Next.js with react-i18next / next-i18next for bilingual support
- **Auth**: Supabase Auth (JWT-based) with custom role claims stored in user metadata
- **Deployment**: Supabase hosted DB; backend and frontend on Vercel, Railway, or Render
- **AI Tooling**: Claude Code, GitHub Copilot, or equivalent — mandatory for code, docs, tests, and demo prep

Architecture enforces a strict three-tier model: **Browser ↔ Node.js API ↔ Supabase**.
No tier is permitted to communicate directly with a non-adjacent tier for write operations.

## Role Definitions & Access Control

| Role | Capabilities |
|---|---|
| **Guest** | View public queue wait times and service availability; no authentication required |
| **Citizen** | Register/log in; issue queue tickets; track own ticket status in real time; cancel own ticket |
| **Staff** | Call next ticket; mark tickets served or no-show; view and manage current active queue |
| **Supervisor** | All Staff capabilities + configure queue settings; view queue analytics; manage Staff accounts |
| **Admin** | Full system access: manage all users, roles, queues, branches, and system configuration |

Role assignment is stored in Supabase Auth user metadata and embedded in the issued JWT as a custom claim.
The Node.js middleware MUST validate the role claim on every protected API request before processing.
Any attempt to access a higher-privilege endpoint without the corresponding role MUST return 403 and
emit an audit log entry (timestamp, user ID, attempted endpoint, role presented).

## Governance

This constitution supersedes all verbal agreements, ad-hoc decisions, and informal conventions made
during the hackathon. In any conflict between this document and other guidance, this document wins.

**Amendment procedure**:
1. Any team member may propose an amendment verbally or in writing.
2. Changes to Principles I–V (core delivery constraints) require explicit approval from the team lead.
3. Clarifications or non-semantic updates to Principles VI–X may be approved by any two team members.
4. All approved amendments MUST update `LAST_AMENDED_DATE` and bump the version per the policy below.

**Versioning policy**:
- MAJOR: Removal or fundamental redefinition of any Core Principle.
- MINOR: Addition of a new principle, new section, or materially expanded guidance.
- PATCH: Clarifications, typo fixes, rewording with no semantic change.

**Compliance review**:
All pull requests MUST include a brief "Constitution Check" confirming no principles are violated.
Any deliberate, justified deviation from a principle MUST be documented in the PR description with
explicit reasoning; unexplained deviations are grounds for mandatory revision before merge.

**Version**: 1.0.0 | **Ratified**: 2026-06-09 | **Last Amended**: 2026-06-09
