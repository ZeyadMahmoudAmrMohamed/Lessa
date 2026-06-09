# Lessa?! | لسه؟
## Smart Government Queue Tracking Platform
### Complete Product & Engineering Documentation Package

**Version:** 1.0 — Hackathon MVP Edition  
**Team Size:** 3 Engineers/Designers  
**Delivery Window:** 2 Days  
**Document Date:** June 2026

---

# TABLE OF CONTENTS

1. Executive Product Vision Document
2. Improved Scope and Product Refinement
3. Full Software Requirements Specification (SRS)
4. Detailed User Stories and Acceptance Criteria
5. Use Cases
6. ERD Design Specification
7. System Architecture Document
8. API Documentation
9. Sprint Plan
10. Prompt Pack for DiagramGPT
11. OpenAPI YAML Skeleton
12. Final Review Section

---

# SECTION 1: EXECUTIVE PRODUCT VISION DOCUMENT

## 1.1 Product Overview

**Lessa?!** (لسه؟ — Arabic for "Still?!" or "Not yet?") is a bilingual (Arabic/English) web platform that modernizes the citizen experience at government service branches by enabling online queue slot booking, real-time position tracking, and AI-assisted wait time prediction. Citizens can book their place in line before leaving home, track their position remotely, and receive turn-approaching notifications — eliminating the frustration of physical waiting.

The platform serves five distinct user roles: Guests (public, unauthenticated), Citizens, Counter Staff, Branch Supervisors, and System Administrators. Each role has a purpose-built interface optimized for their specific workflow.

---

## 1.2 Problem Statement

Government service branches in Egypt and across the MENA region suffer from chronic queue mismanagement. Citizens arrive early, wait hours, and still miss their turn. Branch staff have no real-time visibility into congestion. Supervisors lack the data needed to allocate windows effectively. The result is a systemic erosion of trust in public services.

**Core problems:**
- Citizens have zero visibility into wait times before arriving
- No mechanism for remote queue booking; presence required to secure a place
- Staff calling systems are often manual, ad-hoc, and error-prone
- Branch supervisors cannot measure window efficiency or identify peak-hour bottlenecks
- No accountability trail for service-level violations or ticket disputes
- Citizens with appointments compete with walk-ins in undefined priority queues
- Language barriers (monolingual systems) exclude segments of the population

---

## 1.3 Target Users

| User Segment | Primary Interaction | Key Frustration |
|---|---|---|
| Egyptian citizens / MENA residents | Book, track, receive alerts | Wasted travel, unpredictable waits |
| Government counter staff | Call next, mark done/skip | Manual paper-based process, disputes |
| Branch supervisors | Monitor windows, review metrics | No dashboard, reactive management |
| System admins | Configure services, manage users | Manual onboarding, no central config |
| Walk-in guests (no account) | Check congestion, see live times | Unknown wait before deciding to go |

---

## 1.4 User Pain Points

**Citizen:**
- "I don't know if it's worth going today — it might be a 3-hour wait."
- "I left work early, arrived at 10am, and still waited until 2pm."
- "I got my number, left to grab coffee, missed my turn."
- "The paper ticket machine was broken — staff were calling names informally."

**Counter Staff:**
- "Sometimes 5 people are waiting at my window but 3 windows next to me are empty."
- "I have to manually cross off numbers and shout queue numbers."
- "When I skip a no-show, there's no record and citizens argue about it."

**Branch Supervisor:**
- "I have no idea how many people we served today, or which window was slowest."
- "I can't prove to management that we need more staff during peak hours."

**System Admin:**
- "Every time we add a service or change staff assignments, it requires IT support."

---

## 1.5 Value Proposition

| Stakeholder | Value Delivered |
|---|---|
| Citizens | Book remotely, skip physical waiting, get notified before their turn |
| Counter Staff | Structured digital calling, reduced disputes, clear transaction log |
| Branch Supervisors | Live monitoring dashboard, configurable windows, end-of-day reports |
| Government / Ministry | Data-driven capacity planning, accountability trail, modern service image |
| System Admin | Self-service configuration, RBAC, audit logs |

**Tagline explanation:** "Lessa?!" echoes the universal Egyptian frustration of asking *"Are we there yet?!"* — transforming that anxiety into actionable, real-time information.

---

## 1.6 Business Goals

1. Reduce average citizen wait time by ≥40% within 3 months of deployment
2. Reduce no-show rates through proactive turn-approaching notifications
3. Enable data-driven staffing decisions by providing supervisors with daily/hourly analytics
4. Create a reusable platform deployable across multiple branches/ministries (post-MVP)
5. Establish a public-sector digital transformation reference implementation

---

## 1.7 Success Metrics / KPIs

| Metric | Target (30-Day Post-Launch) |
|---|---|
| Daily active bookings per branch | ≥200 |
| Average wait time reduction | ≥40% vs. baseline |
| No-show rate | ≤15% |
| Check-in completion rate | ≥80% of booked tickets |
| Citizen satisfaction score (optional survey) | ≥4.0 / 5.0 |
| Notification delivery success rate | ≥95% |
| AI prediction accuracy (±5 min from actual) | ≥70% |
| Staff ticket call cycle time | ≤30 seconds per call |

---

## 1.8 Product Principles

1. **Clarity over cleverness** — every citizen interaction must be understandable in under 10 seconds
2. **Bilingual first** — Arabic RTL and English LTR are equally supported, not retrofitted
3. **Offline-resilient** — degraded mode (no real-time) must still function for basic tracking
4. **Auditability by default** — every critical action leaves a traceable log entry
5. **Progressive disclosure** — simple for citizens, powerful for staff and supervisors
6. **Mobile-first but not mobile-only** — public display boards require desktop rendering

---

## 1.9 Assumptions

- MVP covers a **single branch** deployment; the data model is multi-branch ready
- Citizens authenticate via phone number; OTP is simplified or mocked for MVP
- Real-time updates use SSE (Server-Sent Events) for simplicity; WebSocket is Phase 2
- AI prediction is a heuristic model (no ML training required) using queue state + historical averages
- The branch operates during configurable business hours; bookings outside hours are rejected
- Each service type has one configurable average handling time (can be tuned by admin)
- Staff are pre-configured by admin; self-registration for staff is Phase 2
- Notifications are in-app for MVP; SMS/push are Phase 2 integrations
- The public display board is a read-only, unauthenticated page optimized for large screens

---

## 1.10 Constraints

| Constraint | Detail |
|---|---|
| Team | 3 engineers/designers |
| Time | 2 days (hackathon delivery) |
| Infrastructure | Single-server / PaaS deployment (Render, Railway, Heroku) |
| Budget | Near-zero for external services |
| Compliance | No PII storage beyond phone number and name (GDPR-lite) |
| Language | Arabic and English UI required from day one |

---

## 1.11 Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Real-time feature complexity delays core queue | Medium | High | Use polling fallback if SSE proves complex |
| AI prediction adds 1 day of dev time | Medium | Medium | Heuristic model keeps this to <2 hours |
| Arabic RTL layout breaks on some components | Medium | High | Use CSS logical properties; test RTL early |
| Demo data insufficient to show AI value | Low | High | Pre-seed realistic historical records |
| Phone OTP service unreliable or costly | High | Medium | Use static test codes for MVP; abstract provider |

---

## 1.12 Non-Goals (MVP)

- Multi-branch management UI
- Native mobile app (iOS/Android)
- Payment integration (for any paid services)
- SMS/push notification delivery (in-app only for MVP)
- ML-trained prediction models (heuristic only)
- Appointment scheduling (time-slot booking with fixed hour) — queue-based only
- Integration with external government databases or national ID systems
- Video queue display hardware integration

---

## 1.13 MVP Scope Summary

**In Scope:**
- Citizen registration (phone + name) and login
- Service catalog (defined by admin)
- Queue slot booking and cancellation
- Real-time queue position tracking (SSE or polling)
- Counter staff calling interface
- Branch supervisor monitoring dashboard
- Basic reporting (daily transactions, avg wait, no-show rate)
- AI-assisted wait time prediction (heuristic)
- Public display board (current/next tickets, live estimates)
- Bilingual UI (Arabic + English)
- Audit logging for critical actions
- RBAC (5 roles)
- Configurable queue rules (grace period, cancellation cutoff)

**Phased to Post-MVP:** Multi-branch, SMS notifications, ML prediction, mobile apps, appointment scheduling, payment.

---

## 1.14 Post-MVP Roadmap

| Phase | Timeline | Key Features |
|---|---|---|
| Phase 2 | Month 2–3 | Multi-branch, SMS/push notifications, QR code check-in |
| Phase 3 | Month 4–6 | ML-based prediction, appointment scheduling, API for 3rd parties |
| Phase 4 | Month 7–12 | Ministry-level dashboard, SLA monitoring, citizen rating system |
| Phase 5 | Year 2 | Native mobile apps, national ID integration, inter-branch referrals |

---

## 1.15 Differentiators Against Generic Queue Systems

| Generic Queue System | Lessa?! |
|---|---|
| Paper/physical tickets | Digital booking from anywhere |
| No wait time estimation | AI-assisted predicted wait time |
| English-only | Full Arabic RTL + English |
| No citizen notification | Turn-approaching alerts |
| Basic counter display | Rich public board + supervisor dashboard |
| No audit trail | Full audit log for every critical action |
| Single role | 5 distinct role-optimized interfaces |
| No analytics | Daily/weekly/peak-hour reports |

---

## 1.16 Why Bilingual and Public-Sector-Specific Design Matters

Arabic is the primary language of the target user base. Government services typically serve all demographic segments, including elderly citizens and those with limited literacy in Roman-script languages. A monolingual English interface creates real access barriers.

Design considerations specific to public sector:
- Large, clear typography (serving elderly users)
- High-contrast color schemes (accessibility)
- Minimal steps to book (reducing abandonment)
- Trust-signaling UI (official colors, government-appropriate aesthetics)
- RTL-first layout that doesn't feel like a "flipped" LTR interface

---

## 1.17 How the AI Feature Strengthens the Experience

The **AI Wait Time Prediction** feature transforms Lessa?! from a passive queue tracker into an active decision-support tool. Citizens and guests can see a predicted wait time *before* deciding to book or travel. This:

1. **Reduces unnecessary trips** — citizens with a predicted 2-hour wait may choose to book for a less congested time
2. **Sets expectations accurately** — a confident "~18 minutes" beats "number 47 of 60"
3. **Enables smart notifications** — "Your estimated turn is in 12 minutes — head to the branch now"
4. **Supports supervisor decisions** — predicted surge alerts trigger proactive window opening
5. **Improves over time** — even with a heuristic model, historical averages improve accuracy daily

For the MVP, the heuristic is: `Predicted Wait = (tickets_ahead × avg_handling_time_per_service) / active_windows_count` — adjusted by a historical throughput factor. This is lightweight, explainable, and demonstrably useful.

---

# SECTION 2: IMPROVED SCOPE AND PRODUCT REFINEMENT

## 2.1 Missing Requirements (Identified)

| # | Missing Requirement | Impact | Resolution |
|---|---|---|---|
| MR-01 | No definition of queue capacity per time slot or per day | Could lead to overbooking | Add `daily_capacity` and `slot_capacity` to service config |
| MR-02 | No grace period behavior defined (what happens if citizen arrives late) | Staff/citizen conflict | Add configurable grace period (default: 5 min); after grace → ticket auto-skipped |
| MR-03 | No max active bookings per citizen defined | Citizens could book multiple slots | Add `max_active_bookings` config (default: 1 per citizen per day) |
| MR-04 | No definition of branch operating hours | System would accept bookings at 3am | Add `branch_hours` config (open time, close time, days) |
| MR-05 | No cancellation cutoff rule | Citizens cancelling at window → wasted slot | Add `cancellation_cutoff_minutes` config (default: 10 min before estimated time) |
| MR-06 | No ticket priority / VIP / disability queue | Equity concern for public service | Stub `priority` field on ticket; full feature is Phase 2 |
| MR-07 | No definition of what happens when all windows close mid-queue | Stranded tickets | Add `branch_close` procedure: notify waiting citizens, auto-cancel remaining |
| MR-08 | No check-in mechanism specified | Booking ≠ physical arrival | Add manual check-in by citizen (button); staff check-in override for Phase 2 |
| MR-09 | No announcement/broadcast capability for branch | Branch closures or delays not communicable | Add `branch_announcements` entity for supervisor-posted messages |
| MR-10 | No definition of how queue numbers are formatted | Ambiguous "ticket number" display | Define format: `{ServiceCode}{DailySequence}` e.g., `NID-042` |

---

## 2.2 Ambiguities

| # | Ambiguity | Clarification Adopted |
|---|---|---|
| AM-01 | "Modify booking" — what can be changed? | Only service type if no other active booking; time is queue-based not time-slot |
| AM-02 | Can a citizen book multiple service types in one visit? | No — one active booking per citizen per day (MVP) |
| AM-03 | What does "called" mean vs "serving"? | Called = staff presses "Call Next"; Serving = citizen confirmed present (check-in or staff override) |
| AM-04 | Can staff re-call a skipped ticket? | Yes — supervisor permission required; creates audit log entry |
| AM-05 | Who can see reports? | Supervisor and Admin; Supervisor sees own branch, Admin sees all |
| AM-06 | Is AI prediction shown to unauthenticated guests? | Yes — public prediction for display board and guest view |
| AM-07 | What is a "queue slot" vs a "ticket"? | Slot = capacity allocation in the queue; Ticket = citizen's specific booking instance |

---

## 2.3 Operational Edge Cases

| # | Edge Case | Handling |
|---|---|---|
| EC-01 | All service windows close while citizens are waiting | System notifies all `waiting` tickets; branch supervisor must reopen windows or trigger close procedure |
| EC-02 | Citizen's turn arrives but app is closed (no connection) | Ticket enters `called` state; grace period timer starts; auto-skips to `no_show` after grace period |
| EC-03 | Staff accidentally marks wrong ticket as done | Audit log captures action; supervisor can revert for a configurable window (default: 5 min) |
| EC-04 | Two staff press "Call Next" simultaneously | Optimistic lock on queue engine; only one call succeeds, other returns conflict error |
| EC-05 | Citizen tries to book when daily capacity is reached | Booking rejected with `QUEUE_FULL` error; guest/citizen sees "No more slots today" |
| EC-06 | Branch announcement posted after citizens already booked | All booked citizens for the day receive in-app notification of announcement |
| EC-07 | Citizen checks in before window opens (very early arrival) | Check-in accepted but status stays `checked_in` (not `waiting`) until window opens |
| EC-08 | Network drops for staff during calling operation | Frontend retries with idempotency key; no double-calling |
| EC-09 | Admin deletes a service that has active bookings | Deletion blocked; must first close bookings or mark service inactive |
| EC-10 | Two citizens book simultaneously for last slot | Optimistic locking; one succeeds, other receives `SLOT_UNAVAILABLE` |

---

## 2.4 Governance and Audit Concerns

- All ticket state transitions must be logged in `ticket_status_history`
- All `no_show`, `skipped`, and `cancelled` actions by staff must include actor identity
- Admin role changes and user deactivations must be audit-logged
- Grace period overrides (supervisor re-calling skipped tickets) must be logged
- Daily capacity changes mid-day must be logged with timestamp and actor
- Configuration changes (queue rules) must be versioned in audit log

---

## 2.5 Usability Concerns

- Citizen booking flow must complete in ≤3 taps/clicks on mobile
- Ticket number must be visible in large text on citizen's home screen (no hunting)
- Staff calling interface must work reliably on a standard government-issue laptop
- Public display board must be legible from 5 meters (72pt+ font for ticket numbers)
- Arabic numerals vs Western numerals: use Western (0-9) for consistency in ticket numbers; localized in copy only

---

## 2.6 Reliability Concerns

- Queue engine operations must be ACID-compliant (no double assignment)
- SSE connections must auto-reconnect on drop
- Prediction service failure must degrade gracefully (show "N/A" not error page)
- All booking mutations must be idempotent (duplicate requests safe)

---

## 2.7 Refined Feature Set: MVP vs Phase 2

| Feature | MVP | Phase 2 |
|---|---|---|
| Phone-based citizen registration | ✅ | — |
| OTP authentication | Simplified (static/mock) | Real SMS OTP |
| Queue slot booking | ✅ | — |
| Booking modification | ✅ | — |
| Booking cancellation | ✅ | — |
| Queue position tracking (polling) | ✅ | — |
| Queue position tracking (SSE live) | ✅ (if time allows) | Guaranteed |
| Turn-approaching notifications (in-app) | ✅ | — |
| Turn-approaching notifications (SMS/push) | ❌ | ✅ |
| Counter staff calling interface | ✅ | — |
| Supervisor monitoring dashboard | ✅ | — |
| Basic reports | ✅ | — |
| Advanced analytics / trend charts | ❌ | ✅ |
| AI heuristic wait time prediction | ✅ | — |
| ML-trained prediction model | ❌ | ✅ |
| Public display board | ✅ | — |
| QR code check-in | ❌ | ✅ |
| Manual check-in by citizen | ✅ | — |
| Multi-branch management | ❌ | ✅ |
| Audit logging | ✅ | — |
| Branch announcements | ✅ | — |
| Configurable queue rules | ✅ | — |
| Priority / VIP queue | ❌ | ✅ |

---

## 2.8 Demo-Quality Optional Features (Wow Factors)

1. **Live congestion heatmap** — animated bar showing queue fill % for display board
2. **Predicted wait countdown** — live ticking countdown on citizen's tracking screen
3. **Branch announcement banner** — scrolling message on public display board
4. **"Book for Later Today" suggestion** — AI suggests a lower-congestion booking window
5. **Animated ticket call display** — smooth transition animations on public display board when new number is called

All five are achievable with minimal additional effort (CSS animations + existing data).

---

# SECTION 3: FULL SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

## 3.1 Introduction

### 3.1.1 Purpose
This SRS defines the functional and non-functional requirements for Lessa?! version 1.0 (MVP). It serves as the authoritative reference for design, development, testing, and acceptance validation by all team members.

### 3.1.2 Scope
Lessa?! is a web-based queue management platform for a single government service branch. It enables citizens to remotely book, track, and manage queue slots; enables counter staff to call and manage tickets; enables supervisors to monitor operations; and provides public visitors with live congestion data.

### 3.1.3 Definitions and Glossary

