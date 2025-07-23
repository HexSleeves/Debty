# Task Category: Project Setup & Configuration

## Overview
Initial project setup, development environment configuration, and core dependencies installation.

## Tasks

### 1.1 Initialize Vite + React Project
**Priority:** Must Have  
**Effort:** 1 hour  
**Dependencies:** None  

**Subtasks:**
- [ ] Create new Vite project with React TypeScript template
- [ ] Configure TypeScript with strict mode
- [ ] Set up ESLint and Prettier
- [ ] Configure `.gitignore` and `.env.example`
- [ ] Set up path aliases (@/* imports)

**Acceptance Criteria:**
- Project runs with `npm run dev`
- TypeScript configured with strict settings
- Linting passes without errors
- Hot Module Replacement (HMR) works

### 1.2 Install Core Dependencies
**Priority:** Must Have  
**Effort:** 30 minutes  
**Dependencies:** 1.1  

**Subtasks:**
- [ ] Install Convex
- [ ] Install Clerk for React
- [ ] Install React Router
- [ ] Install shadcn/ui CLI
- [ ] Install Tanstack Form
- [ ] Install Zustand for local state
- [ ] Install development dependencies

**Commands:**
```bash
npm install convex @clerk/clerk-react react-router-dom @tanstack/react-form zustand
npx shadcn-ui@latest init
npm install -D vitest @testing-library/react @playwright/test @types/react @types/react-dom
```

### 1.3 Configure Convex Backend
**Priority:** Must Have  
**Effort:** 1 hour  
**Dependencies:** 1.2  

**Subtasks:**
- [ ] Initialize Convex project
- [ ] Create schema.ts with initial tables
- [ ] Set up development and production deployments
- [ ] Configure environment variables

**Acceptance Criteria:**
- Convex dashboard accessible
- Schema deployed successfully
- Can run Convex dev server

### 1.4 Configure Clerk Authentication
**Priority:** Must Have  
**Effort:** 1 hour  
**Dependencies:** 1.2  

**Subtasks:**
- [ ] Create Clerk application
- [ ] Configure sign-in/sign-up components
- [ ] Set up protected route wrapper
- [ ] Add Clerk environment variables to .env
- [ ] Configure Clerk with Convex

**Acceptance Criteria:**
- Sign in/up pages accessible
- Authentication flow works
- Protected routes redirect to login
- User identity available in Convex

### 1.5 Set Up shadcn/ui Components
**Priority:** Must Have  
**Effort:** 30 minutes  
**Dependencies:** 1.2  

**Subtasks:**
- [ ] Configure Tailwind CSS
- [ ] Install initial components (Button, Card, Form, etc.)
- [ ] Set up theme configuration
- [ ] Configure dark mode support

**Acceptance Criteria:**
- Components render correctly
- Dark mode toggle works
- Tailwind classes apply properly

### 1.6 Configure Testing Environment
**Priority:** Should Have  
**Effort:** 1 hour  
**Dependencies:** 1.2  

**Subtasks:**
- [ ] Set up Vitest configuration
- [ ] Configure React Testing Library
- [ ] Set up Playwright for E2E tests
- [ ] Create test utilities and mocks

**Acceptance Criteria:**
- Can run unit tests
- Can run component tests
- E2E test runner works

### 1.7 Set Up Development Tooling
**Priority:** Should Have  
**Effort:** 30 minutes  
**Dependencies:** 1.1  

**Subtasks:**
- [ ] Configure VS Code settings
- [ ] Set up Git hooks with Husky
- [ ] Configure commitlint
- [ ] Add npm scripts for common tasks

**Acceptance Criteria:**
- Pre-commit hooks run tests
- Commit messages validated
- Development scripts work

### 1.8 Create Initial Project Structure
**Priority:** Must Have  
**Effort:** 45 minutes  
**Dependencies:** 1.1  

**Subtasks:**
- [ ] Create src folder structure per implementation plan
- [ ] Set up React Router configuration
- [ ] Create layout components
- [ ] Add provider wrappers (Theme, Auth, Convex)
- [ ] Create placeholder pages
- [ ] Add README with setup instructions

**Acceptance Criteria:**
- Folder structure matches plan
- All routes accessible via React Router
- Providers properly nested
- README has clear instructions

### 1.9 Configure Vite Build Settings
**Priority:** Should Have  
**Effort:** 30 minutes  
**Dependencies:** 1.1  

**Subtasks:**
- [ ] Configure vite.config.ts
- [ ] Set up build optimization
- [ ] Configure environment variables
- [ ] Set up proxy for development

**Acceptance Criteria:**
- Build produces optimized output
- Environment variables work correctly
- Development proxy configured

## Summary
**Total Effort:** ~6.5 hours  
**Blockers:** Need API keys for Clerk and Convex  
**Notes:** This phase establishes the foundation for all subsequent development. Vite provides much faster development experience compared to traditional bundlers.