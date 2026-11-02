# Smart Parking Management System

## Project Overview

The **Smart Parking Management System (SPMS)** is an end-to-end software solution designed to automate parking space discovery, slot reservation, vehicle entry/exit monitoring, fee calculation, and payment processing. Built as a Software Engineering course project (CS311L) at KIET Deemed to be University, SPMS addresses urban traffic congestion and parking inefficiencies by delivering real-time visibility and centralized management.

The system connects drivers with available parking facilities through a responsive interface, while providing administrators with a powerful dashboard to control slot inventory, configure dynamic pricing, and monitor occupancy and revenue metrics.

---

## Problem Statement

Traditional manual parking management relies on physical attendants, paper tickets, and guesswork. Drivers waste significant time searching for open slots, causing congestion around parking venues, fuel wastage, and frustration. Facilities suffer from underutilized capacity, lack of real-time occupancy visibility, manual billing errors, and revenue leakage.

---

## Objectives

- **Automate Parking Management**: Eliminate manual ticketing and manual slot allocation.
- **Provide Real-Time Availability**: Give drivers instant visibility into available parking slots.
- **Enable Advance Reservations**: Allow drivers to search, reserve, and pay for parking slots in advance.
- **Automate Entry/Exit Detection**: Integrate IoT sensors / ANPR camera events for seamless vehicle check-in and check-out.
- **Streamline Billing & Payments**: Automatically calculate fees based on duration and process payments via digital gateways.
- **Deliver Admin Analytics**: Provide facility administrators with detailed occupancy, revenue, and statistical reports.

---

## Key Features

### Driver Features
- **User Registration & Login**: Account creation, authentication, and secure profile management.
- **Parking Location Search**: Search parking facilities by location, distance, and rates.
- **Real-Time Slot Availability**: Live grid display of available, reserved, and occupied parking slots.
- **Slot Reservation & Cancellation**: Advance slot booking with flexible cancellation capability.
- **Vehicle Entry/Exit Records**: Digital logging of vehicle check-in and check-out events.
- **Parking Fee Calculation**: Automated duration-based fee calculation based on facility pricing rules.
- **Payment Processing**: Secure online payment integration with instant digital receipt generation.
- **Booking History**: Access past reservations, payment receipts, and active bookings.
- **Notifications**: Automated alerts for booking confirmation, slot expiry, and payment status.

### Administrator Features
- **Slot & Facility Management**: Add, update, or disable parking locations and individual slots.
- **Pricing Management**: Define base rates, hourly tariffs, and peak-hour pricing rules.
- **Occupancy Monitoring**: Live dashboard displaying real-time facility occupancy percentages.
- **Revenue & Statistical Reports**: Generate daily, weekly, and monthly financial and usage analytics.

---

## System Actors

- **Driver**: Primary user who searches, reserves, pays for, and utilizes parking slots.
- **Admin**: System manager who configures parking facilities, pricing, and monitors reports.
- **Sensor / Camera (IoT/ANPR)**: External hardware or simulated interface detecting vehicle entry and exit events.
- **Payment Gateway**: External payment service processing credit/debit card and digital wallet transactions.

---

## UML Diagrams

Comprehensive UML 2.0 diagrams documenting the system architecture are available in the repository:

- [Use Case Diagram](docs/uml/Use_Case_Diagram.pdf) — Complete view of system actors, use cases, and boundaries.
- [Class Diagram](docs/uml/Class_Diagram.pdf) — Object-oriented domain classes, attributes, methods, and relationships.
- [Sequence Diagram](docs/uml/Sequence_Diagram.pdf) — Detailed message flow for slot reservation and payment execution.
- [Activity Diagram](docs/uml/Activity_Diagram.pdf) — End-to-end workflow covering check-in, parking, billing, and exit detection.
- [State Diagram](docs/uml/State_Diagram.pdf) — Parking slot state lifecycle (Available, Reserved, Occupied, Maintenance).
- [Combined UML Diagrams PDF](docs/uml/UML_Diagrams_Smart_Parking_Management_System.pdf) — Complete 7-page consolidated UML specification.

---

## Functional Requirements Summary

Functional requirements (FR-01 to FR-30) are categorized into 8 core functional areas:
1. **User Authentication & Profile**: Secure registration, login, JWT session management, profile editing.
2. **Parking Location & Slot Management**: CRUD operations for parking sites and slot inventory.
3. **Availability & Search**: Real-time slot status querying by location and slot type.
4. **Slot Reservation & Cancellation**: Slot locking, reservation timestamping, cancellation handling.
5. **Vehicle Entry & Exit Logging**: Timestamped entry/exit event processing via IoT/ANPR triggers.
6. **Billing & Payment Records**: Automated tariff computation, payment gateway integration, receipt generation.
7. **Notifications & User History**: System alerts and historical transaction logging.
8. **Admin Dashboard & Reports**: Analytics visualization for occupancy and financial performance.

