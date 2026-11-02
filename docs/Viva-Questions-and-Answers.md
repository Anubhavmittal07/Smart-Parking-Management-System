# Viva Questions and Answers - Smart Parking Management System

## A. Project overview

### 1. What problem does the Smart Parking Management System solve?
It helps drivers find and reserve parking, while helping facility staff manage slots, entry and exit, billing, and occupancy. It reduces manual work and the time drivers spend searching for parking.

### 2. Who are the main actors in the system?
The main actors are the Driver, Administrator, Sensor/ANPR system, and Payment Gateway. Drivers search and reserve; administrators configure facilities and view reports; sensors report vehicle events; the gateway processes payments.

### 3. What are the major functional modules?
Authentication and profiles, facility and slot management, availability search, reservations, entry/exit tracking, billing and payments, notifications, and administration/reporting.

### 4. What are the main non-functional requirements?
Performance, security, reliability, usability, maintainability, and scalability. Examples include quick availability searches, role-based access, secure communication, and preventing double booking.

## B. Architecture and design

### 5. Which architecture does SPMS use?
A layered client-server architecture. The browser client communicates with a REST API. The server applies application and business rules, uses a data-access layer, and stores records in a relational database. External services connect through integration adapters.

### 6. What does each layer do?
The presentation layer handles the user interface. The API/application layer routes and validates requests and enforces access control. The domain layer applies parking and billing rules. The data-access layer handles persistence. The database stores durable records, while adapters communicate with external providers and devices.

### 7. Why use client-server architecture?
It centralizes business rules and data, allows multiple clients to use the same API, and prevents browsers from accessing the database directly. The server can enforce authorization and consistent reservation rules.

### 8. Why is a modular monolith a reasonable starting design?
It keeps modules separated while allowing reservation and slot updates to use one database transaction. It is simpler to operate than multiple services and can later be split if scale or team ownership requires it.

### 9. What is a microservice?
A microservice is an independently deployable service that owns a focused business capability and communicates through defined APIs or events. Possible future SPMS boundaries include identity, reservations, payments, and notifications.

### 10. Why not start with microservices immediately?
They add network failures, distributed data consistency, deployment, and monitoring complexity. The project benefits first from clear module boundaries; splitting services should follow demonstrated scaling or organizational needs.

### 11. How do you prevent two drivers from booking the same slot?
The system must recheck availability when creating the reservation and perform the check and write atomically, using a database transaction with appropriate locking or constraints. Checking availability only during the earlier search is insufficient because another driver may book meanwhile.

### 12. What is the role of an integration adapter?
It isolates provider-specific details from the core business logic. For example, a payment adapter translates SPMS payment requests and results to a gateway’s API, so the domain service does not depend directly on one vendor’s format.

## C. UML diagrams

### 13. What does the class diagram represent?
It represents the static structure: main classes, their attributes and operations, and relationships. SPMS examples include User, Driver, Admin, Facility, ParkingSlot, Reservation, ParkingSession, Payment, and PricingRule.

### 14. Why are Driver and Admin modeled as specializations of User?
They share common identity and profile information, while having different responsibilities and permissions. Specialization captures the shared user data and role-specific behavior.

### 15. What does the sequence diagram show?
It shows the time-ordered messages for a use case. The reservation sequence follows the driver’s search and selection through the web app, API, reservation service, database, payment gateway, and notification service.

### 16. What does the activity diagram show?
It models the workflow and its decision branches. The SPMS activity diagram follows a vehicle from arrival through event validation, session creation, parking, fee calculation, payment, and exit.

### 17. How do the three UML diagrams differ?
The class diagram shows structure; the sequence diagram shows interactions over time for one scenario; the activity diagram shows workflow steps and branching. They describe complementary views of the same system.

## D. Data and integrations

### 18. Why use a relational database?
Users, facilities, slots, reservations, sessions, and payments have defined relationships and require reliable transactions. A relational database supports constraints and transactional updates for critical booking operations.

