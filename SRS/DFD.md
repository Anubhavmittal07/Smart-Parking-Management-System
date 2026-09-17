# Data Flow Diagrams (DFD)

This document describes the Data Flow Diagrams for the **Smart Parking Management System (SPMS)**. It complements the existing UML diagrams in `docs/uml/` by showing how data moves between external entities, processes, and data stores, rather than the system's object structure.

## Level 0 — Context Diagram

`context-diagram.svg`

Treats SPMS as a single process and shows its interaction with the four external entities:

| External Entity | Sends to SPMS | Receives from SPMS |
|---|---|---|
| Driver | Login/registration, search & booking requests | Slot availability, booking confirmation, receipts, notifications |
| Admin | Pricing rules, slot configuration | Occupancy & revenue reports |
| Sensor / ANPR Camera | Vehicle entry/exit signal | — |
| Payment Gateway | Payment status | Payment request |

## Level 1 — Process Decomposition

`level-1-dfd.svg`

Breaks the single process into five sub-processes and four data stores:

**Processes**
1. **1.0 Manage Login / Registration** — authenticates drivers, reads/writes `D1 User Data`
2. **2.0 Search & Reserve Slot** — checks `D2 Slot Data`, writes new bookings to `D3 Booking Data`
3. **3.0 Detect Entry / Exit** — consumes sensor/ANPR signals, updates `D3 Booking Data`, triggers payment
4. **4.0 Process Payment & Billing** — calculates fees, talks to the Payment Gateway, writes `D4 Payment Data`, returns receipt to driver
5. **5.0 Notifications & Reports** — reads `D3`/`D4` to generate driver notifications and admin reports

**Data Stores**
- `D1` User Data
- `D2` Slot Data
- `D3` Booking Data
- `D4` Payment Data

## Suggested placement in the repo

```
docs/
└── dfd/
    ├── context-diagram.svg
    ├── level-1-dfd.svg
    └── DFD.md
```

Add a reference to this folder under **Project Documentation** in the main `README.md`, alongside the existing `docs/uml/` entry.