| Term | Definition |
|---|---|
| Branch | A single government service location with one or more service windows |
| Service | A specific transaction type offered at a branch (e.g., "National ID Renewal") |
| Window | A physical counter staffed by one employee, serving one service at a time |
| Queue Slot | A capacity unit in the daily queue for a service type |
| Ticket | A citizen's specific booking record with a unique queue number |
| Ticket Number | Formatted queue identifier: `{ServiceCode}-{DailySequence}` e.g., `NID-042` |
| Check-in | Action confirming a citizen's physical presence at the branch |
| Grace Period | Time after a ticket is `called` before it auto-transitions to `no_show` |
| Predicted Wait | AI-estimated time until a citizen's ticket will be called |
| SSE | Server-Sent Events — unidirectional real-time push from server to browser |
| RBAC | Role-Based Access Control |
| Audit Log | Immutable record of all critical system actions |
| No-Show | Ticket state when citizen fails to respond/arrive within grace period |
| Public Display Board | Unauthenticated large-screen view showing current/next ticket numbers |

---

## 3.2 Product Perspective

Lessa?! is a standalone web application for MVP. It consists of:
- A **React SPA frontend** (served via CDN or static hosting)
- A **Node.js/Express modular monolith backend** (REST API)
- A **PostgreSQL relational database**
- An optional **Redis cache** for queue state and session management

The system does not integrate with external government databases in MVP. It is deployable on any PaaS provider (Render, Railway, Fly.io) or a single Linux VPS.

---

## 3.3 User Classes and Characteristics

| User Class | Auth Required | Technical Proficiency | Access Interface |
|---|---|---|---|
| Guest | No | Low | Public web (mobile + desktop) |
| Citizen | Yes (phone) | Low–Medium | Mobile-first web app |
| Counter Staff | Yes | Medium | Desktop-optimized web app |
| Branch Supervisor | Yes | Medium | Desktop web app |
| System Admin | Yes | High | Admin dashboard web app |

---

## 3.4 Operating Environment

- **Client:** Modern web browser (Chrome 90+, Safari 14+, Firefox 88+, Edge 90+)
- **Mobile:** Responsive layout, touch-optimized; iOS Safari 14+, Android Chrome 90+
- **Server:** Node.js 20 LTS on Linux (Ubuntu 22.04+)
- **Database:** PostgreSQL 15+
- **Cache:** Redis 7+ (optional; fallback to in-memory for MVP)
- **Hosting:** Render, Railway, or single VPS; HTTPS required
- **RTL Support:** CSS logical properties; `dir="rtl"` attribute per locale

---

## 3.5 Functional Requirements

### Module FR-01: Authentication & Authorization

| ID | Requirement | Priority |
|---|---|---|
| FR-01-01 | System shall allow citizens to register with phone number and full name | Must |
| FR-01-02 | System shall support phone-based login with OTP (mocked/simplified for MVP) | Must |
| FR-01-03 | System shall issue JWT access tokens (15-min expiry) and refresh tokens (7-day expiry) | Must |
| FR-01-04 | System shall enforce RBAC for all protected endpoints | Must |
| FR-01-05 | System shall allow admins to assign roles to users | Must |
| FR-01-06 | System shall invalidate refresh tokens on logout | Must |
| FR-01-07 | System shall allow guests to access public endpoints without authentication | Must |
| FR-01-08 | System shall lock accounts after 5 consecutive failed login attempts for 30 minutes | Should |
| FR-01-09 | System shall log all authentication events (login, logout, failed attempts) | Must |

### Module FR-02: User Management

| ID | Requirement | Priority |
|---|---|---|
| FR-02-01 | Admin shall be able to create, update, deactivate, and delete users | Must |
| FR-02-02 | Admin shall be able to assign staff to windows | Must |
| FR-02-03 | Citizens shall be able to update their own profile (name only; phone requires re-verification) | Should |
| FR-02-04 | Admin shall be able to assign and revoke roles | Must |
| FR-02-05 | Deactivated users shall be denied login | Must |
| FR-02-06 | System shall prevent deletion of users with active tickets | Must |

### Module FR-03: Service Catalog

| ID | Requirement | Priority |
|---|---|---|
| FR-03-01 | Admin shall be able to create services with name (AR + EN), code, avg handling time, and daily capacity | Must |
| FR-03-02 | Admin shall be able to associate services with one or more windows | Must |
| FR-03-03 | Admin shall be able to deactivate a service (no new bookings; existing unaffected) | Must |
| FR-03-04 | System shall expose service list publicly (for guests and booking flow) | Must |
| FR-03-05 | Admin shall be able to set estimated average handling time per service | Must |
| FR-03-06 | System shall display service load (current queue length / daily capacity) for public view | Must |

### Module FR-04: Booking Management

| ID | Requirement | Priority |
|---|---|---|
| FR-04-01 | Authenticated citizens shall be able to book a queue slot for any active service | Must |
| FR-04-02 | System shall auto-assign a queue number on booking (format: `{ServiceCode}-{DailySequence}`) | Must |
| FR-04-03 | System shall enforce max one active booking per citizen per day | Must |
| FR-04-04 | System shall enforce booking only during branch operating hours | Must |
| FR-04-05 | System shall enforce daily capacity limits; reject bookings when full | Must |
| FR-04-06 | Citizens shall be able to cancel a booking subject to cancellation cutoff rules | Must |
| FR-04-07 | Citizens shall be able to change the service type of a booking (if no other active booking) | Should |
| FR-04-08 | On cancellation, system shall free the slot and allow re-booking by other citizens | Must |
| FR-04-09 | System shall send in-app notification on booking confirmation | Must |
| FR-04-10 | System shall prevent booking by deactivated users | Must |

### Module FR-05: Queue Engine

| ID | Requirement | Priority |
|---|---|---|
| FR-05-01 | Queue engine shall maintain an ordered list of tickets per service, sorted by booking time | Must |
| FR-05-02 | Queue engine shall atomically assign queue numbers to prevent duplicates | Must |
| FR-05-03 | Staff shall be able to call the next ticket for their assigned window | Must |
| FR-05-04 | When a ticket is called, system shall update ticket state to `called` and start grace period timer | Must |
| FR-05-05 | If citizen does not check in within grace period, ticket shall auto-transition to `no_show` | Must |
| FR-05-06 | Staff shall be able to manually mark a ticket as `done`, `skipped`, or `no_show` | Must |
| FR-05-07 | Staff shall be able to re-call a previously skipped ticket (with audit log entry) | Should |
| FR-05-08 | Queue engine shall recalculate positions for all waiting tickets after each state change | Must |
| FR-05-09 | System shall support concurrent-safe queue operations (optimistic locking) | Must |
| FR-05-10 | System shall expose current queue state for a service publicly (count, next number) | Must |

### Module FR-06: Ticket Tracking

| ID | Requirement | Priority |
|---|---|---|
| FR-06-01 | Citizens shall be able to view their current ticket status and position in queue | Must |
| FR-06-02 | System shall provide real-time or near-real-time queue position updates (SSE or polling ≤30s) | Must |
| FR-06-03 | System shall display predicted wait time on the citizen's ticket view | Must |
| FR-06-04 | System shall display estimated time of service on the citizen's ticket view | Should |
| FR-06-05 | Citizens shall be able to perform manual check-in from their ticket view | Must |
| FR-06-06 | Citizens shall receive an in-app notification when their ticket is `called` | Must |
| FR-06-07 | System shall show ticket status history to the citizen (timeline view) | Could |

### Module FR-07: Window Operations

| ID | Requirement | Priority |
|---|---|---|
| FR-07-01 | Supervisors shall be able to open and close windows | Must |
| FR-07-02 | Supervisors shall be able to assign staff members to windows | Must |
| FR-07-03 | Staff shall only see controls for their own assigned window | Must |
| FR-07-04 | System shall track each window's current serving ticket, daily transaction count, and avg handling time | Must |
| FR-07-05 | Staff shall be able to mark themselves as on break (window paused, no new calls) | Should |
| FR-07-06 | System shall display window status (open, closed, paused) in supervisor dashboard | Must |

### Module FR-08: Supervisor Monitoring

| ID | Requirement | Priority |
|---|---|---|
| FR-08-01 | Supervisor shall have a live dashboard showing all windows, their status, current ticket, and queue lengths | Must |
| FR-08-02 | Supervisor shall be able to see total tickets served, pending, and no-shows for the current day | Must |
| FR-08-03 | Supervisor shall be able to post branch announcements visible on the public display board | Must |
| FR-08-04 | Supervisor shall be able to override ticket states (e.g., re-call a skipped ticket) | Should |
| FR-08-05 | Supervisor shall be able to view per-window daily metrics | Should |

### Module FR-09: Notifications

| ID | Requirement | Priority |
|---|---|---|
| FR-09-01 | System shall create an in-app notification when a citizen's booking is confirmed | Must |
| FR-09-02 | System shall create an in-app notification when a citizen's ticket is called | Must |
| FR-09-03 | System shall create an in-app notification when a citizen's ticket is cancelled (by staff or system) | Must |
| FR-09-04 | System shall create a turn-approaching notification when N tickets remain ahead (configurable, default: 3) | Must |
| FR-09-05 | System shall create an in-app notification for branch announcements | Must |
| FR-09-06 | Citizens shall be able to mark notifications as read | Should |
| FR-09-07 | System shall not re-send the same notification type for the same ticket | Must |

### Module FR-10: Reports & Analytics

| ID | Requirement | Priority |
|---|---|---|
| FR-10-01 | System shall provide daily summary report: total tickets, served, no-shows, cancellations | Must |
| FR-10-02 | System shall provide average wait time per service per day | Must |
| FR-10-03 | System shall provide peak hours report (tickets per hour, configurable date range) | Must |
| FR-10-04 | System shall provide no-show and cancellation rate metrics | Must |
| FR-10-05 | System shall provide per-window performance metrics (transactions per day, avg handling time) | Should |
| FR-10-06 | Reports shall be filterable by service type and date range | Should |
| FR-10-07 | System shall record daily service metrics snapshots at end of day | Must |

### Module FR-11: Public Display Board

| ID | Requirement | Priority |
|---|---|---|
| FR-11-01 | System shall provide an unauthenticated public display page showing current serving ticket number per window | Must |
| FR-11-02 | Display board shall show the next ticket number in queue | Must |
| FR-11-03 | Display board shall show estimated wait time for a fresh booking | Must |
| FR-11-04 | Display board shall show current branch announcements | Must |
| FR-11-05 | Display board shall auto-refresh at least every 10 seconds | Must |
| FR-11-06 | Display board shall be optimized for large-screen rendering (72pt+ ticket numbers) | Must |

### Module FR-12: AI Wait Time Prediction

| ID | Requirement | Priority |
|---|---|---|
| FR-12-01 | System shall compute predicted wait time for any given queue position using heuristic model | Must |
| FR-12-02 | Prediction shall factor in: tickets ahead, avg handling time per service, active windows, historical throughput | Must |
| FR-12-03 | Prediction shall degrade gracefully if historical data is unavailable (use configured avg handling time only) | Must |
| FR-12-04 | Prediction shall be exposed via API for both authenticated and public consumers | Must |
| FR-12-05 | System shall periodically store prediction snapshots for accuracy auditing | Could |

### Module FR-13: Localization

| ID | Requirement | Priority |
|---|---|---|
| FR-13-01 | UI shall support Arabic (RTL) and English (LTR) languages | Must |
| FR-13-02 | Language preference shall be stored per user and per session for guests | Must |
| FR-13-03 | All system-generated notifications and messages shall be available in both languages | Must |
| FR-13-04 | Service names shall have Arabic and English variants stored separately | Must |
| FR-13-05 | Date/time formatting shall follow locale conventions (Gregorian calendar for MVP) | Should |

### Module FR-14: Audit Logging

| ID | Requirement | Priority |
|---|---|---|
| FR-14-01 | System shall create audit log entries for all ticket state transitions | Must |
| FR-14-02 | System shall log all authentication events | Must |
| FR-14-03 | System shall log all role assignments and revocations | Must |
| FR-14-04 | System shall log all service and window configuration changes | Must |
| FR-14-05 | System shall log supervisor override actions | Must |
| FR-14-06 | Audit logs shall be immutable (no update or delete operations) | Must |
| FR-14-07 | Audit logs shall store: actor_id, action, entity_type, entity_id, old_value, new_value, timestamp, ip_address | Must |

### Module FR-15: Administration

| ID | Requirement | Priority |
|---|---|---|
| FR-15-01 | Admin shall be able to configure queue rules: grace_period, cancellation_cutoff, max_active_bookings, turn_approaching_threshold | Must |
| FR-15-02 | Admin shall be able to configure branch operating hours | Must |
| FR-15-03 | Admin shall be able to view and search audit logs | Must |
| FR-15-04 | Admin shall be able to reset daily queue counters (for next day) | Must |
| FR-15-05 | Admin shall be able to manage branch announcements | Should |

---

## 3.6 Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Performance | API response time ≤500ms for 95th percentile under 100 concurrent users |
| NFR-02 | Performance | Public display board refresh ≤10 seconds |
| NFR-03 | Availability | System uptime ≥99.5% during branch operating hours |
| NFR-04 | Scalability | Architecture supports horizontal scaling post-MVP (stateless API layer) |
| NFR-05 | Security | All API endpoints require HTTPS |
| NFR-06 | Security | JWT tokens must be validated on every protected request |
| NFR-07 | Security | SQL injection and XSS protections must be applied at framework level |
| NFR-08 | Usability | Citizen booking flow completable in ≤3 steps on mobile |
| NFR-09 | Accessibility | Color contrast ratio ≥4.5:1; keyboard navigable |
| NFR-10 | Localization | RTL layout fully functional without layout breaks |
| NFR-11 | Reliability | Queue engine operations must be ACID-compliant |
| NFR-12 | Reliability | Duplicate booking prevention via database-level unique constraints |
| NFR-13 | Observability | Application logs (structured JSON) to stdout for PaaS log aggregation |
| NFR-14 | Data Retention | Audit logs retained for minimum 1 year |
| NFR-15 | Browser Support | Chrome 90+, Safari 14+, Firefox 88+, Edge 90+ |

---

## 3.7 External Interface Requirements

| Interface | Type | Description |
|---|---|---|
| Citizen Web App | Browser (React SPA) | Mobile-first responsive UI |
| Staff Web App | Browser (React SPA) | Desktop-optimized calling interface |
| Supervisor Dashboard | Browser (React SPA) | Live monitoring + reports |
| Admin Panel | Browser (React SPA) | Configuration + user management |
| Public Display Board | Browser (React SPA) | Large-screen unauthenticated view |
| REST API | JSON over HTTPS | All client-server communication |
| SSE Endpoint | Server-Sent Events | Real-time queue updates |
| PostgreSQL | TCP/IP | Primary data store |
| Redis | TCP/IP | Session cache + queue state (optional MVP) |

---

## 3.8 Business Rules

| BR-ID | Rule |
|---|---|
| BR-01 | A citizen may hold at most one active booking at any time |
| BR-02 | Bookings are only accepted during branch operating hours |
| BR-03 | A booking may only be cancelled before the cancellation cutoff time |
| BR-04 | A ticket in `called` state has a grace period; after grace period it becomes `no_show` |
| BR-05 | Queue numbers are unique per service per day and reset at midnight |
| BR-06 | A window may only call a ticket from a service it is assigned to |
| BR-07 | A staff member may only be assigned to one window at a time |
| BR-08 | Daily capacity is counted at booking time; cancellations free the slot |
| BR-09 | A service with active bookings cannot be deleted (only deactivated) |
| BR-10 | Admin and Supervisor roles may not be self-assigned (require existing admin) |

---

# SECTION 4: USER STORIES AND ACCEPTANCE CRITERIA

## Epic Structure

| Epic ID | Epic Name | Primary Persona |
|---|---|---|
| E-01 | Account & Authentication | Citizen, Admin |
| E-02 | Service Discovery | Guest, Citizen |
| E-03 | Queue Booking | Citizen |
| E-04 | Ticket Tracking | Citizen |
| E-05 | Staff Queue Operations | Counter Staff |
| E-06 | Supervisor Operations | Supervisor |
| E-07 | Notifications | Citizen |
| E-08 | Reporting & Analytics | Supervisor, Admin |
| E-09 | Public Display Board | Guest |
| E-10 | AI Prediction | Citizen, Guest |
| E-11 | Administration | Admin |
| E-12 | Audit & Compliance | Admin, Supervisor |

---

## Epic E-01: Account & Authentication

### US-001
| Field | Value |
|---|---|
| **Story ID** | US-001 |
| **Epic** | E-01 |
| **Persona** | Citizen |
| **User Story** | As a citizen, I want to register with my phone number and name so that I can book queue slots. |
| **Business Value** | Enables citizen self-service without requiring in-person registration |
| **Priority** | Must |
| **Acceptance Criteria** | 1. Registration form accepts phone number (E.164 format) and full name. 2. System sends OTP to phone (mocked for MVP: static code `123456`). 3. On OTP verification, account is created and JWT tokens are issued. 4. Duplicate phone numbers are rejected with error `PHONE_ALREADY_REGISTERED`. 5. Registration succeeds in ≤3 form steps. |
| **Dependencies** | None |
| **Notes** | OTP delivery is mocked for MVP; real SMS integration is Phase 2 |

### US-002
| Field | Value |
|---|---|
| **Story ID** | US-002 |
| **Epic** | E-01 |
| **Persona** | Citizen |
| **User Story** | As a citizen, I want to log in with my phone number so that I can access my bookings. |
| **Business Value** | Secure, friction-reduced authentication familiar to target users |
| **Priority** | Must |
| **Acceptance Criteria** | 1. Login requires phone number + OTP. 2. Valid credentials issue access + refresh tokens. 3. Tokens stored in HttpOnly cookies or secure localStorage. 4. Failed login increments attempt counter; 5 failures lock account for 30 min. 5. Successful login redirects to citizen home screen. |
| **Dependencies** | US-001 |
| **Notes** | JWT access token expiry = 15 min; refresh token = 7 days |

### US-003
| Field | Value |
|---|---|
| **Story ID** | US-003 |
| **Epic** | E-01 |
| **Persona** | Admin |
| **User Story** | As an admin, I want to create staff and supervisor accounts so that they can access the system with appropriate roles. |
| **Business Value** | Centralized user management; prevents unauthorized access |
| **Priority** | Must |
| **Acceptance Criteria** | 1. Admin can create users with name, phone, and role (staff, supervisor, admin). 2. Created user can log in immediately. 3. Role is enforced on all subsequent API requests. 4. Admin cannot assign a role higher than their own. 5. User creation is logged in audit log. |
| **Dependencies** | FR-01-05 |
| **Notes** | Admin initial seed account created via migration script |