---

## Non-Functional Requirements

- **Performance**: Search and availability response times under 2 seconds; concurrent user handling.
- **Security**: Password hashing (bcrypt), HTTPS encrypted data transmission, role-based access control (RBAC).
- **Reliability**: Transactional integrity ensuring no double-booking of slots (99.9% uptime target).
- **Usability**: Responsive, intuitive UI optimized for both mobile devices and desktop displays.
- **Maintainability**: Modular 3-tier architecture with decoupled frontend, backend API, and database services.
- **Scalability**: Database indexing and scalable REST API structure to accommodate facility expansion.

---

## Technology Stack

- **Frontend**: React.js / HTML5 / CSS3 / JavaScript (ES6+)
- **Backend API**: Node.js / Express.js
- **Database**: MySQL / PostgreSQL (Relational schema with ACID compliance)
- **External Interfaces**: RESTful APIs for Payment Gateway (Razorpay/Stripe) and IoT/ANPR event webhooks
- **Version Control**: Git & GitHub

---

## Project Structure

```
Smart-Parking-Management-System/
│
├── README.md                                    # Main project documentation
├── .gitignore                                   # Workspace git ignore rules
│
├── docs/                                        # Comprehensive engineering documentation
│   ├── Requirement_Report.pdf                   # Stakeholder requirements & FR/NFR analysis
│   ├── SRS_Smart_Parking_Management_System.pdf  # IEEE 830 compliant Software Requirements Specification
│   ├── DFD.md                                   # Data Flow Diagrams (Context & Level 1)
│   │
│   └── uml/                                     # UML 2.0 Diagrams
│       ├── UML_Diagrams_Smart_Parking_Management_System.pdf  # Combined UML specification PDF
│       ├── Use_Case_Diagram.pdf                 # Use Case Diagram
│       ├── Class_Diagram.pdf                    # Class Diagram
│       ├── Sequence_Diagram.pdf                 # Sequence Diagram
│       ├── Activity_Diagram.pdf                 # Activity Diagram
│       └── State_Diagram.pdf                    # State Diagram
│
├── src/                                         # Source code repository modules
│   └── README.md                                # Architecture layout & module breakdown
│
└── assets/                                      # Supporting images and SVG diagrams
    ├── context-diagram.svg
    ├── level-1-dfd.svg
    └── Use_Case_Diagram.jpg
```

---

## Installation and Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MySQL Server** (v8.0 or higher)

### Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Anubhavmittal07/Smart-Parking-Management-System.git
   cd Smart-Parking-Management-System
   ```

2. **Backend Setup**:
   ```bash
   cd src/backend
   npm install
   ```

3. **Database Configuration**:
   - Create a MySQL database named `spms_db`.
   - Import the schema from `src/database/schema.sql`.
   - Configure database credentials in `src/backend/.env`.

4. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

5. **Run the Application**:
   ```bash
   # Start backend API (Port 5000)
   cd src/backend
   npm start

   # Start frontend client (Port 3000)
   cd src/frontend
   npm start
   ```

---

## Software Engineering Design Deliverables

- [Session 9: Architecture Design](docs/Architecture.md)
- [System Architecture Diagram](docs/system-architecture.svg)
- [UML Class, Sequence, and Activity Diagrams](docs/UML-Design.md)
- [Session 10: Software Metrics Report](docs/Metrics-Report.md)
- [Design Analysis Report](docs/Design-Analysis-Report.md)
- [Design Analysis Report PDF](docs/Design-Analysis-Report.pdf)
- [Viva Questions and Answers](docs/Viva-Questions-and-Answers.md)
## Documentation

Direct links to the formal project deliverables:

- [Requirement Report](docs/Requirement_Report.pdf)
- [Software Requirements Specification (SRS)](docs/SRS_Smart_Parking_Management_System.pdf)
- [UML Diagrams Documentation](docs/uml/UML_Diagrams_Smart_Parking_Management_System.pdf)
- [Data Flow Diagrams (DFD)](docs/DFD.md)

---

## Team Members

| Name | Role | Institution |
|---|---|---|
| **Anubhav Mittal** | Team Lead / Documentation & Testing | KIET Deemed to be University |
| **Amit Kumar** | Backend Developer | KIET Deemed to be University |
| **Ankit Modi** | Frontend Developer | KIET Deemed to be University |
| **Arpit Gupta** | Database & System Design | KIET Deemed to be University |

---

## Future Scope

- **Mobile Application**: Native mobile app development for iOS and Android.
- **License Plate Recognition (ANPR) Integration**: Direct integration with hardware cameras for automatic barrier gate control.
- **EV Charging Slot Booking**: Specialized slot reservation for electric vehicle charging stations.
- **Dynamic Demand Pricing**: AI-based dynamic pricing algorithm based on peak hours and historical occupancy rates.


