# UML Design - Smart Parking Management System

## 1. Class Diagram

```mermaid
classDiagram
    direction LR
    class User {
      +int userId
      +string name
      +string email
      +string passwordHash
      +Role role
      +authenticate()
      +updateProfile()
    }
    class Driver
    class Admin {
      +configureFacility()
      +configurePricing()
      +viewReports()
    }
    class Vehicle {
      +int vehicleId
      +string plateNumber
      +string vehicleType
    }
    class Facility {
      +int facilityId
      +string name
      +string address
      +getAvailability()
    }
    class ParkingSlot {
      +int slotId
      +string slotNumber
      +SlotType type
      +SlotStatus status
      +isAvailable(start,end)
      +changeStatus(status)
    }
    class Reservation {
      +int reservationId
      +datetime startTime
      +datetime endTime
      +ReservationStatus status
      +create()
      +cancel()
    }
    class ParkingSession {
      +int sessionId
      +datetime entryTime
      +datetime exitTime
      +start()
      +close()
    }
    class Payment {
      +int paymentId
      +decimal amount
      +PaymentStatus status
      +string providerReference
      +process()
      +refund()
    }
    class PricingRule {
      +int ruleId
      +decimal hourlyRate
      +datetime validFrom
      +calculateFee(duration)
    }
    class EntryExitEvent {
      +int eventId
      +string eventType
      +datetime occurredAt
      +string sourceReference
      +validate()
    }
    class Notification {
      +int notificationId
      +string message
      +datetime sentAt
      +send()
    }
    class Report {
      +generateOccupancy()
      +generateRevenue(period)
    }
    User <|-- Driver
    User <|-- Admin
    Driver "1" --> "0..*" Vehicle : owns
    Driver "1" --> "0..*" Reservation : makes
    Facility "1" *-- "1..*" ParkingSlot : contains
    Facility "1" o-- "1..*" PricingRule : defines
    ParkingSlot "1" --> "0..*" Reservation : reserved for
    Reservation "1" --> "0..1" ParkingSession : activates
    ParkingSession "1" --> "0..*" EntryExitEvent : records
    ParkingSession "1" --> "0..1" Payment : billed by
    Reservation ..> PricingRule : uses
    Driver "1" --> "0..*" Notification : receives
    Admin ..> Facility : manages
    Admin ..> Report : requests
```

### Core class constraints

- `User.role` distinguishes driver and administrator permissions.
- A slot has one current status; a reservation must pass an availability check before confirmation.
- A reservation may activate at most one parking session; a session has at most one finalized payment.
- Entry and exit events are retained with timestamps and source references for audit and retry handling.
- Pricing rules are associated with a facility and evaluated for the applicable parking interval.

## 2. Sequence Diagram - Search and reserve a slot

```mermaid
sequenceDiagram
    autonumber
    actor Driver
    participant UI as "Driver Web App"
    participant API as "SPMS REST API"
    participant RS as "Reservation Service"
    participant DB as "Relational Database"
    participant PA as "Payment Adapter"
    participant PG as "Payment Gateway"
    participant NS as "Notification Service"

    Driver->>UI: Enter facility and time criteria
    UI->>API: Request available slots
    API->>RS: Find available slots(criteria)
    RS->>DB: Read slots and overlapping reservations
    DB-->>RS: Candidate slots
    RS-->>API: Availability and prices
    API-->>UI: Display available slots

    Driver->>UI: Select slot and confirm reservation
    UI->>API: Submit reservation request
    API->>RS: Reserve slot(user, slot, interval)
    RS->>DB: Begin transaction and recheck availability
    DB-->>RS: Slot available
    RS->>DB: Create temporary hold
    RS->>DB: Commit hold transaction

    RS->>PA: Create payment request(idempotency key)
    PA->>PG: Request payment
    PG-->>PA: Payment result and provider reference
    PA-->>RS: Normalized payment result

    alt Payment succeeds
        RS->>DB: Begin transaction
        RS->>DB: Confirm reservation and save payment
        RS->>DB: Commit transaction
        RS->>NS: Send booking confirmation
        NS-->>Driver: Booking confirmation and receipt
        RS-->>API: Confirmed reservation
        API-->>UI: Show confirmation
    else Payment fails or is cancelled
        RS->>DB: Mark payment failed and release hold
        RS-->>API: Payment failure result
        API-->>UI: Show retry or cancellation options
    else Payment result is delayed
        RS->>DB: Keep reservation in pending-payment state
        RS-->>API: Return pending status
        API-->>UI: Show payment pending
        PG-->>PA: Send payment status webhook
        PA->>RS: Verify and process webhook idempotently
        RS->>DB: Confirm reservation or release hold
        RS->>NS: Notify driver of final status
    end
```
## 3. Activity Diagram - Parking entry, stay, and exit

```mermaid
flowchart TD
    A([Start]) --> B[Driver arrives at facility]
    B --> C[Sensor / ANPR sends entry event]
    C --> D{Event valid and vehicle identified?}
    D -- No --> E[Flag event for attendant review]
    E --> Z([End])
    D -- Yes --> F[Find confirmed reservation or eligible walk-in]
    F --> G{Slot can be assigned?}
    G -- No --> H[Reject entry and notify driver]
    H --> Z
    G -- Yes --> I[Create parking session]
    I --> J[Mark slot occupied]
    J --> K[Vehicle parked]
    K --> L[Sensor / ANPR sends exit event]
    L --> M[Close session and calculate fee]
    M --> N{Payment settled?}
    N -- No --> O[Request payment]
    O --> P{Payment succeeds?}
    P -- No --> Q[Keep balance due and record exception]
    Q --> Z
    P -- Yes --> R[Record payment and issue receipt]
    N -- Yes --> R
    R --> S[Mark slot available]
    S --> T[Send exit confirmation]
    T --> Z
```

## 4. Diagram scope

The class model describes the main domain entities and associations. The sequence diagram details the reservation/payment interaction. The activity diagram models entry through exit, including exception branches for invalid events, unavailable slots, and failed payments.