---

## Epic E-02: Service Discovery

### US-010
| Field | Value |
|---|---|
| **Story ID** | US-010 |
| **Epic** | E-02 |
| **Persona** | Guest |
| **User Story** | As a guest, I want to see all available services and their current queue lengths so that I can decide whether to visit the branch today. |
| **Business Value** | Reduces unnecessary branch visits; drives adoption |
| **Priority** | Must |
| **Acceptance Criteria** | 1. Service list is visible without login. 2. Each service shows: name (localized), current queue length, daily capacity, and load % indicator. 3. Predicted wait time for a new booking is displayed per service. 4. List auto-refreshes every 60 seconds or on manual refresh. |
| **Dependencies** | FR-03-04, FR-12-01 |
| **Notes** | — |

---

## Epic E-03: Queue Booking

### US-020
| Field | Value |
|---|---|
| **Story ID** | US-020 |
| **Epic** | E-03 |
| **Persona** | Citizen |
| **User Story** | As a citizen, I want to book a queue slot for a specific service so that I can secure my place without going to the branch. |
| **Business Value** | Core platform value proposition |
| **Priority** | Must |
| **Acceptance Criteria** | 1. Citizen selects a service and confirms booking in ≤3 steps. 2. System assigns unique ticket number (e.g., `NID-042`). 3. Ticket confirmation screen shown immediately with number, position, and predicted wait. 4. Booking rejected if: daily capacity reached, citizen has active booking, outside operating hours. 5. In-app notification sent on confirmation. |
| **Dependencies** | US-001, FR-04 |
| **Notes** | Optimistic locking prevents race condition on last slot |

### US-021
| Field | Value |
|---|---|
| **Story ID** | US-021 |
| **Epic** | E-03 |
| **Persona** | Citizen |
| **User Story** | As a citizen, I want to cancel my booking before the cutoff time so that I can free the slot for others if my plans change. |
| **Business Value** | Reduces no-show rate; improves slot utilization |
| **Priority** | Must |
| **Acceptance Criteria** | 1. Citizen can cancel from ticket detail screen. 2. Cancellation is blocked after cancellation cutoff time (configurable, default 10 min). 3. On cancellation, ticket status becomes `cancelled`. 4. Slot is freed; daily available count increments. 5. In-app notification confirms cancellation. |
| **Dependencies** | US-020 |
| **Notes** | Cancellation cutoff uses predicted call time, not fixed clock time |

### US-022
| Field | Value |
|---|---|
| **Story ID** | US-022 |
| **Epic** | E-03 |
| **Persona** | Citizen |
| **User Story** | As a citizen, I want to modify my booking to a different service type so that I can change my mind without losing my queue position. |
| **Business Value** | Reduces cancellation + rebooking friction |
| **Priority** | Should |
| **Acceptance Criteria** | 1. Citizen can select "Change Service" from ticket screen. 2. New service must have available capacity. 3. Ticket number resets (new sequence for new service). 4. Old slot freed; new slot booked atomically. 5. Modification logged in ticket_status_history. |
| **Dependencies** | US-020 |
| **Notes** | Position in new queue is appended (end of queue), not preserved |

---

## Epic E-04: Ticket Tracking

### US-030
| Field | Value |
|---|---|
| **Story ID** | US-030 |
| **Epic** | E-04 |
| **Persona** | Citizen |
| **User Story** | As a citizen, I want to see my current queue position and predicted wait time so that I know when to head to the branch. |
| **Business Value** | Core real-time value; reduces branch crowding |
| **Priority** | Must |
| **Acceptance Criteria** | 1. Ticket screen shows: ticket number, current position, predicted wait time. 2. Position updates automatically (SSE or polling ≤30s). 3. If position is 1–3, "Head to branch now" message is shown. 4. Predicted wait is recalculated on each update. 5. Ticket status (e.g., `waiting`, `called`, `serving`) shown prominently. |
| **Dependencies** | US-020, FR-12-01 |
| **Notes** | — |

### US-031
| Field | Value |
|---|---|
| **Story ID** | US-031 |
| **Epic** | E-04 |
| **Persona** | Citizen |
| **User Story** | As a citizen, I want to check in when I arrive at the branch so that the system knows I am present. |
| **Business Value** | Reduces no-show false positives; activates grace period correctly |
| **Priority** | Must |
| **Acceptance Criteria** | 1. Check-in button visible on ticket screen when ticket is in `booked` or `waiting` state. 2. On check-in, ticket status transitions to `checked_in`. 3. Confirmation message shown. 4. Check-in is idempotent (pressing again shows "Already checked in"). |
| **Dependencies** | US-030 |
| **Notes** | Staff check-in override is Phase 2 |

---

## Epic E-05: Staff Queue Operations

