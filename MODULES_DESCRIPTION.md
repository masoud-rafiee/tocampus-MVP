# ToCampus MVP - Module Descriptions

## Overview

ToCampus is implemented as a modular monolith with clear separation between frontend and backend layers. Each module encapsulates specific domain logic and can be independently tested and maintained.

---

## 🎨 Frontend Modules

### **1. App.jsx - Main Application Component**

**Purpose:** Root React component orchestrating the entire user interface

**Responsibilities:**
- State management for user interactions (RSVPs, likes, group memberships)
- Tab navigation and routing logic
- Mock data initialization and management
- Integration of all child components

**Key Features:**
- Mobile-first responsive layout
- Bottom navigation bar for thumb-friendly mobile use
- Side drawer menu for settings and profile
- Real-time state updates without page refreshes

**Technologies:** React 18, React Hooks (useState, useEffect)

---

### **2. MobileHeader Component**

**Purpose:** Top navigation bar with university branding

**Responsibilities:**
- Display application title/logo
- Menu toggle button
- Back navigation for nested views
- Sticky positioning for always-visible navigation

**UI Elements:**
- Hamburger menu icon
- ToCampus branding
- Gradient purple-to-blue background

---

### **3. BottomNav Component**

**Purpose:** Primary navigation interface for mobile users

**Responsibilities:**
- Tab switching between main sections (Feed, Events, Groups, Notifications, Profile)
- Visual feedback for active tab
- Icon-based navigation with labels

**Design Pattern:** Tab bar navigation (iOS/Android standard)

**Accessibility:** Clear labels, adequate touch targets (44x44px minimum)

---

### **4. EventCard Component**

**Purpose:** Display and interact with campus events

**Responsibilities:**
- Show event details (title, description, date/time, location)
- Display attendance count
- RSVP button with toggle state
- Category badge
- Visual date formatting ("Tomorrow", "In 3 days", etc.)

**Data Flow:**
```
Event data → EventCard → User interaction → State update → UI refresh
```

**Visual Design:**
- Gradient header image (purple → blue → orange)
- Card-based layout with rounded corners
- Icon-enhanced metadata (clock, location, attendees)
- Color-coded RSVP button (purple for action, green for confirmed)

---

### **5. AnnouncementCard Component**

**Purpose:** Social media-style feed posts

**Responsibilities:**
- Display announcement title and content
- Show author information with avatar
- Like/unlike functionality with count
- Comment interface
- Share button
- Timestamp with relative formatting ("2h ago")

**Interaction Pattern:**
```
User views → Can like → Can comment → Can share
```

**Features:**
- Instagram-inspired design
- Engagement metrics (likes, comments)
- Author profile display
- Time-ago formatting

---

### **6. GroupCard Component**

**Purpose:** Campus group/club discovery and joining

**Responsibilities:**
- Display group name, description, category
- Show member count
- Join/joined button with state toggle
- Gradient header visualization

**User Flow:**
```
Browse groups → View details → Join → Access group content
```

---

### **7. NotificationItem Component**

**Purpose:** Real-time notification display

**Responsibilities:**
- Show notification type, title, message
- Unread indicator (blue dot)
- Mark as read on click
- Icon based on notification type (calendar for events, message for announcements)

**Types Handled:**
- EVENT_REMINDER - Upcoming event alerts
- NEW_ANNOUNCEMENT - New post notifications
- RSVP_CONFIRMATION - Event registration confirmations
- EVENT_APPROVED - Admin approval notices

**Visual States:**
- Unread: Purple/blue gradient background with glowing border
- Read: Standard gray background

---

## ⚙️ Backend Modules

### **1. server.js - Main API Server**

**Purpose:** Express.js application entry point

**Responsibilities:**
- HTTP server initialization
- Middleware configuration (CORS, JSON parsing, authentication)
- Route registration
- In-memory database management
- Sample data initialization
- Error handling

**Middleware Stack:**
```
Request → CORS → JSON Parser → JWT Auth → Route Handler → Response
```

**Configuration:**
- Port: 3001 (development), process.env.PORT (production)
- JWT Secret: Environment variable with fallback
- CORS: Allow all origins (development), restricted (production)

---

### **2. Authentication Service**

**Purpose:** User registration, login, and session management

**Responsibilities:**
- User registration with email validation
- Password hashing with bcrypt (10 rounds + salt)
- JWT token generation (7-day expiration)
- Token verification middleware
- Role-based access control

