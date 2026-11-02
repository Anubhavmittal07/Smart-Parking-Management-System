# Design Analysis Report - Smart Parking Management System

## 1. Purpose

This report evaluates the proposed SPMS design against its user workflows, quality goals, and integration needs. It brings together the architecture, domain model, reservation interaction, and parking lifecycle.

## 2. Design summary

SPMS uses a layered client-server design. Driver and administrator clients call a REST API. Application services validate requests and authorize roles; domain services manage availability, reservations, parking sessions, billing, and reporting. A relational database stores the system of record. Payment, sensor/ANPR, and notification integrations are isolated behind adapters.

The proposed deployment is a modular server application with well-defined internal modules. This keeps transactional reservation logic close to its data while leaving room for later extraction of independently scaled services if operational evidence supports it.

## 3. Requirements-to-design mapping

| Requirement area | Design element | Design response |
|---|---|---|
| Authentication and roles | User, Driver, Admin; API authorization | Server-side identity checks and role-based access |
| Search and live availability | Facility, ParkingSlot; Availability service | Query slot state and reservation intervals by facility and type |
| Reservation and cancellation | Reservation service; Reservation entity | Validate interval and status transitions; use transaction-safe slot allocation |
| Entry and exit | ParkingSession, EntryExitEvent; event adapter | Record time-stamped events and update session/slot state idempotently |
| Billing and payment | PricingRule, Payment; payment adapter | Compute duration-based fees and track provider result/reference |
| Alerts and reporting | Notification and Report | Deliver booking/payment updates and aggregate facility metrics |
| Admin configuration | Admin, Facility, PricingRule | Restrict facility, slot, and pricing operations to authorized administrators |

## 4. Design quality analysis

### 4.1 Modularity and maintainability

The layer boundaries separate presentation, transport, business rules, persistence, and vendor integration. Domain services own business decisions, preventing controllers from accumulating pricing and reservation rules. Adapters keep provider-specific APIs out of the core model.

### 4.2 Data integrity and concurrency

Slot availability can change between search and confirmation. The reservation operation must recheck availability at write time and atomically create the reservation or release its hold. Use a database transaction plus row-level locking, an exclusion constraint, or another concurrency-safe mechanism appropriate to the selected database. Add a uniqueness/invariant strategy so overlapping confirmed reservations cannot occupy the same slot.

Payment-provider calls cannot generally participate in the database transaction. Model payment as a stateful workflow: create a short-lived hold, call the provider with an idempotency key, persist the provider reference and outcome, then confirm or release the hold. Reconcile delayed webhooks and timeouts instead of assuming that a network timeout means payment failure.

### 4.3 Security and privacy

- Hash passwords with a suitable password-hashing algorithm; never store raw credentials.
- Require HTTPS and apply role checks to every protected API operation.
- Validate payment webhook signatures and sensor event credentials; reject replayed events using provider identifiers and timestamps.
- Store only the vehicle, user, and payment metadata required for service and audit; avoid retaining card data in SPMS.
- Keep secrets out of source control and redact sensitive values from logs.

### 4.4 Reliability and recovery

External payment and sensor systems may be delayed or unavailable. Record integration event status, process callbacks idempotently, retry transient failures with bounded backoff, and expose unresolved cases for administrator review. Persist the entry/exit event before applying the resulting state transition so a retry can resume safely.

### 4.5 Performance and scalability

Index facility/location, slot status/type, and reservation interval queries. Cache read-heavy facility metadata where practical, while treating the authoritative slot/reservation check as a transactional database operation. Keep API instances stateless so they can scale horizontally. Measure search latency and reservation contention under expected concurrent use.

### 4.6 Usability and accessibility

Show clear slot status, pricing basis, reservation expiry, and payment outcomes. Provide accessible labels and keyboard operation for slot selection. For uncertain sensor or payment outcomes, communicate the current booking state and next action rather than presenting a false success or failure.

## 5. Key risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Concurrent users reserve the same slot | Double booking and operational disputes | Transactional availability recheck, database constraint/locking, concurrency tests |
| Payment callback arrives late or more than once | Incorrect booking/payment state | Idempotency keys, event deduplication, payment reconciliation job |
| Sensor event is missing, duplicated, or out of order | Incorrect occupancy and billing | Persist event IDs, validate sequence/state transitions, attendant exception workflow |
| Pricing changes during a reservation/session | Inconsistent customer charges | Version effective-dated pricing rules and store the applied rate snapshot on the booking/session |
| Provider outage | Interrupted entry or payment flow | Explicit pending/error states, retry policy, operational fallback and review queue |
| Microservices introduced too early | More failure modes and harder consistency | Start with modular boundaries; split only after scale or ownership needs are demonstrated |

## 6. Design decisions and rationale

1. **Relational database:** Reservations, slots, sessions, and payments have strong relationships and transactional invariants.
2. **Layered modular server:** Supports clear responsibilities while keeping core booking operations within a single transaction boundary.
3. **Adapters for integrations:** Allows provider replacement and isolates external API changes.
4. **Explicit state models:** Reservations, slots, sessions, and payments need validated transitions, not arbitrary status updates.
5. **Event audit trail:** Sensor and payment callbacks require traceability, deduplication, and recovery.

## 7. Validation plan

- Review entity fields, multiplicities, and status transitions against the SRS and stakeholder workflows.
- Verify successful, rejected, cancelled, and timed-out booking/payment paths.
- Test concurrent reservation attempts against the same slot and interval.
- Test duplicate and out-of-order entry/exit and payment events.
- Check role permissions, webhook verification, input validation, and sensitive-data handling.
- Measure availability-query latency and API behavior under expected concurrent load.

## 8. Conclusion

The design maps the parking lifecycle into cohesive domain modules and keeps high-risk state changes within explicit transaction and event-processing boundaries. Its central quality priorities are prevention of double booking, correct reconciliation of external events, secure payment integration, and understandable failure handling.