### US-040
| Field | Value |
|---|---|
| **Story ID** | US-040 |
| **Epic** | E-05 |
| **Persona** | Counter Staff |
| **User Story** | As counter staff, I want to call the next ticket for my window so that I can begin serving the next citizen. |
| **Business Value** | Core staff workflow; drives queue progression |
| **Priority** | Must |
| **Acceptance Criteria** | 1. "Call Next" button prominent on staff interface. 2. Next ticket in queue (for staff's assigned service) is retrieved atomically. 3. Ticket status transitions to `called`; grace period timer starts. 4. Ticket number displayed prominently on staff screen and public display board. 5. Staff interface shows citizen name and ticket number. 6. If no tickets available, button shows "Queue Empty". |
| **Dependencies** | US-020, FR-07-03 |
| **Notes** | Optimistic lock prevents two staff from calling same ticket |

### US-041
| Field | Value |
|---|---|
| **Story ID** | US-041 |
| **Epic** | E-05 |
| **Persona** | Counter Staff |
| **User Story** | As counter staff, I want to mark a ticket as done, skipped, or no-show so that the queue progresses correctly. |
| **Business Value** | Accurate queue state; audit trail |
| **Priority** | Must |
| **Acceptance Criteria** | 1. After calling a ticket, staff sees options: Done, Skip, No-Show. 2. Selecting each transitions ticket to the respective terminal state. 3. All transitions logged in ticket_status_history with actor and timestamp. 4. Queue position of all `waiting` tickets recalculates immediately. |
| **Dependencies** | US-040 |
| **Notes** | `done` = citizen served successfully; `skipped` = staff decision (not citizen's fault); `no_show` = citizen didn't arrive |

---

## Epic E-06: Supervisor Operations

### US-050
| Field | Value |
|---|---|
| **Story ID** | US-050 |
| **Epic** | E-06 |
| **Persona** | Branch Supervisor |
| **User Story** | As a supervisor, I want a live dashboard of all windows so that I can monitor branch operations in real time. |
| **Business Value** | Operational visibility; proactive management |
| **Priority** | Must |
| **Acceptance Criteria** | 1. Dashboard shows all windows with status (open/closed/paused), current ticket being served, staff assigned, and transactions today. 2. Queue length per service visible. 3. Dashboard refreshes ≤15 seconds. 4. Summary row: total served, total waiting, total no-shows for the day. |
| **Dependencies** | FR-07, FR-08 |
| **Notes** | — |

### US-051
| Field | Value |
|---|---|
| **Story ID** | US-051 |
| **Epic** | E-06 |
| **Persona** | Branch Supervisor |
| **User Story** | As a supervisor, I want to post a branch announcement so that citizens and display board viewers are informed of delays or changes. |
| **Business Value** | Real-time communication; reduces citizen frustration |
| **Priority** | Must |
| **Acceptance Criteria** | 1. Supervisor can write and post an announcement (AR and EN text). 2. Announcement immediately visible on public display board. 3. In-app notification sent to all citizens with active tickets for the day. 4. Supervisor can deactivate/delete announcements. |
| **Dependencies** | FR-08-03 |
| **Notes** | — |

---

## Epic E-07: Notifications

### US-060
| Field | Value |
|---|---|
| **Story ID** | US-060 |
| **Epic** | E-07 |
| **Persona** | Citizen |
| **User Story** | As a citizen, I want to receive a notification when my turn is approaching so that I know to head to the branch. |
| **Business Value** | Reduces no-shows; improves citizen experience |
| **Priority** | Must |
| **Acceptance Criteria** | 1. Notification triggers when N tickets ahead (configurable, default: 3). 2. Notification includes: ticket number, current position, predicted wait. 3. Notification appears in notification bell in app UI. 4. Notification not re-sent if already sent for same threshold. |
| **Dependencies** | US-020, FR-09-04 |
| **Notes** | In-app only for MVP; SMS is Phase 2 |

---

## Epic E-08: Reporting & Analytics

### US-070
| Field | Value |
|---|---|
| **Story ID** | US-070 |
| **Epic** | E-08 |
| **Persona** | Supervisor |
| **User Story** | As a supervisor, I want to view a daily summary report so that I can understand branch performance. |
| **Business Value** | Data-driven management; accountability |
| **Priority** | Must |
| **Acceptance Criteria** | 1. Report shows: total bookings, total served, no-shows, cancellations for selected date. 2. Breakdown by service type. 3. Average wait time per service. 4. Peak hour chart (bookings per hour). 5. Date picker defaults to today. |
| **Dependencies** | FR-10 |
| **Notes** | — |

---

## Epic E-09: Public Display Board

### US-080
| Field | Value |
|---|---|
| **Story ID** | US-080 |
| **Epic** | E-09 |
| **Persona** | Guest |
| **User Story** | As a guest at the branch, I want to see the current ticket being served on a display board so that I know when my number is close. |
| **Business Value** | Physical branch experience improvement; reduces staff calls |
| **Priority** | Must |
| **Acceptance Criteria** | 1. Board shows current ticket number per window in large font (≥72pt). 2. Next ticket in queue also shown. 3. Branch announcement banner shown if active. 4. Auto-refreshes every 10 seconds. 5. Accessible without login. |
| **Dependencies** | FR-11 |
| **Notes** | — |

---

## Epic E-10: AI Prediction

### US-090
| Field | Value |
|---|---|
| **Story ID** | US-090 |
| **Epic** | E-10 |
| **Persona** | Citizen / Guest |
| **User Story** | As a citizen or guest, I want to see an AI-predicted wait time so that I can plan my visit intelligently. |
| **Business Value** | Key differentiator; improves decision-making |
| **Priority** | Must |
| **Acceptance Criteria** | 1. Predicted wait time displayed on: service list, ticket detail, public display board. 2. Prediction based on: tickets_ahead, avg_handling_time, active_windows, historical throughput. 3. If prediction fails, "Estimated: N/A" shown (no error). 4. Prediction visible to unauthenticated guests. 5. Prediction refreshes with queue state updates. |
| **Dependencies** | FR-12 |
| **Notes** | Heuristic formula; no ML model required for MVP |

---

## Epic E-11: Administration

### US-100
| Field | Value |
|---|---|
| **Story ID** | US-100 |
| **Epic** | E-11 |
| **Persona** | Admin |
| **User Story** | As an admin, I want to configure queue rules so that branch operations follow our policies. |
| **Business Value** | Operational flexibility without developer involvement |
| **Priority** | Must |
| **Acceptance Criteria** | 1. Admin can set: grace_period_minutes (1–60), cancellation_cutoff_minutes (0–120), max_active_bookings_per_citizen (1–5), turn_approaching_threshold (1–10). 2. Changes take effect immediately for new transactions. 3. Config changes logged in audit log. |
| **Dependencies** | FR-15-01 |
| **Notes** | — |

---

## Story Implementation Order (Suggested)

```
Sprint Order:
1. US-003 (Admin create users) → enables all staff
2. US-001, US-002 (Citizen auth)
3. US-010 (Service discovery)
4. US-020 (Booking)
5. US-040, US-041 (Staff operations)
6. US-030, US-031 (Ticket tracking)
7. US-050, US-051 (Supervisor dashboard)
8. US-060 (Notifications)
9. US-080 (Display board)
10. US-090 (AI prediction)
11. US-070 (Reports)
12. US-021, US-022 (Cancel/modify booking)
13. US-100 (Admin config)
```

---

# SECTION 5: USE CASES

## 5.1 Actor List

| Actor | Type | Description |
|---|---|---|
| Guest | Primary | Unauthenticated web visitor |
| Citizen | Primary | Registered and authenticated user |
| Counter Staff | Primary | Government employee serving at a window |
| Branch Supervisor | Primary | Manager overseeing branch operations |
| System Admin | Primary | Platform administrator |
| Queue Engine | System | Internal subsystem managing ticket state |
| Notification Service | System | Internal subsystem delivering notifications |
| Prediction Engine | System | AI subsystem computing wait times |
| Timer Service | System | Background process managing grace periods |

---

## 5.2 Use Case Catalog

| UC-ID | Use Case Name | Primary Actor |
|---|---|---|
| UC-01 | Register as Citizen | Citizen |
| UC-02 | Login | Citizen / Staff / Supervisor / Admin |
| UC-03 | Book Queue Slot | Citizen |
| UC-04 | Cancel Booking | Citizen |
| UC-05 | Track Queue Position | Citizen |
| UC-06 | Check In to Branch | Citizen |
| UC-07 | Call Next Ticket | Counter Staff |
| UC-08 | Mark Ticket Terminal State | Counter Staff |
| UC-09 | Monitor Branch Dashboard | Supervisor |
| UC-10 | Open / Close Window | Supervisor |
| UC-11 | Post Branch Announcement | Supervisor |
| UC-12 | View Daily Report | Supervisor / Admin |
| UC-13 | Configure Queue Rules | Admin |
| UC-14 | Manage Users | Admin |
| UC-15 | View Public Display Board | Guest / Citizen |
| UC-16 | View Predicted Wait Time | Guest / Citizen |
| UC-17 | Send Turn-Approaching Notification | Notification Service |
| UC-18 | Auto-Expire Ticket (No-Show) | Timer Service |

---

## 5.3 Detailed Use Case Descriptions

### UC-03: Book Queue Slot

| Field | Value |
|---|---|
| **Use Case ID** | UC-03 |
| **Name** | Book Queue Slot |
| **Primary Actor** | Citizen |
| **Supporting Actors** | Queue Engine, Notification Service, Prediction Engine |
| **Trigger** | Citizen selects a service and initiates booking |
| **Preconditions** | 1. Citizen is authenticated. 2. Branch is within operating hours. 3. At least one slot available for selected service. 4. Citizen has no other active booking. |
| **Postconditions** | 1. Ticket created with status `booked`. 2. Unique queue number assigned. 3. Booking confirmation notification sent. 4. Queue position and predicted wait computed. |

**Main Flow:**
1. Citizen navigates to Service List
2. Citizen selects desired service
3. System validates: operating hours, capacity, citizen's active bookings
4. System atomically increments daily sequence for service
5. System creates ticket record with status `booked`
6. Prediction Engine computes predicted wait for new position
7. System returns booking confirmation with ticket number and predicted wait
8. Notification Service sends booking confirmation notification
9. Citizen sees confirmation screen

**Alternate Flows:**
- **AF-01: Daily capacity reached** — Step 3: System returns `QUEUE_FULL` error; citizen sees "No more slots available today"
- **AF-02: Citizen has active booking** — Step 3: System returns `MAX_BOOKINGS_EXCEEDED`; citizen sees link to existing booking
- **AF-03: Outside operating hours** — Step 3: System returns `OUTSIDE_OPERATING_HOURS`; citizen sees branch hours

**Exception Flows:**
- **EF-01: Race condition on last slot** — Optimistic lock detects conflict; losing transaction receives `SLOT_UNAVAILABLE`
- **EF-02: Database error** — Transaction rolled back; citizen sees generic error; retry safe (idempotent)

**Business Rules Involved:** BR-01, BR-02, BR-05, BR-08

---

### UC-07: Call Next Ticket

| Field | Value |
|---|---|
| **Use Case ID** | UC-07 |
| **Name** | Call Next Ticket |
| **Primary Actor** | Counter Staff |
| **Supporting Actors** | Queue Engine, Notification Service, Timer Service, Public Display Board |
| **Trigger** | Staff clicks "Call Next" on their window interface |
| **Preconditions** | 1. Staff is authenticated and assigned to a window. 2. Window is open. 3. Staff's window is not currently serving a ticket. 4. At least one ticket in `waiting` or `checked_in` status for this window's service. |
| **Postconditions** | 1. Next ticket transitions to `called` state. 2. Grace period timer starts. 3. Ticket number shown on public display board for this window. 4. Citizen receives "Your turn" notification. 5. All other waiting tickets' queue positions recalculate. |

**Main Flow:**
1. Staff presses "Call Next"
2. Queue Engine acquires optimistic lock on next ticket for service
3. Ticket status transitions: `waiting`/`checked_in` → `called`
4. Ticket status history entry created
5. Timer Service schedules grace period expiry
6. Display Board updates for this window
7. Notification Service sends called notification to citizen
8. Staff interface shows: ticket number, citizen name, and action buttons (Done/Skip/No-Show)

**Alternate Flows:**
- **AF-01: No tickets in queue** — Step 2: Queue empty; staff sees "No waiting tickets"
- **AF-02: Staff calls while previous ticket still `called`** — System prompts staff to resolve current ticket first

**Exception Flows:**
- **EF-01: Concurrent call by two staff** — Lock prevents double call; second request receives `TICKET_ALREADY_CALLED`

**Business Rules Involved:** BR-06, BR-07, BR-04

---

### UC-08: Mark Ticket Terminal State

| Field | Value |
|---|---|
| **Use Case ID** | UC-08 |
| **Name** | Mark Ticket Terminal State |
| **Primary Actor** | Counter Staff |
| **Supporting Actors** | Queue Engine, Audit Logger |
| **Trigger** | Staff selects Done, Skip, or No-Show for the current ticket |
| **Preconditions** | 1. A ticket is in `called` or `serving` state for this window. 2. Staff is authenticated and assigned to this window. |
| **Postconditions** | 1. Ticket transitions to terminal state (`done`, `skipped`, or `no_show`). 2. Transition logged in ticket_status_history and audit_log. 3. Window becomes available for next call. 4. daily_service_metrics updated. |

**Main Flow:**
1. Staff selects terminal action (Done / Skip / No-Show)
2. System validates staff has authority over this ticket
3. Ticket status updated to terminal state
4. ticket_status_history entry created with actor, timestamp, reason code
5. audit_log entry created
6. daily_service_metrics updated (increment served/skipped/no_show count)
7. Staff interface resets to "Call Next" state

**Alternate Flows:**
- **AF-01: Skip** — Ticket goes to `skipped`; slot not returned to queue; supervisor may re-call
- **AF-02: No-Show** — Ticket goes to `no_show`; same as skip from queue perspective

**Business Rules Involved:** BR-04

---

### UC-18: Auto-Expire Ticket (No-Show)

| Field | Value |
|---|---|
| **Use Case ID** | UC-18 |
| **Name** | Auto-Expire Ticket (No-Show) |
| **Primary Actor** | Timer Service |
| **Supporting Actors** | Queue Engine, Notification Service |
| **Trigger** | Grace period timer expires for a ticket in `called` state |
| **Preconditions** | 1. Ticket is in `called` state. 2. Grace period has elapsed since `called` timestamp. |
| **Postconditions** | 1. Ticket transitions to `no_show`. 2. Notification sent to citizen (ticket expired). 3. Audit log entry created. 4. Window available for next call. |

**Main Flow:**
1. Timer Service triggers for ticket_id after grace_period_minutes
2. System checks ticket is still in `called` state (not already resolved)
3. If still `called`: ticket → `no_show`
4. ticket_status_history entry created
5. Notification sent to citizen
6. Window state reset if applicable

**Alternate Flows:**
- **AF-01: Citizen checked in before timer fires** — Ticket already in `serving` or `checked_in`; timer has no effect

**Business Rules Involved:** BR-04

---

# SECTION 6: ERD DESIGN SPECIFICATION

## 6.1 Entity Overview

```
Core Entities:
├── users
├── roles
├── user_roles
├── branches
├── branch_config
├── services
├── windows
├── service_windows
├── tickets
├── ticket_status_history
├── notifications
├── audit_logs
├── branch_announcements
├── prediction_snapshots
└── daily_service_metrics
```

---

## 6.2 Entity Definitions

### Entity: users

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK, DEFAULT gen_random_uuid() | |
| phone_number | VARCHAR(20) | UNIQUE, NOT NULL | E.164 format |
| full_name | VARCHAR(100) | NOT NULL | |
| full_name_ar | VARCHAR(100) | NULLABLE | Arabic name variant |
| language_preference | ENUM('ar','en') | NOT NULL, DEFAULT 'ar' | |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | |
| failed_login_attempts | INTEGER | NOT NULL, DEFAULT 0 | |
| locked_until | TIMESTAMPTZ | NULLABLE | NULL = not locked |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

---

### Entity: roles

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| name | ENUM | UNIQUE, NOT NULL | Values: `guest`, `citizen`, `staff`, `supervisor`, `admin` |
| description | TEXT | NULLABLE | |

*Assumption: Roles are seeded at migration time; not user-created.*

---

### Entity: user_roles

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| user_id | UUID | FK → users.id, NOT NULL | |
| role_id | UUID | FK → roles.id, NOT NULL | |
| branch_id | UUID | FK → branches.id, NULLABLE | Scopes role to a branch (staff/supervisor) |
| assigned_by | UUID | FK → users.id | Admin who assigned |
| assigned_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

*Unique constraint: (user_id, role_id, branch_id)*

---

### Entity: branches

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| name | VARCHAR(150) | NOT NULL | |
| name_ar | VARCHAR(150) | NOT NULL | |
| address | TEXT | NOT NULL | |
| address_ar | TEXT | NULLABLE | |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

*Note: MVP uses single branch; table exists for future multi-branch support.*

---

### Entity: branch_config

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| branch_id | UUID | FK → branches.id, UNIQUE, NOT NULL | |
| open_time | TIME | NOT NULL, DEFAULT '08:00' | |
| close_time | TIME | NOT NULL, DEFAULT '16:00' | |
| open_days | INTEGER[] | NOT NULL, DEFAULT '{1,2,3,4,7}' | ISO weekdays (1=Mon) |
| grace_period_minutes | INTEGER | NOT NULL, DEFAULT 5 | |
| cancellation_cutoff_minutes | INTEGER | NOT NULL, DEFAULT 10 | |
| max_active_bookings | INTEGER | NOT NULL, DEFAULT 1 | Per citizen per day |
| turn_approaching_threshold | INTEGER | NOT NULL, DEFAULT 3 | Tickets ahead for alert |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_by | UUID | FK → users.id | |

---

### Entity: services

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| branch_id | UUID | FK → branches.id, NOT NULL | |
| code | VARCHAR(10) | UNIQUE NOT NULL | e.g., `NID`, `PASSPORT` |
| name_en | VARCHAR(150) | NOT NULL | |
| name_ar | VARCHAR(150) | NOT NULL | |
| description_en | TEXT | NULLABLE | |
| description_ar | TEXT | NULLABLE | |
| avg_handling_time_minutes | INTEGER | NOT NULL, DEFAULT 5 | Used in prediction |
| daily_capacity | INTEGER | NOT NULL, DEFAULT 100 | |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

---

### Entity: windows

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| branch_id | UUID | FK → branches.id, NOT NULL | |
| window_number | INTEGER | NOT NULL | Display number (1, 2, 3...) |
| label | VARCHAR(50) | NULLABLE | e.g., "Window 1" |
| label_ar | VARCHAR(50) | NULLABLE | |
| status | ENUM | NOT NULL, DEFAULT 'closed' | Values: `open`, `closed`, `paused` |
| assigned_staff_id | UUID | FK → users.id, NULLABLE | Current staff assignment |
| opened_at | TIMESTAMPTZ | NULLABLE | |
| closed_at | TIMESTAMPTZ | NULLABLE | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

*Unique constraint: (branch_id, window_number)*

---

### Entity: service_windows

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| service_id | UUID | FK → services.id, NOT NULL | |
| window_id | UUID | FK → windows.id, NOT NULL | |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | |

*Unique constraint: (service_id, window_id)*
*Note: Enables many-to-many between services and windows.*

---

### Entity: tickets

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| branch_id | UUID | FK → branches.id, NOT NULL | Denormalized for query performance |
| service_id | UUID | FK → services.id, NOT NULL | |
| citizen_id | UUID | FK → users.id, NOT NULL | |
| window_id | UUID | FK → windows.id, NULLABLE | Set when called/serving |
| ticket_number | VARCHAR(20) | NOT NULL | Format: `{ServiceCode}-{DailySeq}` |
| daily_sequence | INTEGER | NOT NULL | Numeric part of ticket number |
| status | ENUM | NOT NULL, DEFAULT 'booked' | See status lifecycle below |
| queue_position | INTEGER | NULLABLE | Computed; position in current queue |
| booked_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| checked_in_at | TIMESTAMPTZ | NULLABLE | |
| called_at | TIMESTAMPTZ | NULLABLE | |
| served_at | TIMESTAMPTZ | NULLABLE | |
| completed_at | TIMESTAMPTZ | NULLABLE | Terminal state reached |
| grace_expires_at | TIMESTAMPTZ | NULLABLE | Set when status → called |
| serving_staff_id | UUID | FK → users.id, NULLABLE | |
| booking_date | DATE | NOT NULL, DEFAULT CURRENT_DATE | For daily sequence grouping |
| predicted_wait_minutes | INTEGER | NULLABLE | At time of booking |
| notes | TEXT | NULLABLE | Internal staff notes |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

*Unique constraint: (service_id, daily_sequence, booking_date)*
*Index: (service_id, booking_date, status) for queue queries*

**Ticket Status Lifecycle:**
```
booked → checked_in → waiting → called → serving → done (terminal)
                                       → skipped (terminal)
                                       → no_show (terminal)
booked → cancelled (terminal)
waiting → cancelled (terminal)
```

*Note: `waiting` is a computed/transition state after `checked_in` when the citizen is physically present. `booked` = remote booking; `checked_in` = citizen pressed check-in button; `waiting` = actively in physical queue; `called` = staff called number; `serving` = confirmed present (staff override or system); `done/skipped/no_show/cancelled` = terminal.*

---

### Entity: ticket_status_history

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| ticket_id | UUID | FK → tickets.id, NOT NULL | |
| from_status | ENUM | NULLABLE | NULL for initial insert |
| to_status | ENUM | NOT NULL | |
| changed_by | UUID | FK → users.id, NULLABLE | NULL for system transitions |
| changed_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| reason | VARCHAR(255) | NULLABLE | e.g., "Grace period expired" |
| metadata | JSONB | NULLABLE | Extra context |

*Index: (ticket_id, changed_at)*

---

### Entity: notifications

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| user_id | UUID | FK → users.id, NOT NULL | |
| ticket_id | UUID | FK → tickets.id, NULLABLE | Associated ticket |
| type | ENUM | NOT NULL | Values: `booking_confirmed`, `ticket_called`, `turn_approaching`, `booking_cancelled`, `announcement` |
| title_en | VARCHAR(200) | NOT NULL | |
| title_ar | VARCHAR(200) | NOT NULL | |
| body_en | TEXT | NOT NULL | |
| body_ar | TEXT | NOT NULL | |
| is_read | BOOLEAN | NOT NULL, DEFAULT FALSE | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| read_at | TIMESTAMPTZ | NULLABLE | |

*Unique constraint: (user_id, ticket_id, type) — prevents duplicate notification types per ticket*
*Index: (user_id, is_read, created_at)*

---

### Entity: audit_logs

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| actor_id | UUID | FK → users.id, NULLABLE | NULL = system action |
| action | VARCHAR(100) | NOT NULL | e.g., `TICKET_STATUS_CHANGED` |
| entity_type | VARCHAR(50) | NOT NULL | e.g., `ticket`, `user`, `service` |
| entity_id | UUID | NOT NULL | |
| old_value | JSONB | NULLABLE | Snapshot before change |
| new_value | JSONB | NULLABLE | Snapshot after change |
| ip_address | INET | NULLABLE | |
| user_agent | TEXT | NULLABLE | |
| metadata | JSONB | NULLABLE | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

*Note: No UPDATE or DELETE on this table. Append-only.*
*Index: (entity_type, entity_id), (actor_id), (created_at)*

---

### Entity: branch_announcements

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| branch_id | UUID | FK → branches.id, NOT NULL | |
| title_en | VARCHAR(200) | NOT NULL | |
| title_ar | VARCHAR(200) | NOT NULL | |
| body_en | TEXT | NULLABLE | |
| body_ar | TEXT | NULLABLE | |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | |
| priority | INTEGER | NOT NULL, DEFAULT 0 | Higher = shown first |
| created_by | UUID | FK → users.id, NOT NULL | |
| expires_at | TIMESTAMPTZ | NULLABLE | Auto-deactivate after time |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

---

### Entity: prediction_snapshots

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| service_id | UUID | FK → services.id, NOT NULL | |
| ticket_id | UUID | FK → tickets.id, NULLABLE | Associated citizen ticket |
| predicted_wait_minutes | FLOAT | NOT NULL | |
| actual_wait_minutes | FLOAT | NULLABLE | Filled on `called` |
| tickets_ahead | INTEGER | NOT NULL | |
| active_windows | INTEGER | NOT NULL | |
| avg_handling_time | FLOAT | NOT NULL | Used in formula |
| historical_factor | FLOAT | NOT NULL | Adjustment from history |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

*Purpose: Enables prediction accuracy auditing and model improvement over time.*

---

### Entity: daily_service_metrics

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | |
| branch_id | UUID | FK → branches.id, NOT NULL | |
| service_id | UUID | FK → services.id, NOT NULL | |
| metric_date | DATE | NOT NULL | |
| total_booked | INTEGER | NOT NULL, DEFAULT 0 | |
| total_served | INTEGER | NOT NULL, DEFAULT 0 | |
| total_no_show | INTEGER | NOT NULL, DEFAULT 0 | |
| total_cancelled | INTEGER | NOT NULL, DEFAULT 0 | |
| total_skipped | INTEGER | NOT NULL, DEFAULT 0 | |
| avg_wait_minutes | FLOAT | NULLABLE | |
| avg_handling_minutes | FLOAT | NULLABLE | |
| peak_hour | INTEGER | NULLABLE | Hour (0-23) with most bookings |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

*Unique constraint: (branch_id, service_id, metric_date)*

---

## 6.3 Relationship Summary

| Relationship | Cardinality | Notes |
|---|---|---|
| users → user_roles | 1:N | One user can have multiple roles |
| roles → user_roles | 1:N | |
| branches → services | 1:N | |
| branches → windows | 1:N | |
| branches → branch_config | 1:1 | |
| services ↔ windows | M:N via service_windows | |
| windows → tickets (current) | 1:N | Via window_id on ticket |
| users (citizen) → tickets | 1:N | One citizen, many tickets over time |
| services → tickets | 1:N | |
| tickets → ticket_status_history | 1:N | |
| users → notifications | 1:N | |
| tickets → notifications | 1:N | |
| branches → branch_announcements | 1:N | |
| services → daily_service_metrics | 1:N | Per date |
| tickets → prediction_snapshots | 1:N | Multiple predictions per ticket |

---

## 6.4 Normalization Notes

- `queue_position` on `tickets` is a **computed field** that should be calculated on read or cached in Redis, not persisted as a strict sequence. A materialized value is kept as a cache hint only.
- `booking_date` is denormalized onto `tickets` to enable efficient daily sequence scoping without date calculations at query time.
- `branch_id` is denormalized onto `tickets` for direct branch-level queries without joining through service.
- `daily_service_metrics` is a pre-aggregated snapshot table, populated by a nightly job or triggered at end-of-day close, to avoid expensive real-time aggregation on reports.

---

## 6.5 Future-Ready Considerations

- `branches` table exists but is scoped to MVP single branch
- `user_roles.branch_id` enables per-branch staff scoping in multi-branch Phase 2
- `prediction_snapshots` enables ML training data collection
- `services.code` used in ticket number formatting; stable and safe to reference in external systems
- All primary keys are UUIDs — safe for distributed systems in Phase 2


# SECTION 7: SYSTEM ARCHITECTURE DOCUMENT

## 7.1 Architecture Style

**Modular Monolith** — a single deployable unit organized into clearly separated internal modules with well-defined boundaries. Each module has its own service layer, route handlers, and business logic but shares the same database and process.

---

## 7.2 Rationale for Modular Monolith

| Factor | Reasoning |
|---|---|
| Team size (3) | Microservices overhead (API gateways, service discovery, distributed tracing) is disproportionate for 3 engineers |
| Delivery window (2 days) | Monolith eliminates deployment complexity, network partitions between services, and inter-service authentication |
| Database transactions | ACID queue operations are trivial in a monolith; distributed transactions across microservices add significant complexity |
| Demo quality | A single deploy URL is more reliable for demo than 5+ services that must all be running |
| Future path | Modules can be extracted into separate services post-MVP with minimal refactoring if clear boundaries are maintained |

---

## 7.3 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                       CLIENTS                           │
│  Citizen Web  │  Staff Web  │  Supervisor  │  Display   │
│  (React SPA)  │  (React SPA)│  (React SPA) │  Board     │
└───────────────┬─────────────┴──────────────┘────────────┘
                │  HTTPS / REST + SSE
┌───────────────▼────────────────────────────────────────┐
│              MODULAR MONOLITH (Node.js/Express)        │
│                                                        │
│  ┌──────────┐ ┌───────────┐ ┌───────────┐ ┌────────┐  │
│  │  Auth    │ │ Booking   │ │  Queue    │ │ Notif  │  │
│  │  Module  │ │  Module   │ │  Engine   │ │ Module │  │
│  └──────────┘ └───────────┘ └───────────┘ └────────┘  │
│  ┌──────────┐ ┌───────────┐ ┌───────────┐ ┌────────┐  │
│  │  User    │ │ Service   │ │ Report    │ │ Pred.  │  │
│  │  Module  │ │  Catalog  │ │  Module   │ │ Engine │  │
│  └──────────┘ └───────────┘ └───────────┘ └────────┘  │
│  ┌──────────┐ ┌───────────┐ ┌───────────┐             │
│  │  Window  │ │  Audit    │ │  Admin    │             │
│  │  Module  │ │  Module   │ │  Module   │             │
│  └──────────┘ └───────────┘ └───────────┘             │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │           Shared Infrastructure Layer           │  │
│  │  (DB Pool, Event Bus, Logger, Config, i18n)     │  │
│  └─────────────────────────────────────────────────┘  │
└────────────────────────┬───────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    PostgreSQL 15    Redis 7         File Logs
    (Primary store)  (Cache/Queue)   (stdout)
```

---

## 7.4 Frontend Application Structure

| App | Primary Users | Key Pages |
|---|---|---|
| Citizen App | Citizens | Home, Service List, Book Slot, My Ticket, Notifications |
| Staff App | Counter Staff | Window Dashboard, Call Next, Ticket Actions |
| Supervisor App | Supervisor | Branch Overview, Window Management, Reports, Announcements |
| Admin Panel | System Admin | User Management, Service Config, Queue Rules, Audit Logs |
| Public Display Board | Anyone (large screen) | Current/Next Tickets, Announcements |

*All five frontends are React components in the same repo, separated by routing and role-based rendering. A shared component library is used for consistency.*

---

## 7.5 Backend Module Breakdown

### Auth Module
- JWT generation, validation, refresh
- OTP send (mock) and verify
- Account lockout logic
- Middleware: `authenticate`, `authorize(roles[])`

### User Module
- CRUD for user profiles
- Role assignment/revocation
- Staff-window assignment

### Service Catalog Module
- Service CRUD
- Service-window mapping
- Public service list with queue stats

### Booking Module
- Create, modify, cancel ticket
- Business rule enforcement (operating hours, capacity, max bookings)
- Atomic daily sequence assignment

### Queue Engine Module
- Call next ticket
- Ticket state transitions
- Queue position calculation
- Grace period scheduling (timer events)
- Optimistic locking for concurrent operations

### Window Module
- Open/close/pause windows
- Staff assignment
- Window status aggregation

### Notification Module
- Create notifications
- SSE connection management (per-user channels)
- Turn-approaching trigger logic
- Announcement broadcast

### Prediction Engine Module
- Heuristic wait time computation
- Historical factor loading
- Snapshot recording (async)

### Report Module
- Daily summary aggregation
- Peak hour calculation
- Per-service and per-window metrics
- Date-range filtering

### Audit Module
- Append-only log writer
- Log query interface (admin only)

### Admin Module
- Branch config CRUD
- System configuration

### Public Module
- Unauthenticated endpoints for display board and public queue state

---

## 7.6 Database

**PostgreSQL 15** as the single source of truth.

- All queue operations use transactions with `SELECT ... FOR UPDATE` or application-level optimistic locking (version column)
- Connection pooling via `pg` (node-postgres) with pool size of 10–20
- Migrations managed by `drizzle-orm` or `node-pg-migrate`
- UUID v4 for all primary keys
- Indexes on high-frequency query patterns:
  - `tickets(service_id, booking_date, status)` — queue engine reads
  - `tickets(citizen_id, booking_date)` — citizen ticket lookups
  - `notifications(user_id, is_read)` — notification bell
  - `audit_logs(entity_type, entity_id)` — audit queries

---

## 7.7 Caching and Real-Time Strategy

### Redis (Optional MVP, Fallback to In-Memory)
- **Queue State Cache:** Current queue position counts per service, refreshed on each state change
- **Session Store:** Refresh token storage (alternative to DB)
- **SSE State:** Active SSE client registry per branch

### Server-Sent Events (SSE)
- Citizen connects to `/api/sse/queue/{serviceId}` after booking
- Server pushes events on any queue state change for that service:
  - `ticket_called` — when a ticket is called
  - `queue_updated` — queue position changes
  - `announcement` — new branch announcement
- SSE endpoint validates JWT token from query param or cookie
- Auto-reconnect handled by browser `EventSource` API
- Polling fallback: if SSE fails, client polls `/api/tickets/{id}/status` every 30 seconds

### Choosing SSE over WebSocket for MVP
SSE is simpler (HTTP/1.1 compatible, no handshake protocol, works through most proxies), unidirectional (server-to-client is all that's needed for queue updates), and natively reconnects in the browser. WebSocket is Phase 2 if bidirectional real-time becomes necessary.

---

## 7.8 Notification Strategy

**In-App (MVP):**
1. Events are emitted by Queue Engine / Booking Module internally
2. Notification Module creates a `notifications` DB record
3. If target user has an active SSE connection, event is pushed immediately
4. Otherwise, user sees notification in the notification bell on next app load
5. Unread count shown in header

**Turn-Approaching Trigger:**
- After each `ticket_called` event, Notification Module checks: for all `booked`/`waiting` tickets in the same service queue, if `queue_position <= turn_approaching_threshold`, send `turn_approaching` notification (if not already sent)

---

## 7.9 AI Prediction Engine Design

### Heuristic Formula

```
predicted_wait_minutes = (tickets_ahead × avg_handling_time_minutes) / max(active_windows, 1) × historical_factor
```

**Where:**
- `tickets_ahead` = count of tickets with status in (`booked`, `checked_in`, `waiting`, `called`) ahead in queue
- `avg_handling_time_minutes` = from `services.avg_handling_time_minutes`
- `active_windows` = count of windows currently `open` and assigned to this service
- `historical_factor` = today's `actual_avg_handling_time / configured_avg_handling_time` for the past 30 transactions (defaults to 1.0 if insufficient history)

**Example:** 8 tickets ahead, 5 min handling time, 2 open windows, factor = 1.1
→ `(8 × 5) / 2 × 1.1 = 22 minutes`

### Module Design
```javascript
// prediction.service.js
class PredictionEngine {
  async computeWaitTime(serviceId, ticketsAhead) {
    const service = await getService(serviceId);
    const activeWindows = await countActiveWindowsForService(serviceId);
    const historicalFactor = await getHistoricalFactor(serviceId);
    
    return Math.round(
      (ticketsAhead * service.avg_handling_time_minutes) 
      / Math.max(activeWindows, 1) 
      * historicalFactor
    );
  }
  
  async getHistoricalFactor(serviceId) {
    // Last 30 completed tickets: actual_time / configured_time
    const recent = await getRecentCompletedTickets(serviceId, 30);
    if (recent.length < 5) return 1.0; // insufficient data fallback
    const avgActual = mean(recent.map(t => t.actual_handling_minutes));
    const configured = recent[0].service_avg;
    return Math.min(Math.max(avgActual / configured, 0.5), 3.0); // clamp 0.5-3.0
  }
}
```

**Graceful Degradation:** If prediction throws an error, API returns `null` for `predicted_wait_minutes` and UI shows "Estimated: N/A".

---

## 7.10 Auth/RBAC Strategy

- **JWT access tokens** (15 min expiry) — stateless validation on every request
- **Refresh tokens** (7 day expiry) — stored in Redis or DB; single-use rotation
- **Role-based middleware:** `authorize(['supervisor', 'admin'])` checks decoded token roles
- **Branch scoping:** Staff/Supervisor roles include `branch_id` claim in token; enforced at service layer
- **No session storage** on server for access tokens (stateless)

```javascript
// Middleware example
const authorize = (roles) => (req, res, next) => {
  const { role, branch_id } = req.user; // from JWT
  if (!roles.includes(role)) return res.status(403).json({ error: 'FORBIDDEN' });
  if (role === 'staff' || role === 'supervisor') {
    req.branch_id = branch_id; // inject for downstream use
  }
  next();
};
```

---

## 7.11 Deployment Shape (MVP)

```
┌─────────────────────────────────────────────┐
│           Single PaaS Instance              │
│  (Render.com / Railway.app / Fly.io)        │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Node.js Process (Monolith)        │   │
│  │  Port 3000                         │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌──────────────┐  ┌────────────────────┐  │
│  │ PostgreSQL   │  │   Redis (optional) │  │
│  │ (Managed DB) │  │   (Render Redis)   │  │
│  └──────────────┘  └────────────────────┘  │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Static Frontend (CDN / same host) │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

- **Frontend:** Built as static assets, served from `/public` by Express or a separate CDN
- **Backend:** Single Express server with all routes
- **Database:** Managed PostgreSQL on Render or Railway
- **Environment:** `NODE_ENV=production`, secrets via env vars
- **Process management:** PM2 or PaaS native restart

---

## 7.12 Observability and Logging

- **Structured JSON logs** to stdout (picked up by PaaS log aggregation)
- Log levels: `error`, `warn`, `info`, `debug`
- Each request logged with: method, path, duration, status, user_id
- Queue Engine operations logged at `info` level with ticket_id, action, actor
- Errors include stack trace in development, sanitized in production
- Health check endpoint: `GET /health` returns `{ status: "ok", timestamp, version }`

---

## 7.13 Primary Workflow Descriptions

### Booking Flow (Text Sequence)
1. Citizen opens app → Service List loads (public API, no auth needed)
2. Citizen selects service → sees queue length + predicted wait
3. Citizen clicks "Book Now" → auth check → booking API called
4. Backend: validates operating hours, capacity, citizen's active bookings
5. Backend: atomic `SELECT MAX(daily_sequence)+1 FOR UPDATE` assigns next number
6. Backend: creates `ticket` record with status `booked`
7. Backend: triggers notification creation (booking_confirmed)
8. Backend: prediction engine computes wait time
9. Response: ticket number, position, predicted wait returned
10. Frontend: confirmation screen shown; SSE connection established

### Staff Calling Flow (Text Sequence)
1. Staff opens window interface → current window status shown
2. Staff clicks "Call Next"
3. Backend: Queue Engine queries next ticket (`checked_in` or `booked` in order)
4. Backend: optimistic lock acquired
5. Backend: ticket status → `called`; `called_at` set; grace timer scheduled
6. Backend: display board update published via SSE
7. Backend: citizen notification created (`ticket_called`)
8. Backend: response returned to staff with ticket details
9. Staff sees: ticket number, citizen name, action buttons
10. Timer service: if grace period elapses without resolution → auto-transition to `no_show`

---

## 7.14 Key Technical Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Language / Runtime | Node.js 20 + TypeScript | Team familiarity; fast iteration; strong ecosystem |
| Framework | Express.js | Minimal, flexible; no magic overhead |
| ORM | Drizzle ORM | Type-safe; fast; PostgreSQL-optimized |
| Frontend | React 18 + Vite | Fast build; team familiarity |
| State Management | Zustand + React Query | Lightweight; React Query handles SSE/polling gracefully |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI; RTL support via `dir` attribute |
| Real-time | SSE (not WebSocket) | Simpler; works through PaaS proxies |
| Auth | JWT (stateless) + refresh tokens | Scalable; no server-side session store needed |
| Queue locking | PostgreSQL `SELECT FOR UPDATE` | ACID; no external lock manager needed |
| Migrations | node-pg-migrate or Drizzle Migrate | Simple; version-controlled |

---

# SECTION 8: API DOCUMENTATION

## 8.1 API Conventions

| Convention | Value |
|---|---|
| Base URL | `https://api.lessa.app/api/v1` |
| Protocol | HTTPS only |
| Format | JSON (`Content-Type: application/json`) |
| Auth | Bearer JWT in `Authorization: Bearer {token}` header |
| Pagination | Cursor-based: `?cursor={id}&limit={n}` |
| Dates | ISO 8601 UTC: `2026-06-09T10:30:00Z` |
| Language | `Accept-Language: ar` or `en` header; defaults to `ar` |
| Errors | Structured JSON error object (see below) |
| Versioning | URI versioning: `/api/v1/` |

---

## 8.2 Error Format

```json
{
  "error": {
    "code": "QUEUE_FULL",
    "message": "No available slots for this service today.",
    "message_ar": "لا توجد خانات متاحة لهذه الخدمة اليوم.",
    "field": null,
    "details": {}
  }
}
```

**Standard Error Codes:**

| Code | HTTP Status | Description |
|---|---|---|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient role |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Request body validation failed |
| `QUEUE_FULL` | 409 | Daily capacity reached |
| `MAX_BOOKINGS_EXCEEDED` | 409 | Citizen has active booking |
| `OUTSIDE_OPERATING_HOURS` | 409 | Branch not open |
| `CANCELLATION_CUTOFF_PASSED` | 409 | Too late to cancel |
| `TICKET_ALREADY_CALLED` | 409 | Concurrent call conflict |
| `SLOT_UNAVAILABLE` | 409 | Race condition on last slot |
| `SERVICE_INACTIVE` | 409 | Service not accepting bookings |
| `PHONE_ALREADY_REGISTERED` | 409 | Duplicate phone on registration |
| `ACCOUNT_LOCKED` | 423 | Too many failed login attempts |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## 8.3 Pagination

```
GET /api/v1/audit-logs?cursor=eyJpZCI6IjEyMyJ9&limit=20

Response:
{
  "data": [...],
  "pagination": {
    "next_cursor": "eyJpZCI6IjE0MyJ9",
    "has_more": true,
    "limit": 20
  }
}
```

---

## 8.4 API Endpoints by Domain

---

### Domain: Auth

#### POST /api/v1/auth/register
**Purpose:** Register a new citizen account  
**Roles:** Public (unauthenticated)

**Request Body:**
```json
{
  "phone_number": "+201234567890",
  "full_name": "Ahmed Hassan",
  "full_name_ar": "أحمد حسن",
  "language_preference": "ar"
}
```

**Response 201:**
```json
{
  "message": "OTP sent to phone number.",
  "session_token": "otp-session-abc123"
}
```

**Validation:** phone_number required, E.164 format; full_name required, 2–100 chars; language_preference in ['ar','en']  
**Business Logic:** If phone already registered, return `PHONE_ALREADY_REGISTERED`. Mock OTP = `123456`.

---

#### POST /api/v1/auth/verify-otp
**Purpose:** Verify OTP and complete registration or login  
**Roles:** Public

**Request Body:**
```json
{
  "session_token": "otp-session-abc123",
  "otp_code": "123456"
}
```

**Response 200:**
```json
{
  "access_token": "eyJhbGci...",
  "refresh_token": "rt_abc123",
  "user": {
    "id": "uuid",
    "full_name": "Ahmed Hassan",
    "role": "citizen",
    "language_preference": "ar"
  }
}
```

---

#### POST /api/v1/auth/refresh
**Purpose:** Exchange refresh token for new access token  
**Roles:** Authenticated (any role)

**Request Body:**
```json
{ "refresh_token": "rt_abc123" }
```

**Response 200:**
```json
{
  "access_token": "eyJhbGci...",
  "refresh_token": "rt_newtoken"
}
```

**Business Logic:** Refresh token is single-use (rotated). Expired or already-used tokens return 401.

---

#### POST /api/v1/auth/logout
**Purpose:** Invalidate refresh token  
**Roles:** Authenticated

**Response 204:** No content

---

### Domain: Users

#### GET /api/v1/users
**Purpose:** List all users  
**Roles:** admin  
**Query:** `?role=staff&is_active=true&cursor=...&limit=20`

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "phone_number": "+201234567890",
      "full_name": "Ahmed Hassan",
      "roles": ["staff"],
      "is_active": true,
      "created_at": "2026-06-01T08:00:00Z"
    }
  ],
  "pagination": { "next_cursor": "...", "has_more": false, "limit": 20 }
}
```

---

#### POST /api/v1/users
**Purpose:** Create a staff/supervisor/admin user  
**Roles:** admin

**Request Body:**
```json
{
  "phone_number": "+201111111111",
  "full_name": "Sara Mohamed",
  "role": "staff",
  "branch_id": "uuid"
}
```

**Response 201:** User object

---

#### GET /api/v1/users/:id
**Purpose:** Get user by ID  
**Roles:** admin, or self (citizen viewing own profile)

---

#### PATCH /api/v1/users/:id
**Purpose:** Update user  
**Roles:** admin (any field), citizen (own name only)

---

#### DELETE /api/v1/users/:id
**Purpose:** Deactivate user (soft delete)  
**Roles:** admin  
**Business Logic:** Cannot delete user with active tickets. Sets `is_active = false`.

---

#### POST /api/v1/users/:id/roles
**Purpose:** Assign role to user  
**Roles:** admin

**Request Body:**
```json
{ "role": "supervisor", "branch_id": "uuid" }
```

---

#### DELETE /api/v1/users/:id/roles/:roleId
**Purpose:** Remove role from user  
**Roles:** admin

---

### Domain: Services

#### GET /api/v1/services
**Purpose:** List all active services with queue stats  
**Roles:** Public (unauthenticated)  
**Query:** `?branch_id=uuid`

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "code": "NID",
      "name": "National ID Renewal",
      "name_ar": "تجديد بطاقة الرقم القومي",
      "avg_handling_time_minutes": 5,
      "daily_capacity": 100,
      "current_queue_length": 23,
      "available_slots": 77,
      "load_percent": 23,
      "predicted_wait_minutes": 35,
      "is_active": true
    }
  ]
}
```