**Security Measures:**
- Strong password hashing (bcrypt algorithm)
- JWT tokens for stateless authentication
- Role-based authorization guards
- Duplicate email prevention

**API Endpoints:**
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate and receive token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

**Data Flow:**
```
Registration: Email + Password → Hash → Store User → Generate JWT → Return Token
Login: Email + Password → Verify Hash → Generate JWT → Return Token
```

---

### **3. Event Service**

**Purpose:** Event lifecycle management

**Responsibilities:**
- Event creation (Staff/Faculty only)
- Admin approval workflow
- Event publication
- RSVP tracking
- Attendee count management
- Social media sharing triggers

**Business Rules:**
- Only STAFF, FACULTY, or ADMIN can create events
- Events start in DRAFT status
- Admin approval required before PUBLISHED status
- Published events visible to all university users
- RSVPs only allowed for published events

**State Machine:**
```
DRAFT → (Admin Approval) → PUBLISHED → (Start Time) → ACTIVE → (End Time) → COMPLETED
                                   ↓
                               CANCELLED
```

**API Endpoints:**
- `GET /api/events` - List all published events
- `POST /api/events` - Create new event
- `POST /api/events/:id/approve` - Approve event (Admin)
- `POST /api/events/:id/publish` - Publish event
- `POST /api/events/:id/rsvp` - Register attendance
- `POST /api/events/:id/share` - Share to social media

---

### **4. Group Service**

**Purpose:** Campus groups and club management

**Responsibilities:**
- Group creation (Staff/Faculty only)
- Membership management
- Group-scoped content filtering
- Role assignment (Admin, Moderator, Member)

**Membership Roles:**
- **ADMIN:** Full control, can moderate, manage members
- **MODERATOR:** Can post announcements, moderate content
- **MEMBER:** Can view content, participate in discussions

**API Endpoints:**
- `GET /api/groups` - List all groups
- `POST /api/groups` - Create new group
- `POST /api/groups/:id/join` - Join group
- `DELETE /api/groups/:id/leave` - Leave group

---

### **5. Announcement Service**

**Purpose:** Campus news and update management

**Responsibilities:**
- Announcement posting (Staff/Faculty only)
- Scope management (GLOBAL vs GROUP)
- Like/unlike functionality
- Comment management
- Social media sharing

**Scopes:**
- **GLOBAL:** Visible to all university users
- **GROUP:** Visible only to group members

**Engagement Features:**
- Likes with user tracking
- Comments with threading (Phase 2)
- Share to social media

**API Endpoints:**
- `GET /api/announcements` - List announcements
- `POST /api/announcements` - Post announcement
- `POST /api/announcements/:id/like` - Toggle like
- `POST /api/announcements/:id/comments` - Add comment
- `POST /api/announcements/:id/share` - Share to social media

---

### **6. Notification Service**

**Purpose:** User notification delivery

**Responsibilities:**
- Notification creation for system events
- Email delivery (via SMTP service)
- Push notifications (Phase 2)
- Read/unread tracking
- Notification filtering by user

**Notification Types:**
- EVENT_REMINDER - Sent 24h before event
- EVENT_APPROVED - When admin approves user's event
- RSVP_CONFIRMATION - After successful RSVP
- NEW_ANNOUNCEMENT - When new post is published
- NEW_MESSAGE - For chat messages (Phase 2)

**Delivery Channels:**
- EMAIL (Phase 1 MVP)
- PUSH (Phase 2)
- SMS (Phase 2)

**API Endpoints:**
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Dismiss notification

---

### **7. Social Integration Service**

**Purpose:** External social media cross-posting

**Responsibilities:**
- Social share record creation
- Platform-specific API adapters (Instagram, Facebook, LinkedIn)
- OAuth token management
- Retry logic for failed posts
- Success/failure tracking

**Platforms Supported:**
- Instagram (Graph API)
- Facebook (Graph API)
- LinkedIn (REST API)

**Share Process:**
```
Event/Announcement Published 
→ Create SocialShare records (PENDING)
→ Call platform APIs (async)
→ Update status (SUCCESS/FAILED)
→ Retry failed shares
```

**Data Model:**
```javascript
SocialShare {
  id, eventId?, announcementId?,
  platform: INSTAGRAM|FACEBOOK|LINKEDIN|TWITTER,
  status: PENDING|SUCCESS|FAILED,
  externalPostId?, errorMessage?,
  createdAt
}
```

**API Endpoints:**
- `POST /api/events/:id/share` - Share event to social platforms
- `POST /api/announcements/:id/share` - Share announcement to social platforms
- `GET /api/social/shares` - Get user's social share history

