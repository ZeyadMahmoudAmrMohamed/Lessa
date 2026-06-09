# Feature Specification: Government Queue Tracking Platform (Lessa?)

**Feature Branch**: `001-government-queue-platform`

**Created**: 2026-06-09

**Status**: Draft

**Input**: User description: "Build a Government Queue Tracking Platform — a web platform that allows citizens
to book queue slots at government service branches, track their turn, and reduce physical waiting time."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Guest Views Live Wait Times (Priority: P1)

A visitor arrives at the Lessa? web app without an account. They can immediately see the current
estimated wait time and congestion level for each available service at the branch — no login required.
They are shown a call-to-action prompting them to register if they want to book a slot.

**Why this priority**: This is the zero-friction entry point that demonstrates platform value instantly and
drives citizen registration. It works with no auth infrastructure beyond a public API endpoint.

**Independent Test**: Open the app in an incognito browser window; confirm wait times and congestion
indicators load without any login; confirm a "Register to book" prompt is visible.

**Acceptance Scenarios**:

1. **Given** the app is open and unauthenticated, **When** the home page loads, **Then** estimated wait
   times and a congestion level indicator are displayed for each active service.
2. **Given** a guest is viewing the home page, **When** they attempt to book a slot, **Then** they are
   redirected to the registration/login page with a contextual message.
3. **Given** no services are active, **When** a guest loads the page, **Then** a "No services currently
   available" message is displayed.

---

### User Story 2 — Citizen Books and Tracks a Queue Slot (Priority: P1)

A registered citizen logs in with their phone number, selects a service, and books a queue slot. The
system auto-assigns them a queue number. They can see their current position in the queue and cancel
their slot if needed. When their turn is approaching, they receive a basic in-app notification.

**Why this priority**: This is the primary citizen value proposition — the core reason the platform exists.

**Independent Test**: Register a test citizen account, book a slot for an active service, observe the
auto-assigned number and queue position, then cancel the slot and confirm it is removed.

**Acceptance Scenarios**:

1. **Given** a citizen is logged in, **When** they select a service and confirm booking, **Then** a unique
   queue number is auto-assigned and displayed.
2. **Given** a citizen has a booking, **When** they view their queue status, **Then** their current position
   (e.g., "3rd in line") and estimated wait time are shown.
3. **Given** a citizen has a booking, **When** they cancel it, **Then** the slot is freed and their queue
   number is invalidated.
4. **Given** a citizen is 2–3 positions away from being called, **When** the queue advances, **Then** an
   in-app notification alerts them that their turn is approaching.
5. **Given** a citizen tries to book a second slot for the same service on the same day, **When** they
   submit the form, **Then** the system rejects the duplicate with a clear message.

---

### User Story 3 — Counter Staff Manages the Active Queue (Priority: P1)

A Counter Staff member logs in and sees the current queue for their assigned window. With one click they
call the next number, and they can mark each transaction as done, skipped, or no-show. The display
updates immediately for all roles.

**Why this priority**: Without staff calling numbers forward, the queue cannot progress — this unblocks
the entire platform's real-time value.

**Independent Test**: Log in as Staff, call next number, verify the citizen's queue position decreases,
then mark the transaction done and verify the number is removed from the active queue.

**Acceptance Scenarios**:

1. **Given** a staff member is logged in at their window, **When** they click "Call Next", **Then** the
   next queue number is called and displayed as active on their screen.
2. **Given** a transaction is active, **When** staff marks it as "Done", **Then** the number is removed
   from the queue and the next citizen's position updates.
3. **Given** a transaction is active, **When** staff marks it as "No-Show", **Then** the number is
   skipped and the slot is recorded as a no-show for reporting.
4. **Given** a transaction is active, **When** staff marks it as "Skipped", **Then** the number is placed
   at the back of the queue and the next number is called.

---

### User Story 4 — Branch Supervisor Monitors and Manages Windows (Priority: P2)

A Branch Supervisor logs in and sees a real-time overview of all service windows: which are open, which
staff member is assigned, and how many transactions have been completed today. They can open or close
windows and view a summary of today's attendance and service load.

**Why this priority**: Operational oversight is required for branch management but does not block the
core citizen experience.

**Independent Test**: Log in as Supervisor, open a new window, assign a staff member, verify it appears
in the staff view, then close it and confirm it disappears.

**Acceptance Scenarios**:

1. **Given** a supervisor is logged in, **When** they view the branch dashboard, **Then** all windows
   are listed with their status (open/closed), assigned staff, and transactions completed today.
2. **Given** a window is closed, **When** the supervisor opens it, **Then** it becomes available for
   staff assignment and appears in the active queue system.
3. **Given** a window is open, **When** the supervisor closes it, **Then** no new tickets are routed to
   it and the assigned staff can no longer call numbers.
4. **Given** the supervisor views the daily summary, **When** they access the attendance panel, **Then**
   total tickets issued, served, and no-show counts for the day are displayed.

---

### User Story 5 — System Admin Manages Services and Users (Priority: P2)

A System Admin logs in and can create, edit, or deactivate services with their estimated transaction
times. They manage all user accounts and roles, and can view platform-wide reports and analytics.

**Why this priority**: Admin capabilities are configuration-time concerns; the platform can demo without
them but cannot be operated long-term without them.

**Independent Test**: Log in as Admin, create a new service with an estimated time, verify it appears
in the guest/citizen view, then deactivate it and verify it disappears.

**Acceptance Scenarios**:

1. **Given** an admin is logged in, **When** they create a new service with a name and estimated time,
   **Then** the service appears in the public service list immediately.