---

#### POST /api/v1/services
**Purpose:** Create a new service  
**Roles:** admin

**Request Body:**
```json
{
  "branch_id": "uuid",
  "code": "PASSPORT",
  "name_en": "Passport Renewal",
  "name_ar": "تجديد جواز السفر",
  "avg_handling_time_minutes": 8,
  "daily_capacity": 80
}
```

---

#### GET /api/v1/services/:id
**Purpose:** Get service details  
**Roles:** Public

---

#### PATCH /api/v1/services/:id
**Purpose:** Update service (including deactivate)  
**Roles:** admin  
**Business Logic:** Cannot delete if active bookings exist; use `is_active: false` instead.

---

#### POST /api/v1/services/:id/windows
**Purpose:** Assign service to a window  
**Roles:** admin, supervisor

**Request Body:**
```json
{ "window_id": "uuid" }
```

---

#### DELETE /api/v1/services/:id/windows/:windowId
**Purpose:** Remove service-window assignment  
**Roles:** admin, supervisor

---

### Domain: Branches

#### GET /api/v1/branches
**Purpose:** List branches  
**Roles:** Public

---

#### GET /api/v1/branches/:id
**Purpose:** Get branch details including config  
**Roles:** Public

**Response 200:**
```json
{
  "id": "uuid",
  "name": "Cairo Central Branch",
  "name_ar": "فرع القاهرة المركزي",
  "address": "12 Tahrir Square, Cairo",
  "config": {
    "open_time": "08:00",
    "close_time": "16:00",
    "grace_period_minutes": 5,
    "cancellation_cutoff_minutes": 10,
    "max_active_bookings": 1,
    "turn_approaching_threshold": 3
  }
}
```

---

#### PATCH /api/v1/branches/:id/config
**Purpose:** Update branch configuration  
**Roles:** admin

---

### Domain: Windows