---

## 🔄 Data Flow Examples

### **1. User Registration Flow**
```
User Input (frontend)
  ↓
POST /api/auth/register
  ↓
Validate email uniqueness
  ↓
Hash password (bcrypt)
  ↓
Create User entity
  ↓
Store in DB.users
  ↓
Generate JWT token
  ↓
Return token + user info
  ↓
Frontend stores token
  ↓
Redirect to dashboard
```

### **2. Event Creation & Approval Flow**
```
Staff creates event (frontend)
  ↓
POST /api/events
  ↓
Validate staff role
  ↓
Create Event (status: DRAFT)
  ↓
Return event to frontend
  ↓
Admin views pending events
  ↓
POST /api/events/:id/approve
  ↓
Update isApproved = true
  ↓
Notify event creator
  ↓
Staff publishes event
  ↓
POST /api/events/:id/publish
  ↓
Update status = PUBLISHED
  ↓
Trigger social sharing
  ↓
Notify all users
```

### **3. RSVP Flow**
```
Student views event
  ↓
Clicks "RSVP Now"
  ↓
POST /api/events/:id/rsvp
  ↓
Check event published
  ↓
Create RSVP entity
  ↓
Add to event.rsvpIds[]
  ↓
Increment attendee count
  ↓
Send confirmation notification
  ↓
Update UI (green checkmark)
```

---

## 🏗️ Architecture Patterns

### **1. Layered Architecture**
```
Presentation Layer (React Components)
        ↓
Application Layer (API Routes)
        ↓
Business Layer (Services)
        ↓
Data Layer (In-memory DB / Prisma ORM)
```

### **2. Repository Pattern**

Each service interacts with data through repository interfaces, allowing easy swapping of in-memory storage with PostgreSQL/Prisma in production.

### **3. Dependency Injection**

Services receive dependencies (e.g., NotificationService, SocialIntegrationService) through constructor parameters, enabling testing and modularity.

---

## 🧪 Testing Strategy

### **Unit Tests**
- Individual service functions
- Component rendering
- Utility functions

### **Integration Tests**
- API endpoint responses
- Service interactions
- Database operations

### **E2E Tests**
- Complete user workflows
- Cross-module interactions
- UI automation

---

## 📊 Performance Considerations

### **Frontend**
- React.memo for expensive components
- Debounced search input
- Lazy loading for images
- Virtual scrolling for long lists

### **Backend**
- Database indexing on foreign keys
- Connection pooling
- Caching frequently accessed data
- Rate limiting on API endpoints

---

## 🔐 Security Measures

1. **Authentication:** JWT tokens with expiration
2. **Authorization:** Role-based guards on every protected route
3. **Input Validation:** Sanitize all user inputs
4. **Password Security:** Bcrypt with salt rounds
5. **HTTPS Only:** TLS 1.3 in production
6. **CORS:** Restricted origins in production

---

## 📈 Scalability Path

### **Phase 1: Modular Monolith**
- Single deployable
- Shared database
- In-process module communication

### **Phase 2: Microservices**
- Independent services (User, Event, Group, Notification)
- Service mesh with API Gateway
- Message broker (RabbitMQ/Kafka)
- Database per service

---

## 🎯 Alignment with SRS Requirements

| SRS Requirement | Module(s) | Status |
|-----------------|-----------|--------|
| FR1: User Registration | AuthService | ✅ |
| FR2: Password Reset | AuthService | ✅ |
| FR3: Role-Based Access | AuthService, Middleware | ✅ |
| FR4: Event Creation | EventService | ✅ |
| FR5: RSVP Management | EventService | ✅ |
| FR6: Announcements | AnnouncementService | ✅ |
| FR6a: Social Media Selection | SocialIntegrationService | ✅ |
| FR6b: Cross-Posting | SocialIntegrationService | ✅ |
| FR7: Group Creation | GroupService | ✅ |
| FR8: Group Announcements | AnnouncementService | ✅ |
| FR9: Group Notifications | NotificationService | ✅ |
| FR10: Real-Time Messaging | MessageService | 🔄 Phase 2 |
| FR12: Notifications | NotificationService | ✅ |
| FR13: Personalized Feed | Frontend | ✅ |

✅ = Implemented | 🔄 = Planned for Phase 2

---

**This modular design ensures maintainability, testability, and future scalability while meeting all Phase 1 MVP requirements specified in the SRS and architecture documents.**