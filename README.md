# ToCampus v3.0 - University Social & Event Platform

<div align="center">

![ToCampus Logo](https://img.shields.io/badge/ToCampus-v3.0-purple?style=for-the-badge&logo=graduation-cap)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Tests](https://img.shields.io/badge/Tests-45%20Passing-success?style=flat-square)
![SRS](https://img.shields.io/badge/SRS-v3.0-orange?style=flat-square)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=flat-square)

**Your Campus. Connected.**

</div>

---

## 🎓 Project Overview

ToCampus is a comprehensive university social and event management platform designed to unify campus communications. Built as a **production-ready application** for Bishop's University with multi-tenant architecture for global scalability.

**Implements:** SRS v3.0 (CS-410 Final Project) - **Beyond MVP**

### ✨ Key Features

| Module | Features | SRS Sections |
|--------|----------|--------------|
| **Authentication** | Secure login, university email validation, password reset | FR1-FR4 |
| **Events** | Creation, RSVP, approval workflow, calendar integration | FR5-FR7 |
| **Announcements** | Campus-wide posts, comments, likes, sharing | FR8-FR10 |
| **Groups & Clubs** | Membership, group creation modal, category filters | FR12-FR15 |
| **Marketplace** | Buy/sell textbooks, electronics, furniture (Quick Access) | FR37-FR40 |
| **Social Graph** | Follow/unfollow, followers, mutual friends | FR34-FR36 |
| **Rich Profiles** | Bio, program, interests, privacy settings | FR28-FR33 |
| **Recommendations** | AI-powered event/group suggestions | FR41-FR43 |
| **LLM Chatbot** | Campus assistant with natural language (Quick Access) | FR44-FR47 |
| **Admin Dashboard** | Analytics, audit logs, moderation | FR24-FR27 |
| **Notifications** | **Enhanced notification center** with filters, settings | FR20-FR23 |

---

## 🏗️ Architecture

**Pattern:** Modular Monolith (Phase 1) → Microservices (Phase 2)

```
┌─────────────────────────────────────────────────────────────┐
│                      ToCampus Platform v3.0                  │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React 18 + Tailwind CSS)                          │
│  ├── Authentication Flow (Splash, Login, Register)          │
│  ├── Feed with Recommendations                               │
│  ├── Events & Groups Management (with Create Modal)         │
│  ├── **Enhanced Notifications** (filters, time groups)      │
│  ├── User Profiles with Social Graph                        │
│  └── **Quick Access Menu** (Marketplace, Assistant, etc.)   │
├─────────────────────────────────────────────────────────────┤
│  Navigation Structure                                        │
│  ├── Bottom Nav: Feed → Events → Groups → Alerts → Profile  │
│  └── Quick Access (FAB): Marketplace, Chatbot, Discover     │
├─────────────────────────────────────────────────────────────┤
│  Backend API (Express.js + JWT)                              │
│  ├── 48 RESTful Endpoints                                   │
│  ├── Recommendation Engine                                   │
│  ├── Chatbot Service                                        │
│  └── Audit Logging                                          │
├─────────────────────────────────────────────────────────────┤
│  Data Layer (In-Memory → PostgreSQL)                        │
│  └── 20+ Entity Types (User, Event, Listing, etc.)         │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Tailwind CSS, Lucide Icons |
| Backend | Node.js 18+, Express.js, JWT (7-day) |
| Database | In-memory Maps (→ PostgreSQL/Prisma) |
| Testing | Jest, Supertest, React Testing Library |
| CI/CD | GitHub Actions (3-stage pipeline) |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ and npm
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/masoud-rafiee/tocampus-MVP.git
cd tocampus-MVP

# Install all dependencies
npm run install:all

# Or install individually:
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### Running the Application

```bash
# From root directory - start both servers
npm start

# Or run individually:
# Terminal 1: Backend (http://localhost:3001)
cd backend && npm start

# Terminal 2: Frontend (http://localhost:3000)
cd frontend && npm start
```

### Running Tests

```bash
# Run all tests (45 total)
npm test

# Backend tests only (36 tests)
cd backend && npm test

# Frontend tests only (9 tests)
cd frontend && npm test
```

---

## 👤 Test Accounts

| Role | Email | Password | Capabilities |
|------|-------|----------|--------------|
| **Student** | student@ubishops.ca | password123 | View content, RSVP, join groups, marketplace |
| **Staff** | staff@ubishops.ca | password123 | + Create events, post announcements |
| **Admin** | admin@ubishops.ca | password123 | + Admin dashboard, approve events, analytics |

---

## 📱 Features Walkthrough

### Navigation Structure (v3.0)

**Bottom Navigation Bar (5 tabs):**
| Tab | Icon | Description |
|-----|------|-------------|
| Feed | 🏠 | Main announcement feed with recommendations |
| Events | 📅 | Browse and RSVP to campus events |
| Groups | 👥 | Join groups, create new groups (Staff+) |
| Alerts | 🔔 | **Enhanced notifications** with badge count |
| Profile | 👤 | Account settings and profile management |

**Quick Access Menu (Floating Action Button):**
| Item | Icon | Description |
|------|------|-------------|
| Marketplace | 🛒 | Buy/sell textbooks, electronics, furniture |
| Assistant | 🤖 | AI-powered campus chatbot |
| Discover | 🔍 | Search across events, groups, announcements |
| Settings | ⚙️ | App settings and preferences |

### 1. Enhanced Notifications (FR20-23) ⭐ NEW
- **Time-based grouping:** Today, Yesterday, This Week, Older
- **Type filters:** All, Events, Groups, System
- **Settings panel:** Configure notification preferences
- **Mark all as read** with one tap
- **Unread badge** on navigation tab

### 2. Enhanced Groups (FR12-15) ⭐ IMPROVED
- **Category filters:** Academic, Sports, Arts, Tech, Social, Career
- **Search functionality:** Find groups by name or description
- **Create Group Modal:** Staff/Faculty can create new groups
- **Member counts** and category badges

### 3. Marketplace (FR37-40) - Quick Access
- Browse categories: Textbooks, Electronics, Furniture, Clothing
- Filter by price, condition, search terms
- Message sellers directly
- Create listings with photos and details
- **Access via Quick Access Menu (FAB)**

### 4. Campus Assistant (FR44-47) - Quick Access
- Natural language queries: "What events are happening?"
- Contextual suggestions
- Links to relevant content (events, groups, listings)
- **Access via Quick Access Menu (FAB)**

### 5. Social Graph (FR34-36)
- Follow other students
- View followers/following lists
- Discover mutual friends
- Profile privacy controls

### 6. Rich Profiles (FR28-33)
- Program and year of study
- Interests selection
- Social links (LinkedIn, Instagram, etc.)
- Privacy settings (visibility controls)

### 7. Admin Dashboard (FR24-27)
- Real-time analytics (users, events, engagement)
- Audit log viewer
- Event approval queue
- User management

---

## 📊 API Overview

**Base URL:** `http://localhost:3001/api`

| Category | Endpoints | Example |
|----------|-----------|---------|
| Auth | 4 | `POST /auth/login` |
| Users | 9 | `GET /users/:id/followers` |
| Events | 6 | `POST /events/:id/rsvp` |
| Marketplace | 6 | `GET /marketplace?category=textbooks` |
| Recommendations | 4 | `GET /recommendations/events` |
| Chatbot | 3 | `POST /chatbot/conversations/:id/messages` |
| Admin | 2 | `GET /admin/analytics` |

📚 **Full documentation:** [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

---

## 🧪 Test Coverage

```
Tests: 45 passing (36 backend + 9 frontend)

Backend Tests:
  ✓ Authentication (6 tests)
  ✓ Events (3 tests)
  ✓ Groups (1 test)
  ✓ Announcements (1 test)
  ✓ User Profiles (2 tests)
  ✓ Social Graph (3 tests)
  ✓ Marketplace (4 tests)
  ✓ Recommendations (4 tests)
  ✓ Chatbot (3 tests)
  ✓ Admin Analytics (3 tests)

Frontend Tests:
  ✓ Splash Screen (2 tests)
  ✓ Login Screen (3 tests)
  ✓ UI Components (2 tests)
  ✓ Utilities (2 tests)
```

---

## 🔧 Configuration

### Environment Variables

```bash
# Backend (.env)
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development

# Frontend (.env)
REACT_APP_API_URL=http://localhost:3001/api
```

---

## 📁 Project Structure

```
tocampus-MVP/
├── backend/
│   ├── server.js           # Main API server (~2000 lines)
│   ├── __tests__/          # Jest test suite
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React app (~4500 lines)
│   │   ├── App.test.js     # Frontend tests
│   │   ├── index.css       # Tailwind + custom animations
│   │   └── index.js
│   └── package.json
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── ARCHITECTURE.md
│   ├── USER_GUIDE.md
│   └── DEPLOYMENT_GUIDE.md
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions pipeline
├── MODULES_DESCRIPTION.md  # Detailed module documentation
└── package.json
```

---

## 🚢 Deployment

### CI/CD Pipeline

The project uses GitHub Actions with 3 stages:

1. **Backend Tests** - Run Jest tests (36 tests)
2. **Frontend Tests & Build** - Run React tests, build production bundle
3. **Deploy** - Deploy to Vercel/Railway

```yaml
# Trigger on push to main
on:
  push:
    branches: [main]

# Build configuration
env:
  CI: false                    # Allows build with warnings
  DISABLE_ESLINT_PLUGIN: true  # Cleaner build output
```

### Manual Deployment

```bash
# Backend to Railway
railway login
railway up

# Frontend to Vercel
vercel --prod
```

---

## 📈 Roadmap

### Phase 1 (Current - v3.0) ✅ PRODUCTION READY
- [x] Authentication & Authorization
- [x] Events & RSVP
- [x] Announcements & Comments
- [x] Groups & Membership + **Create Group Modal**
- [x] Marketplace (via Quick Access)
- [x] Social Graph
- [x] Recommendations
- [x] Chatbot (via Quick Access)
- [x] Admin Dashboard
- [x] **Enhanced Notifications** (filters, time groups, settings)
- [x] **Quick Access Menu** (FAB)
- [x] **Bottom Nav with Badge Support**

### Phase 2 (Planned)
- [ ] Real-time messaging (WebSocket)
- [ ] Push notifications (FCM)
- [ ] Image upload (S3/Cloudinary)
- [ ] PostgreSQL migration
- [ ] Mobile app (React Native)
- [ ] External LLM integration (OpenAI)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is part of CS-410 Software Engineering course at Bishop's University.

---

## 👥 Team

**ToCampus Development Team**
- Software Engineering Project

---

<div align="center">

**Built with ❤️ for the university community**

[Report Bug](https://github.com/masoud-rafiee/tocampus-MVP/issues) · [Request Feature](https://github.com/masoud-rafiee/tocampus-MVP/issues)

</div>