#### GET /api/v1/windows
**Purpose:** List all windows with current status  
**Roles:** supervisor, admin, staff (own window), public (status only)  
**Query:** `?branch_id=uuid`

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "window_number": 1,
      "label": "Window 1",
      "label_ar": "نافذة ١",
      "status": "open",
      "assigned_staff": { "id": "uuid", "full_name": "Sara Mohamed" },
      "current_ticket": { "id": "uuid", "ticket_number": "NID-015" },
      "service": { "id": "uuid", "name": "National ID Renewal" },
      "transactions_today": 12
    }
  ]
}
```

---

#### PATCH /api/v1/windows/:id
**Purpose:** Update window (open, close, pause, assign staff)  
**Roles:** supervisor, admin

**Request Body:**
```json
{
  "status": "open",
  "assigned_staff_id": "uuid"
}
```

---

### Domain: Queue Slots / Tickets

#### POST /api/v1/tickets
**Purpose:** Book a new queue slot  
**Roles:** citizen

**Request Body:**
```json
{
  "service_id": "uuid"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "ticket_number": "NID-042",
  "daily_sequence": 42,
  "service": { "id": "uuid", "name": "National ID Renewal", "name_ar": "تجديد بطاقة الرقم القومي" },
  "status": "booked",
  "queue_position": 18,
  "predicted_wait_minutes": 45,
  "booked_at": "2026-06-09T09:15:00Z",
  "booking_date": "2026-06-09"
}
```

**Status Codes:** 201 Created, 409 (QUEUE_FULL, MAX_BOOKINGS_EXCEEDED, OUTSIDE_OPERATING_HOURS, SERVICE_INACTIVE)  
**Idempotency:** Include `Idempotency-Key: {uuid}` header; duplicate requests within 5 min return same response.

---

#### GET /api/v1/tickets/active
**Purpose:** Get citizen's current active ticket  
**Roles:** citizen

**Response 200:** Ticket object with current queue_position and predicted_wait_minutes, or `null` if no active ticket.

---

#### GET /api/v1/tickets/:id
**Purpose:** Get ticket by ID  
**Roles:** citizen (own), staff, supervisor, admin

**Response 200:**
```json
{
  "id": "uuid",
  "ticket_number": "NID-042",
  "status": "waiting",
  "queue_position": 5,
  "predicted_wait_minutes": 12,
  "citizen": { "id": "uuid", "full_name": "Ahmed Hassan" },
  "service": { "id": "uuid", "name": "National ID Renewal" },
  "booked_at": "2026-06-09T09:15:00Z",
  "checked_in_at": "2026-06-09T10:00:00Z",
  "status_history": [
    { "from": null, "to": "booked", "at": "2026-06-09T09:15:00Z" },
    { "from": "booked", "to": "checked_in", "at": "2026-06-09T10:00:00Z" }
  ]
}
```

---

#### PATCH /api/v1/tickets/:id
**Purpose:** Modify ticket (change service) or check in  
**Roles:** citizen (own ticket)

**Request Body (check-in):**
```json
{ "action": "check_in" }
```

**Request Body (change service):**
```json
{ "action": "change_service", "new_service_id": "uuid" }
```

---

#### DELETE /api/v1/tickets/:id
**Purpose:** Cancel a ticket  
**Roles:** citizen (own, before cutoff), admin (any)

**Response 200:**
```json
{ "message": "Ticket cancelled successfully.", "ticket_number": "NID-042" }
```

**Business Logic:** Checks cancellation cutoff. Frees daily_capacity slot. Creates notification.

---

#### GET /api/v1/tickets/:id/status
**Purpose:** Lightweight polling endpoint for queue position  
**Roles:** citizen (own), public (ticket_number only, no citizen details)  
**Note:** Intended for fallback polling when SSE is unavailable.

**Response 200:**
```json
{
  "ticket_id": "uuid",
  "ticket_number": "NID-042",
  "status": "waiting",
  "queue_position": 3,
  "predicted_wait_minutes": 8
}
```

---

### Domain: Queue Operations (Staff)

#### POST /api/v1/queue/call-next
**Purpose:** Call the next ticket for staff's assigned window  
**Roles:** staff

**Request Body:**
```json
{ "window_id": "uuid" }
```

**Response 200:**
```json
{
  "ticket": {
    "id": "uuid",
    "ticket_number": "NID-042",
    "citizen": { "id": "uuid", "full_name": "Ahmed Hassan" },
    "service": { "id": "uuid", "name": "National ID Renewal" },
    "booked_at": "2026-06-09T09:15:00Z",
    "queue_position": 1
  },
  "grace_expires_at": "2026-06-09T10:35:00Z"
}
```

**Status Codes:** 200 OK, 409 `TICKET_ALREADY_CALLED` (concurrent conflict), 204 (queue empty — returns `{ "ticket": null, "message": "Queue is empty" }`)

---

#### PATCH /api/v1/queue/tickets/:id/resolve
**Purpose:** Mark called/serving ticket as done, skipped, or no-show  
**Roles:** staff (own window), supervisor (any window), admin

**Request Body:**
```json
{
  "resolution": "done",
  "notes": "Optional staff note"
}
```

**Valid resolutions:** `done`, `skipped`, `no_show`

**Response 200:** Updated ticket object

---

#### POST /api/v1/queue/tickets/:id/recall
**Purpose:** Re-call a skipped ticket (supervisor override)  
**Roles:** supervisor, admin

**Response 200:** Ticket transitions back to `called`; audit log created.

---

### Domain: Notifications

#### GET /api/v1/notifications
**Purpose:** Get citizen's notifications  
**Roles:** citizen

**Query:** `?is_read=false&limit=20&cursor=...`

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "turn_approaching",
      "title": "Your turn is approaching!",
      "title_ar": "دورك اقترب!",
      "body": "You are 3 positions away. Ticket NID-042.",
      "body_ar": "أنت على بُعد 3 أرقام. تذكرة NID-042.",
      "is_read": false,
      "created_at": "2026-06-09T10:20:00Z",
      "ticket_id": "uuid"
    }
  ],
  "unread_count": 2,
  "pagination": { "next_cursor": "...", "has_more": false }
}
```

---

#### PATCH /api/v1/notifications/:id/read
**Purpose:** Mark notification as read  
**Roles:** citizen (own)

---

#### PATCH /api/v1/notifications/read-all
**Purpose:** Mark all notifications as read  
**Roles:** citizen

---

### Domain: Reports

#### GET /api/v1/reports/daily-summary
**Purpose:** Daily summary for a given date  
**Roles:** supervisor, admin  
**Query:** `?date=2026-06-09&service_id=uuid` (service_id optional)

**Response 200:**
```json
{
  "date": "2026-06-09",
  "branch_id": "uuid",
  "summary": {
    "total_booked": 145,
    "total_served": 112,
    "total_no_show": 18,
    "total_cancelled": 15,
    "avg_wait_minutes": 22.4,
    "avg_handling_minutes": 5.1
  },
  "by_service": [
    {
      "service_id": "uuid",
      "service_name": "National ID Renewal",
      "total_booked": 80,
      "total_served": 62,
      "total_no_show": 10,
      "avg_wait_minutes": 25.1
    }
  ]
}
```

---

#### GET /api/v1/reports/peak-hours
**Purpose:** Hourly booking/serving distribution  
**Roles:** supervisor, admin  
**Query:** `?date=2026-06-09&service_id=uuid`

**Response 200:**
```json
{
  "date": "2026-06-09",
  "hourly_data": [
    { "hour": 8, "booked": 18, "served": 14 },
    { "hour": 9, "booked": 32, "served": 28 },
    { "hour": 10, "booked": 41, "served": 30 }
  ]
}
```

---

#### GET /api/v1/reports/window-performance
**Purpose:** Per-window performance for a date  
**Roles:** supervisor, admin

**Response 200:**
```json
{
  "date": "2026-06-09",
  "windows": [
    {
      "window_id": "uuid",
      "window_number": 1,
      "staff_name": "Sara Mohamed",
      "total_served": 32,
      "total_skipped": 2,
      "avg_handling_minutes": 4.8,
      "open_duration_minutes": 450
    }
  ]
}
```

---

### Domain: Predictions

#### GET /api/v1/predictions/wait-time
**Purpose:** Get predicted wait for a service at current queue state  
**Roles:** Public (unauthenticated)  
**Query:** `?service_id=uuid&position=0` (position=0 means "new booking")

**Response 200:**
```json
{
  "service_id": "uuid",
  "tickets_ahead": 23,
  "active_windows": 2,
  "avg_handling_time_minutes": 5,
  "historical_factor": 1.1,
  "predicted_wait_minutes": 63,
  "computed_at": "2026-06-09T10:15:00Z"
}
```

---

### Domain: Public Display

#### GET /api/v1/public/display
**Purpose:** Display board data — current/next tickets per window + announcements  
**Roles:** Public (unauthenticated)  
**Query:** `?branch_id=uuid`

**Response 200:**
```json
{
  "branch": { "id": "uuid", "name": "Cairo Central Branch", "name_ar": "فرع القاهرة المركزي" },
  "windows": [
    {
      "window_number": 1,
      "label": "Window 1",
      "label_ar": "نافذة ١",
      "status": "open",
      "current_ticket": "NID-015",
      "next_ticket": "NID-016",
      "service_name": "National ID Renewal",
      "service_name_ar": "تجديد بطاقة الرقم القومي"
    }
  ],
  "announcements": [
    {
      "id": "uuid",
      "title": "System Maintenance",
      "title_ar": "صيانة النظام",
      "body": "Expect delays of 10-15 minutes due to system update.",
      "body_ar": "توقع تأخيرات من 10-15 دقيقة بسبب تحديث النظام."
    }
  ],
  "queue_summary": [
    {
      "service_id": "uuid",
      "service_name": "National ID Renewal",
      "waiting_count": 18,
      "predicted_wait_minutes": 45
    }
  ],
  "as_of": "2026-06-09T10:15:30Z"
}
```

---

### Domain: Admin

#### GET /api/v1/admin/audit-logs
**Purpose:** Query audit logs  
**Roles:** admin  
**Query:** `?entity_type=ticket&actor_id=uuid&from=2026-06-01&to=2026-06-09&cursor=...&limit=50`

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "actor": { "id": "uuid", "full_name": "Sara Mohamed" },
      "action": "TICKET_STATUS_CHANGED",
      "entity_type": "ticket",
      "entity_id": "uuid",
      "old_value": { "status": "called" },
      "new_value": { "status": "done" },
      "ip_address": "41.65.1.100",
      "created_at": "2026-06-09T10:22:00Z"
    }
  ],
  "pagination": { "next_cursor": "...", "has_more": true }
}
```

---

### SSE Endpoint

#### GET /api/v1/sse/queue/:serviceId
**Purpose:** Server-Sent Events stream for real-time queue updates  
**Auth:** JWT via query param `?token=...` (SSE cannot send custom headers in browser)  
**Response Headers:** `Content-Type: text/event-stream; Cache-Control: no-cache`

**Event Types:**

```
event: queue_updated
data: {"service_id":"uuid","queue_length":20,"next_ticket":"NID-043","as_of":"2026-06-09T10:15:30Z"}

event: ticket_called
data: {"ticket_number":"NID-042","window_number":1}

event: announcement
data: {"id":"uuid","title":"Delays expected","title_ar":"تأخيرات متوقعة","body":"..."}

event: heartbeat
data: {"ts":"2026-06-09T10:15:30Z"}
```

---

## 8.5 Key Webhook / Event Ideas (Post-MVP)

| Event | Trigger | Payload |
|---|---|---|
| `ticket.booked` | New ticket created | ticket_id, service_id, citizen_id |
| `ticket.called` | Staff calls next | ticket_id, window_id, grace_expires_at |
| `ticket.completed` | Any terminal state | ticket_id, resolution, handling_time |
| `queue.full` | Daily capacity reached | service_id, date |
| `branch.announced` | Announcement posted | announcement_id, branch_id |

---

# SECTION 9: SPRINT PLAN

## 9.1 Overall Delivery Strategy

**2-day hackathon sprint.** Goal: a fully demo-able MVP with real data, functional queue operations, and an AI prediction showcase. The strategy is to work in three parallel workstreams (Backend, Frontend, and Data/DevOps/AI) with integration checkpoints at end of Day 1 and mid-morning Day 2.

---

## 9.2 Assumptions

- Team of 3: one backend-heavy (BE), one frontend-heavy (FE), one full-stack/devops (FS)
- React + Node/Express + PostgreSQL tech stack agreed before Day 1
- Development environment (Node, Postgres, Redis) configured before Day 1 begins
- Repository initialized with monorepo structure; CI not required for MVP
- Demo environment (Render or Railway) accessible and tested before Day 1
- Seed data script will be pre-written before demos begin

---

## 9.3 Critical Path

```
DB Schema → Backend Auth → Backend Booking → Backend Queue Engine
  ↓                                              ↓
Frontend Shell → Citizen Flow → Staff Interface → Integration Test
                                                     ↓
                                              Supervisor + AI + Display Board
                                                     ↓
                                                Demo Rehearsal
```

---

## 9.4 Team Assignments

| Member | Role | Primary Responsibility |
|---|---|---|
| Engineer A (BE) | Backend | Auth, Booking Module, Queue Engine, Notifications, Queue Rules |
| Engineer B (FE) | Frontend | Citizen App, Staff Interface, Supervisor Dashboard |
| Engineer C (FS) | Full Stack + AI | DB migrations, Prediction Engine, Public Display Board, Reports, Seed Data, Deployment |

---

## 9.5 Day 1 Plan (Hours 1–12)

| Hour | Engineer A (BE) | Engineer B (FE) | Engineer C (FS) |
|---|---|---|---|
| 0–1 | **Kickoff:** Finalize tech stack, set up repo, branch strategy | Same | DB schema design + migration files |
| 1–3 | Auth module: register, OTP mock, JWT, RBAC middleware | React app scaffold: Vite + Tailwind + shadcn/ui, routing, i18n setup | Run migrations, seed: 1 branch, 3 services, 3 windows, 5 users (admin+2staff+supervisor+citizen) |
| 3–5 | Service Catalog API: CRUD + public list with queue stats | Citizen: Registration + Login screens | Prediction Engine: heuristic formula, prediction API endpoint |
| 5–6 | Booking Module: POST /tickets (atomic sequence, validations) | Citizen: Service List page (public) | Public Display Board: page + API endpoint |
| 6–7 | Queue Engine: call-next, resolve, grace period timer | Citizen: Booking flow + Ticket confirmation screen | SSE infrastructure setup |
| 7–8 | Notification Module: create notifications on state changes | Citizen: My Ticket + real-time position display | Connect SSE to Frontend |
| 8–9 | Window Module: open/close/pause, staff-window assignment | Staff Interface: Window dashboard + Call Next button | Deploy to Render/Railway; verify environment |
| 9–10 | Integration testing: booking → queue → call → resolve | Staff Interface: Done/Skip/No-Show actions | Supervisor Dashboard: live window grid |
| 10–11 | Bug fixes from integration testing | Notification bell + in-app notification list | Reports API: daily-summary, peak-hours |
| 11–12 | Cancellation + modification flow; cancellation cutoff | Supervisor: Reports page + Announcement form | Admin Panel: user management + queue rules config |

**Day 1 End-of-Day Checkpoint:** Core booking → queue → calling flow should be working end-to-end. All critical path stories complete.

---

## 9.6 Day 2 Plan (Hours 13–24)

| Hour | Engineer A (BE) | Engineer B (FE) | Engineer C (FS) |
|---|---|---|---|
| 13–14 | Bug fixes from Day 1 testing | Admin Panel: User creation + role assignment | Seed realistic demo data (100+ tickets across 2 hours) |
| 14–15 | Turn-approaching notification trigger | Public Display Board polish: large font, animations | Prediction snapshot storage (async) |
| 15–16 | Audit logging: complete coverage of all critical actions | Supervisor: Announcement posting + display | Historical factor computation from seeded data |
| 16–17 | End-to-end QA pass (all user flows, all roles) | Mobile responsiveness pass + RTL Arabic layout | QA: Arabic UI, RTL layout check, display board |
| 17–18 | Fix QA issues | Fix QA issues | Verify deployment; run load test (10 concurrent bookings) |
| 18–19 | **Demo Prep:** Prepare demo accounts, walk-through script | Demo polish: loading states, error messages, animations | Prepare demo video backup (screen recording) |
| 19–20 | Stretch: QR check-in mock or predicted wait countdown | Stretch: Animated ticket call display on display board | Stretch: Historical chart on reports page |
| 20–21 | Final demo rehearsal (all 3 together) | Final demo rehearsal | Final demo rehearsal |
| 21–24 | Buffer: remaining bugs, final deploy, presentation prep | Buffer | Buffer |

---

## 9.7 Must-Have / Should-Have / Stretch

| Priority | Feature | Owner |
|---|---|---|
| **Must** | Citizen registration + login | BE + FE |
| **Must** | Service list (public) | BE + FE |
| **Must** | Book a queue slot | BE + FE |
| **Must** | Staff: Call Next + resolve ticket | BE + FE |
| **Must** | Real-time ticket tracking (SSE or polling) | BE + FS + FE |
| **Must** | AI predicted wait time | FS |
| **Must** | Public display board | FS + FE |
| **Must** | Supervisor dashboard | FE + BE |
| **Must** | In-app notifications | BE + FE |
| **Must** | Arabic + English UI | FE |
| **Should** | Cancel/modify booking | BE + FE |
| **Should** | Turn-approaching notification | BE + FE |
| **Should** | Daily summary report | BE + FE |
| **Should** | Branch announcement | BE + FE |
| **Should** | Admin user management | BE + FE |
| **Should** | Audit logs (admin view) | BE + FE |
| **Could** | Predicted wait countdown animation | FE |
| **Could** | Animated display board transitions | FE |
| **Could** | Peak hours chart | FE |
| **Could** | Window performance report | BE |
| **Could** | Prediction snapshots + accuracy tracking | FS |

---

## 9.8 Risk Mitigation

| Risk | Mitigation |
|---|---|
| SSE too complex → use polling | Pre-decide: if SSE setup takes >1 hour, switch to 30-second polling |
| RTL layout breaks | Test Arabic UI at Hour 3 (not Hour 18); use CSS logical properties from the start |
| Queue race condition hard to debug | Write atomic DB query (SELECT FOR UPDATE) and test with 2 concurrent bookings early |
| Prediction gives nonsensical values | Clamp output to 0–240 minutes; show "N/A" if computation fails |
| Deploy fails on PaaS | Test deploy at end of Day 1; maintain fallback (localhost demo) |
| Seed data doesn't look realistic | Pre-write seed script before Day 1; use realistic Egyptian names, Arabic service names |

---

## 9.9 Testing Strategy

| Level | What | When |
|---|---|---|
| Unit | Prediction engine formula, ticket status transitions | Inline with dev; 30 min total |
| Integration | Booking flow end-to-end, concurrent booking (race condition), queue calling | End of Day 1 |
| Manual QA | All 5 user roles, both languages, mobile viewport | Day 2 Hours 16–17 |
| Load test | 10 concurrent bookings against last slot | Day 2 Hour 17 |
| Demo rehearsal | Full scenario walkthrough (all roles) | Day 2 Hours 20–21 |

---

## 9.10 Demo Preparation Checklist

- [ ] Admin account: `admin / phone: +201000000000`
- [ ] 2 counter staff accounts: `staff1`, `staff2`
- [ ] 1 supervisor account: `supervisor1`
- [ ] 5 citizen accounts: realistic Egyptian names, Arabic names stored
- [ ] 3 services seeded: National ID Renewal (NID), Passport Renewal (PASS), Birth Certificate (BC)
- [ ] 3 windows open and assigned to staff
- [ ] 50–80 tickets pre-created across services with mixed statuses (booked, waiting, done, no-show) for realistic queue appearance
- [ ] 5 tickets "in progress" (booked/waiting) for live demo
- [ ] Branch announcement pre-drafted for demo
- [ ] Arabic UI demo ready (switch to AR in demo)
- [ ] Display board open on second screen/tab
- [ ] Screen recording backup prepared
- [ ] Demo script printed/rehearsed

---

## 9.11 Seed / Demo Data Plan

```sql
-- Branch
INSERT INTO branches (id, name, name_ar, address) VALUES 
  ('branch-01', 'Cairo Central Branch', 'فرع القاهرة المركزي', '12 Tahrir Square, Cairo');

-- Services
INSERT INTO services (code, name_en, name_ar, avg_handling_time_minutes, daily_capacity, branch_id) VALUES
  ('NID', 'National ID Renewal', 'تجديد بطاقة الرقم القومي', 5, 100, 'branch-01'),
  ('PASS', 'Passport Services', 'خدمات جواز السفر', 8, 80, 'branch-01'),
  ('BC', 'Birth Certificate', 'شهادة الميلاد', 4, 60, 'branch-01');