2. **Given** an admin deactivates a service, **When** citizens view the service list, **Then** the
   deactivated service is no longer bookable.
3. **Given** an admin views user management, **When** they change a user's role, **Then** the user's
   access is updated on their next action.
4. **Given** an admin views reports, **When** they select a date range, **Then** total transactions,
   average wait times, and no-show rates are displayed.

---

### Edge Cases

- What happens when a citizen's queue number is called but they have not yet arrived? → Staff marks as
  no-show; citizen receives a notification that their number was called and missed.
- What happens when a citizen tries to book a slot for a service with no active windows? → Booking is
  rejected with a "Service temporarily unavailable" message.
- What happens when the last window for a service is closed mid-queue? → Existing bookings remain
  valid; no new bookings accepted until a window reopens; citizens in queue are notified.
- What happens when two citizens simultaneously try to book the last available slot? → First confirmed
  write wins; second receives a "Slot no longer available" error.

---

## Requirements *(mandatory)*

### Functional Requirements

**Queue Management**
- **FR-001**: System MUST auto-assign a unique sequential queue number upon successful booking.
- **FR-002**: Citizens MUST be able to view their current queue position and estimated remaining wait time.
- **FR-003**: Citizens MUST be able to cancel their own active booking.
- **FR-004**: System MUST prevent a citizen from holding more than one active booking per service per day.
- **FR-005**: Queue position MUST update when the citizen manually refreshes or when the page is live.

**Booking**
- **FR-006**: Citizens MUST register using a phone number to access booking functionality.
- **FR-007**: Citizens MUST be able to select a service and confirm a booking in no more than 3 steps.
- **FR-008**: System MUST reject booking attempts when no active windows serve the selected service.

**Staff Operations**
- **FR-009**: Staff MUST be able to call the next queue number with a single interaction.
- **FR-010**: Staff MUST be able to mark the active transaction as Done, Skipped, or No-Show.
- **FR-011**: Transaction status changes MUST be reflected immediately in the citizen's queue view.

**Supervisor Operations**
- **FR-012**: Supervisors MUST be able to open and close service windows.
- **FR-013**: Supervisors MUST see a live dashboard of all window statuses and assigned staff.
- **FR-014**: Supervisors MUST be able to view a daily summary (tickets issued, served, no-show count).

**Admin Operations**
- **FR-015**: Admins MUST be able to create, edit, and deactivate services with estimated transaction times.
- **FR-016**: Admins MUST be able to view and manage all user accounts and assign roles.
- **FR-017**: Admins MUST be able to view reports filtered by date range covering transactions, wait times,
  and no-show rates.

**Notifications**
- **FR-018**: Citizens MUST receive an in-app notification when they are within 2–3 positions of being called.

**Localisation**
- **FR-019**: The UI MUST support Arabic (RTL, default) and English (LTR) without a full-page reload.
- **FR-020**: All user-facing text MUST be externalized; no hard-coded strings in the UI.

**Authentication & RBAC**
- **FR-021**: System MUST enforce the five roles — Guest, Citizen, Staff, Supervisor, Admin — with
  distinct access boundaries enforced at the API layer.
- **FR-022**: Unauthenticated users MUST only access public read endpoints (wait times, congestion).

### Key Entities

- **Service**: Represents a government service offered at the branch (e.g., "ID Renewal"). Has a name,
  estimated transaction time, and active/inactive status.
- **Window**: A physical or logical service counter. Belongs to a service type; has an open/closed status
  and an optional assigned staff member.
- **Ticket**: A queue booking held by a citizen. Has a unique sequential number, status (waiting, active,
  done, skipped, no-show), and timestamps.
- **User**: A platform account. Has a role (Citizen, Staff, Supervisor, Admin) and a phone number as the
  primary identifier for citizens.
- **Branch**: The single government service branch (MVP scope). Owns all services, windows, and tickets.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A citizen can register, book a slot, and view their queue position within 2 minutes of first
  visiting the platform.
- **SC-002**: A staff member can call and process 10 consecutive transactions without navigating away from
  the queue management screen.
- **SC-003**: Queue position updates are visible to the citizen within 5 seconds of a staff transaction
  action (manual refresh path acceptable for MVP).
- **SC-004**: The platform supports the full citizen-to-staff workflow end-to-end for a single branch with
  at least 3 concurrent active windows.
- **SC-005**: Both Arabic and English interfaces are fully navigable with no missing translations on any
  primary workflow screen.
- **SC-006**: A supervisor can open or close a window and the change is reflected across all active sessions
  within 10 seconds.
- **SC-007**: An admin can create a new service and have it immediately bookable by citizens without a
  system restart.

---

## Assumptions

- **Single-branch scope**: The MVP covers exactly one government branch. Multi-branch support is explicitly
  out of scope.
- **Phone-number registration**: Citizens register using a phone number as their primary identifier.
  No email-based registration is required for MVP.
- **In-app notifications only**: Notifications are delivered as in-app alerts (banner or badge). SMS and
  push notifications are out of scope for MVP.
- **Manual queue refresh acceptable for MVP**: Real-time queue position updates may require a manual page
  refresh; WebSocket live updates are a stretch goal.
- **No appointment scheduling**: Bookings are walk-in style (join today's queue now) with no future-date
  slot reservation in MVP scope.
- **Responsive web only**: No native mobile app. The web UI is expected to function on mobile browsers.
- **Operating hours not enforced in MVP**: The system does not automatically open/close queues based on
  a schedule; supervisors manage this manually.
- **One active booking per service per citizen per day**: A citizen may not hold duplicate bookings for
  the same service on the same calendar day.
