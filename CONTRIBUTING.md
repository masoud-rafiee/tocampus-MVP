# Contributing to ToCampus

Thank you for your interest in contributing to ToCampus! This document provides guidelines and instructions for contributing.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/tocampus-MVP.git
   cd tocampus-MVP
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (root, backend, frontend)
   npm run install:all
   
   # Or install individually
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Start development servers**
   ```bash
   # From root directory - starts both servers
   npm start
   
   # Or run individually:
   # Terminal 1: Backend (http://localhost:3001)
   cd backend && npm start
   
   # Terminal 2: Frontend (http://localhost:3000)
   cd frontend && npm start
   ```

4. **Test accounts**
   | Role | Email | Password |
   |------|-------|----------|
   | Student | student@ubishops.ca | password123 |
   | Staff | staff@ubishops.ca | password123 |
   | Admin | admin@ubishops.ca | password123 |

## Making Changes

### Branch Naming Convention
- `feature/` - New features (e.g., `feature/dark-mode`)
- `fix/` - Bug fixes (e.g., `fix/login-redirect`)
- `docs/` - Documentation (e.g., `docs/api-update`)
- `refactor/` - Code refactoring (e.g., `refactor/auth-service`)

### Workflow
1. Create a branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Run tests
   ```bash
   # Run all tests
   npm test
   
   # Backend only (36 tests)
   cd backend && npm test
   
   # Frontend only (9 tests)
   cd frontend && npm test
   ```

4. Build to check for errors
   ```bash
   cd frontend && npm run build
   ```

5. Commit your changes
   ```bash
   git add .
   git commit -m "type: description"
   ```

### Commit Message Format
Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting (no code change)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance

Examples:
```
feat: Add group creation modal
fix: Resolve duplicate marketplace rendering
docs: Update API documentation for v3.0
```

## Coding Standards

### JavaScript/React
- Use functional components with hooks
- Use ES6+ features
- Prefer `const` over `let`
- Use descriptive variable names
- Add JSDoc comments for complex functions

### CSS/Tailwind
- Use Tailwind utility classes
- Follow mobile-first design
- Use consistent spacing (Tailwind scale)

### Backend
- Use async/await for asynchronous operations
- Validate all inputs
- Return consistent error responses
- Add appropriate HTTP status codes

## Testing

### Backend Tests (Jest + Supertest)
Located in `backend/__tests__/`

```bash
cd backend && npm test
```

Test coverage includes:
- Authentication (6 tests)
- Events (3 tests)
- Groups (1 test)
- Announcements (1 test)
- User Profiles (2 tests)
- Social Graph (3 tests)
- Marketplace (4 tests)
- Recommendations (4 tests)
- Chatbot (3 tests)
- Admin Analytics (3 tests)
- Search (1 test)

### Frontend Tests (Jest + React Testing Library)
Located in `frontend/src/`

```bash
cd frontend && npm test
```

## Submitting Changes

1. Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a Pull Request
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

3. Wait for review
   - CI/CD pipeline will run automatically
   - Address any review comments

## Project Structure

```
tocampus-MVP/
├── backend/
│   ├── server.js           # Main API server
│   ├── middleware/         # Auth, validation middleware
│   ├── models/             # Data models
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic
│   └── __tests__/          # Jest test suite
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React app
│   │   ├── components/     # Reusable components
│   │   └── index.css       # Tailwind + custom styles
│   └── public/
├── docs/                   # Documentation
└── .github/                # GitHub templates & workflows
```

## Need Help?

- Check [API Documentation](docs/API_DOCUMENTATION.md)
- Read [Architecture Guide](docs/ARCHITECTURE.md)
- Review [User Guide](docs/USER_GUIDE.md)
- Open an issue for questions

---

Thank you for contributing to ToCampus! 🎓