-- 80 historical tickets (yesterday, status: done) for AI historical factor
-- 5 active tickets today (status: waiting) for live demo
-- 1 announcement: "System working normally. Thank you for your patience."
```

---

# SECTION 10: PROMPT PACK FOR DIAGRAMGPT

## Prompt A: Use Case Diagram

```
Create a formal UML Use Case Diagram for a web platform called "Lessa?! - Smart Government Queue Tracking Platform."

ACTORS (place on left and right edges):
- Guest (left edge)
- Citizen (left edge)
- Counter Staff (left edge)
- Branch Supervisor (left edge)
- System Admin (left edge)
- Queue Engine (right edge, system actor)
- Timer Service (right edge, system actor)
- Notification Service (right edge, system actor)

USE CASES (oval shapes in the system boundary rectangle labeled "Lessa?! System"):
Group 1 - Public / Citizen:
- View Live Queue Status
- View Predicted Wait Time
- Register Account
- Login
- Book Queue Slot
- Cancel Booking
- Modify Booking
- Track Ticket Position
- Check In to Branch
- View Notifications
- Mark Notification as Read

Group 2 - Staff:
- Call Next Ticket
- Mark Ticket as Done
- Mark Ticket as Skipped
- Mark Ticket as No-Show
- Re-call Skipped Ticket (supervised)

Group 3 - Supervisor:
- Monitor Branch Dashboard
- Open / Close Window
- Assign Staff to Window
- Post Branch Announcement
- View Daily Report
- Override Ticket State

Group 4 - Admin:
- Manage Users
- Assign Roles
- Configure Services
- Configure Queue Rules
- View Audit Logs
- Manage Branch Config

Group 5 - System Actors:
- Auto-Expire Ticket (No-Show) [Timer Service]
- Send Turn-Approaching Notification [Notification Service]
- Compute Wait Time Prediction [Queue Engine]
- Update Queue Positions [Queue Engine]

INCLUDE/EXTEND RELATIONSHIPS:
- Book Queue Slot <<includes>> Compute Wait Time Prediction
- Call Next Ticket <<includes>> Update Queue Positions
- Call Next Ticket <<includes>> Send Turn-Approaching Notification
- Auto-Expire Ticket <<extends>> Call Next Ticket
- Re-call Skipped Ticket <<extends>> Call Next Ticket

ACTOR ASSOCIATIONS:
- Guest: View Live Queue Status, View Predicted Wait Time
- Citizen: all Guest use cases + Register, Login, Book, Cancel, Modify, Track, Check In, View Notifications
- Counter Staff: Login, Call Next, Mark Done/Skipped/No-Show
- Supervisor: all Staff use cases + Monitor Dashboard, Open/Close Window, Assign Staff, Post Announcement, View Report, Override State
- Admin: all Supervisor use cases + Manage Users, Assign Roles, Configure Services, Configure Queue Rules, View Audit Logs, Manage Branch Config

STYLE: Professional UML style, clean white background, blue system boundary rectangle, actor stick figures in gray, use case ovals in light blue, include/extend dashed arrows labeled with <<include>> or <<extend>> stereotypes, connecting lines solid for associations. Layout: actors on far left column, system boundary in center, secondary system actors on far right.
```

---

## Prompt B: ER Diagram

```
Create a detailed Entity-Relationship (ER) Diagram for the "Lessa?!" government queue tracking platform database.

ENTITIES AND KEY ATTRIBUTES (use crow's foot notation, professional database diagram style):

1. users: id (PK, UUID), phone_number (UNIQUE), full_name, full_name_ar, language_preference, is_active, failed_login_attempts, locked_until, created_at

2. roles: id (PK, UUID), name (UNIQUE ENUM: guest, citizen, staff, supervisor, admin), description

3. user_roles: id (PK), user_id (FK→users), role_id (FK→roles), branch_id (FK→branches, nullable), assigned_by (FK→users), assigned_at
   [UNIQUE: user_id + role_id + branch_id]

4. branches: id (PK), name, name_ar, address, is_active, created_at

5. branch_config: id (PK), branch_id (FK→branches, UNIQUE 1:1), open_time, close_time, open_days[], grace_period_minutes, cancellation_cutoff_minutes, max_active_bookings, turn_approaching_threshold, updated_by (FK→users)

6. services: id (PK), branch_id (FK→branches), code (UNIQUE), name_en, name_ar, avg_handling_time_minutes, daily_capacity, is_active, created_at

7. windows: id (PK), branch_id (FK→branches), window_number, label, label_ar, status (ENUM: open, closed, paused), assigned_staff_id (FK→users, nullable), opened_at, closed_at

8. service_windows: id (PK), service_id (FK→services), window_id (FK→windows), is_active
   [UNIQUE: service_id + window_id]

9. tickets: id (PK), branch_id (FK→branches), service_id (FK→services), citizen_id (FK→users), window_id (FK→windows, nullable), ticket_number, daily_sequence, status (ENUM: booked, checked_in, waiting, called, serving, done, skipped, no_show, cancelled), queue_position (nullable), booked_at, checked_in_at, called_at, served_at, completed_at, grace_expires_at, serving_staff_id (FK→users, nullable), booking_date, predicted_wait_minutes
   [UNIQUE: service_id + daily_sequence + booking_date]

10. ticket_status_history: id (PK), ticket_id (FK→tickets), from_status (nullable), to_status, changed_by (FK→users, nullable), changed_at, reason, metadata (JSONB)

11. notifications: id (PK), user_id (FK→users), ticket_id (FK→tickets, nullable), type (ENUM: booking_confirmed, ticket_called, turn_approaching, booking_cancelled, announcement), title_en, title_ar, body_en, body_ar, is_read, created_at, read_at
    [UNIQUE: user_id + ticket_id + type]

12. audit_logs: id (PK), actor_id (FK→users, nullable), action, entity_type, entity_id (UUID), old_value (JSONB), new_value (JSONB), ip_address, created_at
    [APPEND ONLY - no update/delete]

13. branch_announcements: id (PK), branch_id (FK→branches), title_en, title_ar, body_en, body_ar, is_active, priority, created_by (FK→users), expires_at, created_at

14. prediction_snapshots: id (PK), service_id (FK→services), ticket_id (FK→tickets, nullable), predicted_wait_minutes, actual_wait_minutes (nullable), tickets_ahead, active_windows, avg_handling_time, historical_factor, created_at

15. daily_service_metrics: id (PK), branch_id (FK→branches), service_id (FK→services), metric_date (DATE), total_booked, total_served, total_no_show, total_cancelled, total_skipped, avg_wait_minutes, avg_handling_minutes, peak_hour
    [UNIQUE: branch_id + service_id + metric_date]

RELATIONSHIPS (crow's foot notation):
- users 1—<  user_roles  >—1 roles  (many-to-many via user_roles)
- branches 1—< services
- branches 1—< windows
- branches 1—1 branch_config
- services >—< windows  (many-to-many via service_windows)
- users (citizen) 1—< tickets
- services 1—< tickets
- windows 1—< tickets (nullable, set on calling)
- tickets 1—< ticket_status_history
- users 1—< notifications
- tickets 1—< notifications (nullable)
- branches 1—< branch_announcements
- services 1—< daily_service_metrics
- services 1—< prediction_snapshots
- tickets 1—< prediction_snapshots

STYLE: Professional database ER diagram using crow's foot notation. White background. Entity boxes with header (entity name in bold blue/dark header, attributes listed below). Primary keys underlined or marked with key icon. Foreign keys marked with FK. Lines use crow's foot notation: one-to-many (|—<) and one-to-one (|—|). Group entities logically: User/Auth group top-left, Branch/Service group top-right, Ticket/Queue group center, Reporting/Analytics group bottom-right, Notifications bottom-left.
```

---

## Prompt C: High-Level System Architecture Diagram

```
Create a professional system architecture diagram for "Lessa?!" — a modular monolith web platform.

LAYERS (top to bottom):

LAYER 1: CLIENTS (top row, 5 boxes with browser icons):
- Citizen Web App (React SPA) — mobile icon
- Staff Web App (React SPA) — desktop icon
- Supervisor Dashboard (React SPA) — desktop icon
- Admin Panel (React SPA) — desktop icon
- Public Display Board (React, large screen) — TV/monitor icon

LAYER 2: CONNECTIVITY (connecting arrows down):
- All clients connect via HTTPS / REST + SSE (labeled arrow)
- Arrow labeled "Bearer JWT Auth" for authenticated clients
- Arrow labeled "Public / No Auth" for Display Board and public endpoints

LAYER 3: MODULAR MONOLITH SERVER (large bordered rectangle, label: "Node.js Express Server — Modular Monolith"):
Inside, show 12 module boxes in a 3x4 grid:
Row 1: Auth Module | User Module | Service Catalog Module | Booking Module
Row 2: Queue Engine | Window Module | Notification Module | Prediction Engine
Row 3: Report Module | Audit Module | Admin Module | Public Module

Below all modules, show a horizontal band labeled: "Shared Infrastructure Layer: DB Pool | Event Bus | Logger | i18n | Config"

LAYER 4: DATA STORES (bottom row, 3 boxes):
- PostgreSQL 15 (cylinder icon, labeled "Primary Data Store — Tickets, Users, Services, Audit Logs")
- Redis 7 (cylinder icon, labeled "Cache / Queue State / SSE Registry")
- File Logs (document icon, labeled "Structured JSON → PaaS Log Aggregation")

CONNECTIONS from Server to Data Stores:
- Server → PostgreSQL: "pg (node-postgres) pool size 10-20"
- Server → Redis: "ioredis — queue cache, sessions"
- Server → Logs: "stdout (JSON)"

DEPLOYMENT BOX (wrap layers 3-4 in a dashed border labeled "Render.com / Railway.app PaaS"):

STYLE: Clean, professional tech architecture diagram. Color scheme: blue for client layer, dark gray for server, teal for data stores. Boxes have drop shadows. Arrows have directional labels. Horizontal layout for modules within the monolith box. Fonts: sans-serif. No decorative art — functional diagram only.
```

---

## Prompt D: Sequence Diagram — Citizen Booking Flow

```
Create a detailed UML sequence diagram for the "Book Queue Slot" flow in Lessa?!.

PARTICIPANTS (left to right):
1. Citizen Browser (actor, stick figure)
2. React SPA Frontend
3. Express API (Booking Module)
4. Queue Engine
5. Prediction Engine
6. PostgreSQL Database
7. Notification Module
8. SSE Service

SEQUENCE OF MESSAGES:

1. Citizen Browser → React SPA: "Tap 'Book Now' for National ID Renewal"
2. React SPA → Express API: POST /api/v1/tickets {service_id}  [Bearer JWT]
3. Express API → PostgreSQL: SELECT branch_config WHERE branch_id = ?  [check operating hours]
4. PostgreSQL → Express API: {open_time, close_time, grace_period, max_bookings}
5. Express API → PostgreSQL: SELECT COUNT(*) FROM tickets WHERE service_id = ? AND booking_date = today AND status NOT IN (cancelled)  [check capacity]
6. PostgreSQL → Express API: {count: 42, capacity: 100}
7. Express API → PostgreSQL: SELECT * FROM tickets WHERE citizen_id = ? AND booking_date = today AND status NOT IN (cancelled, done, no_show, skipped)  [check max active]
8. PostgreSQL → Express API: [] (no active booking)
9. Express API → PostgreSQL: BEGIN TRANSACTION; SELECT MAX(daily_sequence)+1 FROM tickets WHERE service_id = ? AND booking_date = today FOR UPDATE;
10. PostgreSQL → Express API: {next_sequence: 43}
11. Express API → Queue Engine: assignTicketNumber(serviceCode="NID", sequence=43)
12. Queue Engine → Express API: {ticket_number: "NID-043"}
13. Express API → PostgreSQL: INSERT INTO tickets (...) VALUES (...); COMMIT;
14. PostgreSQL → Express API: {ticket_id: uuid, created_at}
15. Express API → Prediction Engine: computeWaitTime(service_id, tickets_ahead=18)
16. Prediction Engine → PostgreSQL: SELECT active windows, historical factor
17. PostgreSQL → Prediction Engine: {active_windows: 2, avg_handling: 5, factor: 1.1}
18. Prediction Engine → Express API: {predicted_wait_minutes: 49}
19. Express API → Notification Module: createNotification(citizen_id, type="booking_confirmed", ticket)
20. Notification Module → PostgreSQL: INSERT INTO notifications (...)
21. Notification Module → SSE Service: broadcastToUser(citizen_id, {type: "booking_confirmed"})
22. SSE Service → React SPA: SSE event: booking_confirmed
23. Express API → React SPA: 201 {ticket_number: "NID-043", queue_position: 19, predicted_wait_minutes: 49}
24. React SPA → Citizen Browser: Show confirmation screen: "NID-043 | Position 19 | ~49 minutes"

NOTES (use sequence diagram notes/boxes):
- Note over steps 9-13: "ACID Transaction — prevents race condition"
- Note over steps 15-18: "Async post-booking; failure returns null, not error"
- Note over step 9: "SELECT FOR UPDATE prevents duplicate sequence numbers"

STYLE: Standard UML sequence diagram. Solid lifeline bars for each participant. Synchronous calls: solid arrow →. Return messages: dashed arrow -->. Activation boxes on lifelines during processing. Light blue fill for API participant. Yellow fill for database participants. Use alt/opt fragments where applicable. Clean, readable font (Arial or similar).
```

---

## Prompt E: Sequence Diagram — Staff Calling Next Ticket

```
Create a detailed UML sequence diagram for the "Call Next Ticket" flow in Lessa?!.

PARTICIPANTS (left to right):
1. Counter Staff Browser (actor, stick figure)
2. Staff React SPA
3. Express API (Queue Engine Module)
4. PostgreSQL Database
5. Timer Service (background process)
6. Notification Module
7. SSE Service
8. Citizen Browser (actor, stick figure)
9. Public Display Board

SEQUENCE:

1. Counter Staff Browser → Staff React SPA: "Click 'Call Next' button"
2. Staff React SPA → Express API: POST /api/v1/queue/call-next {window_id: "win-01"} [Bearer JWT, role: staff]
3. Express API → PostgreSQL: Validate staff assigned to window-01 and window is OPEN
4. PostgreSQL → Express API: {assigned: true, status: "open", service_id: "NID"}
5. Express API → PostgreSQL: SELECT id FROM tickets WHERE service_id = "NID" AND booking_date = today AND status IN ('checked_in', 'booked') ORDER BY daily_sequence ASC LIMIT 1 FOR UPDATE;
6. PostgreSQL → Express API: {ticket_id: "uuid", ticket_number: "NID-042", citizen_id: "cit-01", citizen_name: "Ahmed Hassan"}
7. Express API → PostgreSQL: UPDATE tickets SET status='called', called_at=NOW(), window_id='win-01', serving_staff_id='staff-01', grace_expires_at=NOW()+5min WHERE id='uuid'; INSERT INTO ticket_status_history (...);
8. PostgreSQL → Express API: {updated: 1}
9. Express API → Timer Service: scheduleGraceExpiry(ticket_id, grace_expires_at)
10. Timer Service → Express API: {scheduled: true} (async, non-blocking)
11. Express API → Notification Module: createNotification(citizen_id="cit-01", type="ticket_called", ticket)
12. Notification Module → PostgreSQL: INSERT INTO notifications
13. Notification Module → SSE Service: broadcastToUser("cit-01", {event: "ticket_called", ticket_number: "NID-042", window: 1})
14. SSE Service → Citizen Browser: SSE event: {ticket_number: "NID-042", window: 1, message: "Your turn! Please proceed to Window 1"}
15. Citizen Browser (auto): Display alert/banner "Your turn! Window 1"
16. Express API → SSE Service: broadcastToQueue("NID", {event: "queue_updated", next_ticket: "NID-043"})
17. SSE Service → Public Display Board: SSE event: {window: 1, current: "NID-042", next: "NID-043"}
18. Public Display Board (auto): Update display: "NOW SERVING: NID-042 at Window 1"
19. Express API → Staff React SPA: 200 {ticket: {id, ticket_number: "NID-042", citizen: {name: "Ahmed Hassan"}, grace_expires_at}, actions: ["done","skip","no_show"]}
20. Staff React SPA → Counter Staff Browser: Show "NID-042 — Ahmed Hassan | [Done] [Skip] [No-Show]"

PARALLEL FRAGMENT (after step 8, show as "par" block):
- Path A: Update display board (steps 16-18)
- Path B: Notify citizen (steps 11-15)

ALT FRAGMENT for step 5-6:
- Alt: Queue empty → PostgreSQL returns null → Express API returns 200 {ticket: null, message: "Queue is empty"} → Staff sees "No waiting tickets"

LOOP/TIMER FRAGMENT (separate box at bottom):
After grace_expires_at:
T1. Timer Service → Express API: graceExpired(ticket_id)
T2. Express API → PostgreSQL: Check ticket status still 'called'
T3. If still called: UPDATE tickets SET status='no_show', completed_at=NOW()
T4. Express API → Notification Module: createNotification(citizen_id, type="booking_cancelled", reason="no_show")
T5. Notification Module → SSE Service → Citizen Browser: "Your ticket has expired"

STYLE: Standard UML sequence diagram. Actor stick figures at both ends. Clear activation boxes. "par" and "alt" combined fragments labeled properly. Background: white. Participant boxes with color coding: Staff=blue, API=dark gray, DB=yellow, Notification=green, Citizen=orange, Display=purple. Clear readable arrow labels. Professional font.
```

---

# SECTION 11: OPENAPI YAML SKELETON

```yaml
openapi: 3.0.3
info:
  title: Lessa?! API
  description: Smart Government Queue Tracking Platform — MVP API
  version: 1.0.0
  contact:
    name: Lessa Team
servers:
  - url: https://api.lessa.app/api/v1
    description: Production

security:
  - BearerAuth: []

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Error:
      type: object
      properties:
        error:
          type: object
          properties:
            code: { type: string }
            message: { type: string }
            message_ar: { type: string }
            field: { type: string, nullable: true }

    Ticket:
      type: object
      properties:
        id: { type: string, format: uuid }
        ticket_number: { type: string, example: "NID-042" }
        daily_sequence: { type: integer }
        status:
          type: string
          enum: [booked, checked_in, waiting, called, serving, done, skipped, no_show, cancelled]
        queue_position: { type: integer, nullable: true }
        predicted_wait_minutes: { type: integer, nullable: true }
        booked_at: { type: string, format: date-time }
        service:
          type: object
          properties:
            id: { type: string, format: uuid }
            name: { type: string }
            name_ar: { type: string }

    Service:
      type: object
      properties:
        id: { type: string, format: uuid }
        code: { type: string, example: "NID" }
        name: { type: string }
        name_ar: { type: string }
        avg_handling_time_minutes: { type: integer }
        daily_capacity: { type: integer }
        current_queue_length: { type: integer }
        available_slots: { type: integer }
        load_percent: { type: number }
        predicted_wait_minutes: { type: integer, nullable: true }
        is_active: { type: boolean }

    Window:
      type: object
      properties:
        id: { type: string, format: uuid }
        window_number: { type: integer }
        label: { type: string }
        label_ar: { type: string }
        status:
          type: string
          enum: [open, closed, paused]
        assigned_staff:
          type: object
          nullable: true
          properties:
            id: { type: string, format: uuid }
            full_name: { type: string }
        current_ticket:
          type: object
          nullable: true
          properties:
            id: { type: string, format: uuid }
            ticket_number: { type: string }
        transactions_today: { type: integer }

    Notification:
      type: object
      properties:
        id: { type: string, format: uuid }
        type:
          type: string
          enum: [booking_confirmed, ticket_called, turn_approaching, booking_cancelled, announcement]
        title: { type: string }
        title_ar: { type: string }
        body: { type: string }
        body_ar: { type: string }
        is_read: { type: boolean }
        created_at: { type: string, format: date-time }
        ticket_id: { type: string, format: uuid, nullable: true }

    PaginationMeta:
      type: object
      properties:
        next_cursor: { type: string, nullable: true }
        has_more: { type: boolean }
        limit: { type: integer }

paths:
  /auth/register:
    post:
      tags: [Auth]
      summary: Register new citizen
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [phone_number, full_name]
              properties:
                phone_number: { type: string, example: "+201234567890" }
                full_name: { type: string }
                full_name_ar: { type: string }
                language_preference: { type: string, enum: [ar, en], default: ar }
      responses:
        '201':
          description: OTP sent
          content:
            application/json:
              schema:
                type: object
                properties:
                  message: { type: string }
                  session_token: { type: string }
        '409':
          description: Phone already registered
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Error' }

  /auth/verify-otp:
    post:
      tags: [Auth]
      summary: Verify OTP and receive tokens
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [session_token, otp_code]
              properties:
                session_token: { type: string }
                otp_code: { type: string, example: "123456" }
      responses:
        '200':
          description: Tokens issued
          content:
            application/json:
              schema:
                type: object
                properties:
                  access_token: { type: string }
                  refresh_token: { type: string }
                  user:
                    type: object
                    properties:
                      id: { type: string, format: uuid }
                      full_name: { type: string }
                      role: { type: string }
        '401':
          description: Invalid OTP

  /auth/refresh:
    post:
      tags: [Auth]
      summary: Refresh access token
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [refresh_token]
              properties:
                refresh_token: { type: string }
      responses:
        '200':
          description: New tokens issued

  /auth/logout:
    post:
      tags: [Auth]
      summary: Logout and invalidate refresh token
      responses:
        '204':
          description: Logged out

  /services:
    get:
      tags: [Services]
      summary: List all active services with queue stats
      security: []
      parameters:
        - in: query
          name: branch_id
          schema: { type: string, format: uuid }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items: { $ref: '#/components/schemas/Service' }
    post:
      tags: [Services]
      summary: Create a new service
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [branch_id, code, name_en, name_ar]
              properties:
                branch_id: { type: string, format: uuid }
                code: { type: string, maxLength: 10 }
                name_en: { type: string }
                name_ar: { type: string }
                avg_handling_time_minutes: { type: integer, default: 5 }
                daily_capacity: { type: integer, default: 100 }
      responses:
        '201':
          description: Service created

  /services/{id}:
    get:
      tags: [Services]
      summary: Get service by ID
      security: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string, format: uuid }
      responses:
        '200':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Service' }
    patch:
      tags: [Services]
      summary: Update service
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string, format: uuid }
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name_en: { type: string }
                name_ar: { type: string }
                avg_handling_time_minutes: { type: integer }
                daily_capacity: { type: integer }
                is_active: { type: boolean }
      responses:
        '200':
          description: Updated

  /tickets:
    post:
      tags: [Tickets]
      summary: Book a new queue slot
      parameters:
        - in: header
          name: Idempotency-Key
          schema: { type: string, format: uuid }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [service_id]
              properties:
                service_id: { type: string, format: uuid }
      responses:
        '201':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Ticket' }
        '409':
          description: Queue full, max bookings exceeded, outside operating hours
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Error' }

  /tickets/active:
    get:
      tags: [Tickets]
      summary: Get citizen's current active ticket
      responses:
        '200':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Ticket' }

  /tickets/{id}:
    get:
      tags: [Tickets]
      summary: Get ticket by ID
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string, format: uuid }
      responses:
        '200':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Ticket' }
    patch:
      tags: [Tickets]
      summary: Check in or change service
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string, format: uuid }
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [action]
              properties:
                action:
                  type: string
                  enum: [check_in, change_service]
                new_service_id: { type: string, format: uuid }
      responses:
        '200':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Ticket' }
    delete:
      tags: [Tickets]
      summary: Cancel ticket
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string, format: uuid }
      responses:
        '200':
          description: Cancelled
        '409':
          description: Cancellation cutoff passed

  /tickets/{id}/status:
    get:
      tags: [Tickets]
      summary: Lightweight status poll (SSE fallback)
      security: []
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string, format: uuid }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  ticket_number: { type: string }
                  status: { type: string }
                  queue_position: { type: integer, nullable: true }
                  predicted_wait_minutes: { type: integer, nullable: true }

  /queue/call-next:
    post:
      tags: [Queue Operations]
      summary: Call next ticket for a window
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [window_id]
              properties:
                window_id: { type: string, format: uuid }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  ticket: { $ref: '#/components/schemas/Ticket' }
                  grace_expires_at: { type: string, format: date-time }
        '409':
          description: Ticket already called (concurrent conflict)

  /queue/tickets/{id}/resolve:
    patch:
      tags: [Queue Operations]
      summary: Mark ticket as done, skipped, or no-show
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string, format: uuid }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [resolution]
              properties:
                resolution:
                  type: string
                  enum: [done, skipped, no_show]
                notes: { type: string }
      responses:
        '200':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Ticket' }

  /windows:
    get:
      tags: [Windows]
      summary: List windows with current status
      parameters:
        - in: query
          name: branch_id
          schema: { type: string, format: uuid }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items: { $ref: '#/components/schemas/Window' }

  /windows/{id}:
    patch:
      tags: [Windows]
      summary: Update window status or staff assignment
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string, format: uuid }
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                status:
                  type: string
                  enum: [open, closed, paused]
                assigned_staff_id: { type: string, format: uuid, nullable: true }
      responses:
        '200':
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Window' }

  /notifications:
    get:
      tags: [Notifications]
      summary: Get user's notifications
      parameters:
        - in: query
          name: is_read
          schema: { type: boolean }
        - in: query
          name: limit
          schema: { type: integer, default: 20 }
        - in: query
          name: cursor
          schema: { type: string }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items: { $ref: '#/components/schemas/Notification' }
                  unread_count: { type: integer }
                  pagination: { $ref: '#/components/schemas/PaginationMeta' }

  /notifications/{id}/read:
    patch:
      tags: [Notifications]
      summary: Mark notification as read
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string, format: uuid }
      responses:
        '200':
          description: Marked as read

  /predictions/wait-time:
    get:
      tags: [Predictions]
      summary: Get predicted wait time for a service
      security: []
      parameters:
        - in: query
          name: service_id
          required: true
          schema: { type: string, format: uuid }
        - in: query
          name: position
          schema: { type: integer, default: 0 }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  service_id: { type: string, format: uuid }
                  predicted_wait_minutes: { type: integer, nullable: true }
                  tickets_ahead: { type: integer }
                  active_windows: { type: integer }
                  historical_factor: { type: number }
                  computed_at: { type: string, format: date-time }

  /public/display:
    get:
      tags: [Public]
      summary: Public display board data
      security: []
      parameters:
        - in: query
          name: branch_id
          required: true
          schema: { type: string, format: uuid }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  branch:
                    type: object
                    properties:
                      id: { type: string }
                      name: { type: string }
                      name_ar: { type: string }
                  windows:
                    type: array
                    items: { $ref: '#/components/schemas/Window' }
                  announcements:
                    type: array
                    items:
                      type: object
                      properties:
                        title: { type: string }
                        title_ar: { type: string }
                        body: { type: string }
                  queue_summary:
                    type: array
                    items:
                      type: object
                      properties:
                        service_name: { type: string }
                        waiting_count: { type: integer }
                        predicted_wait_minutes: { type: integer, nullable: true }
                  as_of: { type: string, format: date-time }

  /reports/daily-summary:
    get:
      tags: [Reports]
      summary: Daily summary report
      parameters:
        - in: query
          name: date
          schema: { type: string, format: date, example: "2026-06-09" }
        - in: query
          name: service_id
          schema: { type: string, format: uuid }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  date: { type: string }
                  summary:
                    type: object
                    properties:
                      total_booked: { type: integer }
                      total_served: { type: integer }
                      total_no_show: { type: integer }
                      total_cancelled: { type: integer }
                      avg_wait_minutes: { type: number }
                  by_service:
                    type: array
                    items:
                      type: object

  /reports/peak-hours:
    get:
      tags: [Reports]
      summary: Peak hours distribution
      parameters:
        - in: query
          name: date
          schema: { type: string, format: date }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  hourly_data:
                    type: array
                    items:
                      type: object
                      properties:
                        hour: { type: integer }
                        booked: { type: integer }
                        served: { type: integer }

  /admin/audit-logs:
    get:
      tags: [Admin]
      summary: Query audit logs
      parameters:
        - in: query
          name: entity_type
          schema: { type: string }
        - in: query
          name: actor_id
          schema: { type: string, format: uuid }
        - in: query
          name: from
          schema: { type: string, format: date }
        - in: query
          name: to
          schema: { type: string, format: date }
        - in: query
          name: limit
          schema: { type: integer, default: 50 }
        - in: query
          name: cursor
          schema: { type: string }
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      type: object
                  pagination: { $ref: '#/components/schemas/PaginationMeta' }

  /sse/queue/{serviceId}:
    get:
      tags: [Real-Time]
      summary: SSE stream for queue updates
      description: |
        Server-Sent Events endpoint. Pass JWT as query param: ?token=...
        Events: queue_updated, ticket_called, announcement, heartbeat
      parameters:
        - in: path
          name: serviceId
          required: true
          schema: { type: string, format: uuid }
        - in: query
          name: token
          required: true
          schema: { type: string }
      responses:
        '200':
          description: SSE stream
          content:
            text/event-stream:
              schema:
                type: string
