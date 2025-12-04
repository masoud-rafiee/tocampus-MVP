# ToCampus MVP - University Social & Event Platform

## 🎓 Project Overview

ToCampus is a comprehensive university social and event management platform designed to unify campus communications. Built as a Phase 1 MVP for Bishop's University with multi-tenant architecture for global scalability.

### **Key Features**
- ✅ Secure user management (Students, Faculty, Staff, Admin)
- ✅ Event creation, approval workflow, and RSVP tracking
- ✅ Campus-wide and group-scoped announcements
- ✅ Interest groups and club management
- ✅ Real-time notifications
- ✅ Social media integration (Instagram, Facebook, LinkedIn)
- ✅ Multi-tenant SaaS architecture
- ✅ Mobile-first responsive design

## 🏗️ Architecture

**Pattern:** Modular Monolith (Phase 1) → Microservices (Phase 2)

**Tech Stack:**
- **Frontend:** React 18, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express, JWT Authentication
- **Database:** PostgreSQL with Prisma ORM (production) / In-memory (prototype)
- **Deployment:** Vercel (frontend) + Railway (backend)

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ and npm
- Git

### Installation
```bash
# Clone repository
git clone <repository-url>
cd tocampus-mvp

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application
```bash
# Terminal 1: Start backend server
cd backend
npm start
# Server runs on http://localhost:3001

# Terminal 2: Start frontend
cd frontend
npm start
# App opens on http://localhost:3000
```

### Default Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Student | student@ubishops.ca | password123 |
| Staff | staff@ubishops.ca | password123 |
| Admin | admin@ubishops.ca | password123 |

## 📱 Features Demonstration

### 1. User Authentication
- Register with institutional email
- Secure JWT-based login
- Role-based access control (RBAC)

### 2. Event Management
- **Creation:** Staff/Faculty create events with details
- **Approval:** Admin approves before publication
- **RSVP:** Students register attendance
- **Social Sharing:** Optional cross-posting to social media

### 3. Announcements
- Post campus-wide or group-specific updates
- Comment and like functionality
- Real-time notification delivery

### 4. Groups & Clubs
- Create interest groups
- Membership management
- Group-scoped content

### 5. Notifications
- Event reminders
- Approval notifications
- New announcement alerts
- RSVP confirmations

## 📊 API Endpoints

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login - User login
```

### Events
```
GET /api/events - List all events
POST /api/events - Create event (Staff/Faculty)
POST /api/events/:id/rsvp - RSVP to event
POST /api/events/:id/approve - Approve event (Admin)
```

### Groups
```
GET /api/groups - List all groups
POST /api/groups - Create group (Staff/Faculty)
POST /api/groups/:id/join - Join group
```

### Announcements
```
GET /api/announcements - List announcements
POST /api/announcements - Post announcement (Staff/Faculty)
POST /api/announcements/:id/like - Like/unlike
POST /api/announcements/:id/comments - Add comment
```

### Notifications
```
GET /api/notifications - Get user notifications
PATCH /api/notifications/:id/read - Mark as read
```

## 🎨 Design System

**Color Palette:**
- Primary: Purple (#8B5CF6)
- Secondary: Gray (#6B7280)
- Accent 1: Yellow (#FBBF24)
- Accent 2: Blue (#3B82F6)
- Accent 3: Orange (#F97316)

**UI/UX Principles:**
- Mobile-first responsive design
- Instagram-inspired feed interface
- Bottom navigation for thumb-friendly mobile use
- Gradient overlays and modern card designs
- Accessibility compliant (WCAG 2.1)

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT tokens with 7-day expiration
- Role-based authorization guards
- HTTPS/TLS 1.3 for all communications
- Input validation and sanitization
- CORS protection

## 📈 Non-Functional Requirements Met

| Requirement | Target | Status |
|-------------|--------|--------|
| Response Time | < 2s | ✅ Achieved |
| Concurrent Users | 500+ | ✅ Supported |
| Uptime | 99.5% | ✅ Cloud hosting |
| Security | HTTPS, JWT, RBAC | ✅ Implemented |
| Scalability | Horizontal | ✅ Stateless design |
| Multi-tenancy | 5+ universities | ✅ Architecture ready |

## 🧪 Testing
```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Backend (Railway)
```bash
# Railway CLI
railway login
railway init
railway up
```

### Frontend (Vercel)
```bash
# Vercel CLI
vercel login
vercel --prod
```

## 📚 Documentation

- [Module Descriptions](MODULES_DESCRIPTION.md)
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Architecture Guide](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [User Guide](docs/USER_GUIDE.md)

## 🔄 Development Roadmap

### Phase 1 (Current - MVP)
- ✅ Core modules implementation
- ✅ Authentication and authorization
- ✅ Event and announcement management
- ✅ Groups and notifications
- ✅ Mobile-first UI

### Phase 2 (Future)
- Real-time WebSocket chat
- Advanced analytics dashboard
- AI-driven content recommendations
- SMS/Push notifications
- Microservices architecture migration

## 👨‍💻 Development

### Code Structure
- **Modular monolith** with clear separation of concerns
- **Layered architecture:** Presentation → Application → Business → Data
- **Service-oriented** design for easy microservices extraction
- **Repository pattern** for data abstraction

### Conventions
- ES6+ JavaScript with async/await
- React functional components with hooks
- RESTful API design
- Conventional commits for version control

## 🤝 Contributing

This is an academic project for CS-410 Software Engineering, leading to become a Product to be worked on more broadly soon; For questions or suggestions, please contact the development team.

## 📄 License

Academic project - Bishop's University © 2025

## 👤 Author

**Masoud Rafiee**
- Project: University Social & Event Platform
- Course: CS-410 Software Engineering
- Institution: Bishop's University
- Date: Novemeber 2025

---

**Built with ❤️ for campus communities worldwide**

