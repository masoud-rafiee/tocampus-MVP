# ToCampus MVP - System Architecture

## 1. High-Level Architecture

### 1.1 System Overview
```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    React 18 Frontend                          │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │   │
│  │  │ App.jsx  │ │ EventCard│ │GroupCard │ │ AnnouncementCard │ │   │
│  │  │ (State)  │ │          │ │          │ │                  │ │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        API LAYER                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                  Express.js Server                           │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐ │   │
│  │  │  Auth  │ │ Events │ │ Groups │ │Announce- │ │ Notifi-  │ │   │
│  │  │ Routes │ │ Routes │ │ Routes │ │  ments   │ │ cations  │ │   │
│  │  └────────┘ └────────┘ └────────┘ └──────────┘ └──────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              In-Memory Database (Maps)                       │   │
│  │  ┌─────────┐ ┌───────┐ ┌────────┐ ┌────────┐ ┌───────────┐  │   │
│  │  │  Users  │ │Events │ │ Groups │ │Announce│ │Notifications│ │   │
│  │  │   Map   │ │  Map  │ │  Map   │ │  Map   │ │    Map    │  │   │
│  │  └─────────┘ └───────┘ └────────┘ └────────┘ └───────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Pattern
**Modular Monolith** - Single deployable application with clear module separation, designed for easy extraction into microservices in Phase 2.

## 2. Component Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React 18)                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────┐    ┌────────────────────────────────────┐     │
│   │ App.jsx     │◄───│ State Management (useState, useEffect) │   │
│   │ (Root)      │    └────────────────────────────────────┘     │
│   └──────┬──────┘                                                 │
│          │                                                        │
│   ┌──────┴──────────────────────────────────────┐                │
│   │                                              │                │
│   ▼              ▼              ▼               ▼                │
│ ┌──────┐    ┌─────────┐   ┌────────┐    ┌────────────┐         │
│ │Mobile│    │BottomNav│   │EventCard│    │Announcement│         │
│ │Header│    │         │   │GroupCard│    │    Card    │         │
│ └──────┘    └─────────┘   │Notif.  │    └────────────┘         │
│                           └────────┘                             │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      BACKEND (Express.js)                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    MIDDLEWARE LAYER                      │   │
│   │  ┌──────────┐  ┌────────────┐  ┌───────────────────┐    │   │
│   │  │   CORS   │  │ JSON Parser │  │ JWT Authentication │    │   │
│   │  └──────────┘  └────────────┘  └───────────────────┘    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                               │                                   │
│                               ▼                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    ROUTE HANDLERS                        │   │
│   │  ┌───────┐ ┌────────┐ ┌────────┐ ┌─────────┐ ┌───────┐ │   │
│   │  │ auth  │ │ events │ │ groups │ │announce │ │notifs │ │   │
│   │  │ POST  │ │GET/POST│ │GET/POST│ │GET/POST │ │GET    │ │   │
│   │  └───────┘ └────────┘ └────────┘ └─────────┘ └───────┘ │   │
│   └─────────────────────────────────────────────────────────┘   │
│                               │                                   │
│                               ▼                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    DATA ACCESS LAYER                     │   │
│   │              In-Memory Database (JavaScript Maps)        │   │
│   └─────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

## 3. Sequence Diagrams

### 3.1 User Authentication Flow
```
┌──────┐          ┌─────────┐          ┌──────────┐          ┌────┐
│Client│          │  Auth   │          │  Bcrypt  │          │ DB │
└──┬───┘          │ Routes  │          │          │          └──┬─┘
   │              └────┬────┘          └────┬─────┘             │
   │ POST /register    │                    │                   │
   │──────────────────►│                    │                   │
   │                   │ hash(password)     │                   │
   │                   │───────────────────►│                   │
   │                   │     hash           │                   │
   │                   │◄───────────────────│                   │
   │                   │                    │  store(user)      │
   │                   │──────────────────────────────────────►│
   │                   │                    │     OK            │
   │                   │◄──────────────────────────────────────│
   │   {token, user}   │                    │                   │
   │◄──────────────────│                    │                   │
```

### 3.2 Event RSVP Flow
```
┌──────┐          ┌─────────┐          ┌────────┐          ┌────┐
│Client│          │  Event  │          │  JWT   │          │ DB │
└──┬───┘          │ Routes  │          │Middleware│         └──┬─┘
   │              └────┬────┘          └────┬───┘              │
   │ POST /events/:id/rsvp (token)          │                  │
   │──────────────────►│                    │                  │
   │                   │ verify(token)      │                  │
   │                   │───────────────────►│                  │
   │                   │    user            │                  │
   │                   │◄───────────────────│                  │
   │                   │                    │ create RSVP      │
   │                   │─────────────────────────────────────►│
   │                   │                    │    RSVP          │
   │                   │◄─────────────────────────────────────│
   │    {rsvp}         │                    │                  │
   │◄──────────────────│                    │                  │
