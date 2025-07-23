# Tech Stack & Development Guide

## Core Technologies

- **Frontend**: React 19 + Vite + TypeScript
- **Backend**: Convex (serverless, real-time database)
- **Authentication**: Clerk
- **UI Framework**: shadcn/ui + Tailwind CSS + Radix UI
- **Routing**: Tanstack Router
- **Forms**: Tanstack Form + React Hook Form
- **Validation**: Zod schemas
- **State Management**: Zustand
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns

## Development Tools

- **Package Manager**: Bun (preferred) or npm
- **Linting**: Biome (replaces ESLint + Prettier)
- **Testing**: Vitest + Testing Library + Playwright (E2E)
- **Git Hooks**: Husky with pre-commit linting
- **Commit Standards**: Conventional commits with Commitizen

## Common Commands

### Development

```bash
bun run dev          # Start dev server with Convex backend
bun run dev:frontend # Frontend only
bun run dev:backend  # Convex backend only
```

### Building & Testing

```bash
bun run build       # Production build
bun run typecheck   # TypeScript checking
bun run lint        # Run Biome linting
bun run lint:fix    # Fix linting issues
bun run test        # Unit tests
bun run test:ui     # Tests with UI
bun run e2e         # E2E tests
```

### Utilities

```bash
bun run clean       # Clean build artifacts
bun run reset       # Reset node_modules
bun run preview     # Preview production build
```

## Code Standards

- Use TypeScript strict mode
- Follow Biome linting rules
- Prefer `const` over `let`, avoid `var`
- Use Zod for all data validation
- Implement proper error boundaries
- Use semantic HTML and ARIA attributes
- Follow conventional commit messages

## Architecture Patterns

- Component composition over inheritance
- Custom hooks for shared logic
- Zod schemas for type-safe validation
- Convex functions for backend logic
- Real-time data synchronization
- Optimistic updates where appropriate

## Environment Variables

Required in `.env.local`:

```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```