### 19. How does the system interact with sensors or ANPR cameras?
A sensor or ANPR system sends an entry or exit event to an API endpoint. The system validates and records the event, associates it with a reservation or session, and updates the parking state.

### 20. What if a sensor event is sent more than once?
The event handler should be idempotent: it should identify duplicate events using a source event ID or equivalent key and avoid applying the same state change twice. The event should also be retained for audit and recovery.

### 21. How should payment failures be handled?
Record a clear pending or failed payment state, keep the provider reference, and follow a defined retry or cancellation flow. A network timeout should not automatically be treated as a confirmed failure because the provider may have processed the payment.

### 22. What is a webhook?
A webhook is an HTTP callback sent by an external system to notify SPMS about an event, such as a payment result. SPMS should verify its authenticity and process it safely, including duplicate delivery.

## E. Metrics and complexity

### 23. What is SLOC?
Source Lines of Code is a size measure counting code lines according to a stated convention, often excluding blank lines and comments. It should be measured from actual source using a consistent tool and configuration.

### 24. What are Halstead metrics?
They estimate program size and complexity from counts of distinct and total operators and operands. Common derived measures include vocabulary, length, volume, difficulty, and effort.

### 25. What is cyclomatic complexity?
It measures the number of linearly independent paths through a control-flow graph. For one connected component, it can be calculated as decision points plus one, or as `E - N + 2P`.

### 26. What is the cyclomatic complexity of the sample reservation function, and why?
It is 5. The sample has four binary decisions—authentication, valid time, slot availability, and save success—so `4 + 1 = 5`. This means a basis set of five independent paths is needed for branch/path-oriented test planning.

### 27. What is Function Point Analysis?
It estimates software functional size from user-visible functions: External Inputs, External Outputs, External Inquiries, Internal Logical Files, and External Interface Files. Each is weighted by complexity to calculate unadjusted function points.

### 28. What does the metrics report’s 61 function points mean?
It is an indicative teaching estimate based on the report’s assumed function counts and low-complexity weights. It is not a measured implementation size; a formal count would require validated transaction boundaries and data-element/file counts.

### 29. Why are the code metrics illustrative in this report?
The repository contains project documentation and diagrams rather than executable application source. The report therefore demonstrates the calculations on a defined reservation example and distinguishes those results from measured codebase metrics.

### 30. Does a high cyclomatic complexity prove the code is defective?
No. It is a risk indicator that suggests more branches and testing effort. It should be interpreted with maintainability, test results, defects, and the function’s purpose.

## F. Testing and defense questions

### 31. What would you test first?
Availability and reservation correctness, especially concurrent attempts for the same slot. Then test payment success/failure and retries, sensor event validation and duplicates, role authorization, and fee calculation boundaries.

### 32. How would you test the no-double-booking rule?
Run concurrent reservation requests for the same slot and overlapping interval. Confirm that at most one request succeeds and that database state remains consistent after failures or retries.

### 33. How would you test fee calculation?
Test short and long sessions, exact tariff boundaries, partial-hour rounding, rate changes, invalid timestamps, and applicable discounts or peak pricing if those rules are defined.

### 34. What is the biggest technical risk in this design?
Maintaining consistent slot, reservation, session, and payment states during concurrent requests and unreliable external events. Transactions, explicit state transitions, idempotency, and reconciliation reduce this risk.

### 35. What would you improve in a future version?
Add a mobile client, production sensor/ANPR integration, stronger operational monitoring, and a validated dynamic pricing model. The system could extract services later if measured traffic or team structure justifies it.

## Quick revision formulas

- Cyclomatic complexity: `V(G) = E - N + 2P`; for one connected graph, `V(G) = decisions + 1`.
- Halstead vocabulary: `n = n1 + n2`.
- Halstead length: `N = N1 + N2`.
- Halstead volume: `V = N log2(n)`.
- Halstead difficulty: `D = (n1 / 2) × (N2 / n2)`.
- Function Points: sum the weighted EI, EO, EQ, ILF, and EIF counts.