```

## 4. Class Diagram (Data Models)

```
┌─────────────────────────┐     ┌─────────────────────────┐
│       University        │     │          User           │
├─────────────────────────┤     ├─────────────────────────┤
│ - id: UUID              │     │ - id: UUID              │
│ - name: String          │◄───┐│ - universityId: UUID    │
│ - domain: String        │    ││ - email: String         │
│ - locale: String        │    ││ - passwordHash: String  │
│ - timezone: String      │    ││ - firstName: String     │
│ - brandingConfig: JSON  │    ││ - lastName: String      │
│ - createdAt: DateTime   │    ││ - role: Enum            │
└─────────────────────────┘    │└─────────────────────────┘
                               │            │
                               │            │ creates
                               │            ▼
┌─────────────────────────┐    │ ┌─────────────────────────┐
│         Event           │    │ │      Announcement       │
├─────────────────────────┤    │ ├─────────────────────────┤
│ - id: UUID              │    │ │ - id: UUID              │
│ - universityId: UUID    │────┘ │ - universityId: UUID    │
│ - creatorId: UUID       │◄────┐│ - authorId: UUID        │
│ - title: String         │     ││ - title: String         │
│ - description: String   │     ││ - content: String       │
│ - startTime: DateTime   │     ││ - scope: Enum           │
│ - endTime: DateTime     │     ││ - groupId: UUID?        │
│ - location: String      │     ││ - likeUserIds: UUID[]   │
│ - category: String      │     ││ - commentIds: UUID[]    │
│ - status: Enum          │     ││ - createdAt: DateTime   │
│ - isApproved: Boolean   │     │└─────────────────────────┘
│ - rsvpIds: UUID[]       │     │
│ - createdAt: DateTime   │     │
└─────────────────────────┘     │
            │                   │
            │ has               │ has
            ▼                   │
┌─────────────────────────┐     │ ┌─────────────────────────┐
│          RSVP           │     │ │         Group           │
├─────────────────────────┤     │ ├─────────────────────────┤
│ - id: UUID              │     │ │ - id: UUID              │
│ - userId: UUID          │     │ │ - universityId: UUID    │
│ - eventId: UUID         │     │ │ - name: String          │
│ - status: Enum          │     │ │ - description: String   │
│ - createdAt: DateTime   │     │ │ - category: String      │
└─────────────────────────┘     │ │ - membershipIds: UUID[] │
                                │ │ - createdAt: DateTime   │
                                │ └─────────────────────────┘
                                │             │
                                │             │ has
                                │             ▼
                                │ ┌─────────────────────────┐
                                │ │      Membership         │
                                │ ├─────────────────────────┤
                                └─│ - id: UUID              │
                                  │ - userId: UUID          │
                                  │ - groupId: UUID         │
                                  │ - role: Enum            │
                                  │ - joinedAt: DateTime    │
                                  └─────────────────────────┘
```

## 5. Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRODUCTION DEPLOYMENT                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐         ┌─────────────────┐               │
│  │     Vercel      │         │    Railway      │               │
│  │   (Frontend)    │         │   (Backend)     │               │
│  │                 │         │                 │               │
│  │  React Build    │────────►│  Express API    │               │
│  │  Static Files   │  REST   │  Node.js        │               │
│  │  CDN            │         │  PostgreSQL*    │               │
│  └─────────────────┘         └─────────────────┘               │
│         │                            │                          │
│         │ HTTPS                      │ HTTPS                    │
│         ▼                            ▼                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Users (Web Browsers)                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  * PostgreSQL planned for Phase 2; MVP uses in-memory storage   │
└─────────────────────────────────────────────────────────────────┘
```

## 6. Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 18 | UI framework |
| Styling | Tailwind CSS | Utility-first CSS |
| Icons | Lucide React | Icon library |
| Backend | Express.js 4.18 | REST API server |
| Authentication | JWT | Stateless auth tokens |
| Password Security | bcryptjs | Password hashing |
| ID Generation | uuid v4 | Unique identifiers |
| CORS | cors middleware | Cross-origin requests |

## 7. Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. TRANSPORT SECURITY                                          │
│     └── HTTPS/TLS 1.3 (Production)                              │
│                                                                  │
│  2. AUTHENTICATION                                              │
│     └── JWT Tokens (7-day expiration)                           │
│         └── Bearer token in Authorization header                │
│                                                                  │
│  3. PASSWORD SECURITY                                           │
│     └── bcrypt with 10 salt rounds                              │
│         └── Never stored in plaintext                           │
│                                                                  │
│  4. AUTHORIZATION (RBAC)                                        │
│     ├── STUDENT: View content, RSVP, join groups               │
│     ├── STAFF/FACULTY: Create events, announcements            │
│     └── ADMIN: Approve events, full access                      │
│                                                                  │
│  5. INPUT VALIDATION                                            │
│     └── Request body validation before processing               │
│                                                                  │
│  6. CORS PROTECTION                                             │
│     └── Restricted origins in production                        │
└─────────────────────────────────────────────────────────────────┘
```

## 8. Non-Functional Requirements

| Requirement | Target | Implementation |
|-------------|--------|----------------|
| Response Time | < 2 seconds | In-memory DB, efficient queries |
| Concurrent Users | 500+ | Stateless design, horizontal scaling |
| Uptime | 99.5% | Cloud hosting (Railway/Vercel) |
| Scalability | Horizontal | Modular monolith → Microservices |
| Security | HTTPS, JWT, RBAC | Implemented |
| Multi-tenancy | 5+ universities | universityId scoping |

---

*This architecture document aligns with the Software Requirements Specification (SRS) for the ToCampus MVP system.*