```

---

# SECTION 12: FINAL REVIEW SECTION

## 12.1 Consistency Check Notes

| Area | Status | Notes |
|---|---|---|
| Ticket lifecycle states | ✅ Consistent | States defined in SRS, ERD, API, and use cases all match: `booked → checked_in → waiting → called → serving → done/skipped/no_show/cancelled` |
| Role permissions | ✅ Consistent | Every API endpoint specifies allowed roles; matches RBAC module in SRS |
| Ticket number format | ✅ Consistent | `{ServiceCode}-{DailySequence}` used everywhere; daily_sequence is per-service per-day |
| Prediction formula | ✅ Consistent | Formula defined in Architecture (7.9) matches API response structure; graceful null on failure |
| Cancellation cutoff rule | ✅ Consistent | Business rule BR-03, FR-04-06, US-021, and API all reference configurable `cancellation_cutoff_minutes` |
| Daily capacity | ✅ Consistent | Stored on services.daily_capacity; checked in booking module; freed on cancellation |
| Grace period | ✅ Consistent | Stored on branch_config; applied in Queue Engine and UC-18 (Timer) |
| Notification types | ✅ Consistent | ENUM in ERD matches notification module triggers and API response |
| SSE event names | ✅ Consistent | `queue_updated`, `ticket_called`, `announcement`, `heartbeat` used in Architecture, API, and Diagrams |
| Bilingual fields | ✅ Consistent | All user-facing entities have `_en` and `_ar` variants; branch_config.language_preference drives display |
| Audit log immutability | ✅ Consistent | Stated in SRS (FR-14-06), ERD (append-only note), and implementation note |

---

## 12.2 Top Unresolved Decisions

| # | Decision | Options | Recommendation |
|---|---|---|---|
| UD-01 | Real OTP provider for production | Twilio, AWS SNS, Vonage, local mock | Use mock for MVP; abstract behind `OtpService` interface for easy swap |
| UD-02 | SSE vs polling default | SSE (more complexity), polling every 30s (simpler) | Start with polling; add SSE as stretch; make configurable |
| UD-03 | Redis required or optional? | Required (better performance), Optional (in-memory fallback) | Optional for MVP; use in-memory JS Maps for queue state if Redis unavailable |
| UD-04 | Frontend monorepo structure | Single React app with route-based roles, or separate apps | Single app with role-based routing (faster to build) |
| UD-05 | Grace period auto-expiry mechanism | PostgreSQL cron job, Node.js setTimeout, BullMQ, pg-boss | Node.js setTimeout for MVP (simple); pg-boss or BullMQ for production |
| UD-06 | Ticket check-in requirement | Mandatory (no check-in = no `waiting` state), Optional | Optional check-in for MVP; `booked` transitions directly to `waiting` on position recalc |
| UD-07 | Queue position recalculation | Real-time on every state change, periodic, or lazy on read | Lazy on read + cache in Redis or JS Map; avoids N queries on every state change |
| UD-08 | Display board refresh mechanism | SSE, polling every 10s, WebSocket | SSE for display board (simpler consumer, just HTML + EventSource) |

---

## 12.3 Recommended Defaults for Unresolved Items

| Decision | Recommended Default | Reasoning |
|---|---|---|
| UD-01 OTP | Mock: static code `123456`, stored in env | Zero cost, zero complexity, demoable |
| UD-02 Real-time | Start with polling (30s); add SSE for display board | Display board SSE is low risk; citizen polling is good enough |
| UD-03 Redis | Optional; use JS Map in-memory for queue state | For single-server MVP with <200 concurrent users, JS Map is fine |
| UD-04 Frontend | Single React app, role-based routing + layouts | Fastest to build; shared component library |
| UD-05 Grace timer | `setTimeout` + DB update for MVP | Simple; replace with pg-boss post-MVP |
| UD-06 Check-in | Optional check-in; `booked` → `waiting` at position recalc | Reduces citizen friction; check-in is still available but not required |
| UD-07 Queue position | Lazy calculation on read; cache in memory per service | Avoids DB hammering; acceptable for MVP scale |
| UD-08 Display board | SSE from same endpoint as citizen tracking | Reuses SSE infrastructure; display board listens to all windows |

---

## 12.4 Implementation Advice: From Documentation to Coding

### Start Here (Hour 0)
1. Initialize a monorepo: `apps/frontend`, `apps/backend`, `packages/shared-types`
2. Backend: Express + TypeScript + Drizzle ORM + node-postgres
3. Frontend: Vite + React 18 + TypeScript + Tailwind + shadcn/ui
4. Run DB migrations first — schema is the foundation everything else depends on

### Critical Implementation Order
```
1. DB migrations (schema only, no data)
2. Shared types package (TypeScript interfaces for Ticket, User, Service, etc.)
3. Auth module (JWT middleware first — every other route needs it)
4. Service catalog API + frontend service list (unblocks FE work)
5. Booking module (most complex business logic — do this early while energy is high)
6. Queue engine (call-next + resolve — test concurrency with 2 browser tabs)
7. Staff UI + Citizen tracking UI (parallel work possible after step 5-6)
8. Notifications (add after core queue works — don't block on this)
9. Prediction engine (lightweight, add after booking works)
10. Display board (last, as it consumes existing APIs)
11. Supervisor dashboard + Reports
12. Admin panel
```

### Watch Out For
- **Ticket state machine:** Write a `transitionTicket(from, to, actorId, reason)` function that enforces valid transitions and creates history records atomically. Never update status without this function.
- **Daily sequence atomicity:** Use `SELECT MAX(daily_sequence)+1 FROM tickets WHERE service_id=? AND booking_date=today FOR UPDATE` inside a transaction. This is the most critical concurrency point.
- **RTL testing:** Test Arabic layout at Hour 3, not Hour 20. Use `document.dir = 'rtl'` toggle in dev mode.
- **Seed data quality:** Poor seed data makes the AI prediction look broken. Seed at least 30 completed tickets with realistic handling times before demoing the prediction.
- **Error messages:** Always return bilingual error messages from the API. The frontend should display `message_ar` when language is Arabic.
- **Environment variables:** Store all secrets (JWT_SECRET, DB_URL, etc.) in `.env`. Never hardcode. Deploy config to Render/Railway env vars before Day 2.

### File Structure Suggestion
```
/apps/backend/src/
  modules/
    auth/         (routes, service, types)
    booking/      (routes, service, types)
    queue-engine/ (routes, service, types)
    services/     (routes, service, types)
    windows/      (routes, service, types)
    notifications/(routes, service, types)
    predictions/  (routes, service, types)
    reports/      (routes, service, types)
    admin/        (routes, service, types)
    public/       (routes, service, types)
    audit/        (service — no external routes)
  shared/
    db.ts         (pg pool setup)
    auth.middleware.ts
    sse.manager.ts
    logger.ts
    i18n.ts
  migrations/
  seed/

/apps/frontend/src/
  pages/
    citizen/      (home, services, booking, ticket, notifications)
    staff/        (window, calling)
    supervisor/   (dashboard, reports, announcements)
    admin/        (users, services, config, audit)
    public/       (display-board, service-list)
  components/
    shared/       (ticket-card, service-badge, notification-bell)
    layouts/      (citizen-layout, staff-layout, etc.)
  hooks/
    useSSE.ts
    useQueue.ts
    useTicket.ts
  i18n/
    ar.json
    en.json
```

---

*End of Lessa?! Product & Engineering Documentation Package — Version 1.0*

*Generated for 2-day hackathon delivery by a team of 3.*
*All sections are internally consistent and implementation-ready.*
*Arabic name: لسه؟ | Tagline: Smart Government Queue Tracking Platform*