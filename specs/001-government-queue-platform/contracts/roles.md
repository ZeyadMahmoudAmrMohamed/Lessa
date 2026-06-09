# Role Access Control — Lessa? API

## Roles

| Role | JWT `app_metadata.role` | Created by |
|---|---|---|
| Guest | — (no token) | n/a |
| Citizen | `citizen` | Self-registration via `/api/auth/register` |
| Staff | `staff` | Admin via user management |
| Supervisor | `supervisor` | Admin via user management |
| Admin | `admin` | Seeded manually in DB |

## Endpoint Access Matrix

| Endpoint | Guest | Citizen | Staff | Supervisor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| `GET /health` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `GET /api/services/public` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `POST /api/auth/register` | ✅ | — | — | — | — |
| `POST /api/auth/login` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `GET /api/citizen/ticket/active` | ❌ | ✅ | ❌ | ❌ | ❌ |
| `POST /api/citizen/tickets` | ❌ | ✅ | ❌ | ❌ | ❌ |
| `DELETE /api/citizen/tickets/:id` | ❌ | ✅ | ❌ | ❌ | ❌ |
| `GET /api/citizen/notifications` | ❌ | ✅ | ❌ | ❌ | ❌ |
| `GET /api/staff/window/:id/queue` | ❌ | ❌ | ✅ | ✅ | ❌ |
| `POST /api/staff/window/:id/next` | ❌ | ❌ | ✅ | ✅ | ❌ |
| `PATCH /api/staff/tickets/:id/status` | ❌ | ❌ | ✅ | ✅ | ❌ |
| `GET /api/supervisor/branch/dashboard` | ❌ | ❌ | ❌ | ✅ | ✅ |
| `PATCH /api/supervisor/windows/:id` | ❌ | ❌ | ❌ | ✅ | ✅ |
| `PATCH /api/supervisor/windows/:id/assign` | ❌ | ❌ | ❌ | ✅ | ✅ |
| `GET /api/supervisor/branch/summary` | ❌ | ❌ | ❌ | ✅ | ✅ |
| `GET /api/services` (all) | ❌ | ❌ | ❌ | ❌ | ✅ |
| `POST /api/services` | ❌ | ❌ | ❌ | ❌ | ✅ |
| `PATCH /api/services/:id` | ❌ | ❌ | ❌ | ❌ | ✅ |
| `GET /api/admin/users` | ❌ | ❌ | ❌ | ❌ | ✅ |
| `PATCH /api/admin/users/:id` | ❌ | ❌ | ❌ | ❌ | ✅ |
| `GET /api/admin/reports` | ❌ | ❌ | ❌ | ❌ | ✅ |

## Enforcement layers

1. **Node.js middleware** (`authenticate` + `authorize`): validates JWT signature and role on every protected route — the primary enforcement layer.
2. **Supabase RLS policies** (migration 002): database-level row filter for any direct or future client connections — defence in depth.

Both layers must be satisfied independently. Bypassing either is a Constitution Principle X violation.
