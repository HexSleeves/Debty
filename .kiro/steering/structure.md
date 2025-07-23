# Project Structure & Organization

## Root Structure

```
├── src/                 # Frontend source code
├── convex/             # Backend functions and schema
├── docs/               # Project documentation
├── public/             # Static assets
├── .kiro/              # Kiro configuration and steering
└── dist/               # Build output
```

## Frontend Structure (`src/`)

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # shadcn/ui base components
│   ├── dashboard/     # Dashboard-specific components
│   ├── debts/         # Debt management components
│   ├── strategies/    # Strategy-related components
│   ├── forms/         # Form components
│   ├── shared/        # Shared utility components
│   └── typography/    # Text and typography components
├── pages/             # Page components (route handlers)
│   ├── auth/          # Authentication pages
│   └── dashboard/     # Dashboard pages
├── layouts/           # Layout wrapper components
├── providers/         # React context providers
├── router/            # Tanstack Router configuration
├── lib/               # Utility functions and types
│   ├── types/         # TypeScript type definitions
│   ├── validation/    # Zod validation schemas
│   ├── calculations/  # Debt calculation algorithms
│   └── utils/         # General utility functions
└── assets/            # Images, icons, etc.
```

## Backend Structure (`convex/`)

```
convex/
├── _generated/        # Auto-generated Convex files (don't edit)
├── _schema.ts         # Database schema definition
├── auth.config.js     # Clerk authentication config
└── myFunctions.ts     # Backend API functions
```

## Component Organization Patterns

### UI Components (`src/components/ui/`)

- Base components from shadcn/ui
- Customized with project-specific styling
- Fully accessible and keyboard navigable

### Feature Components

- Organized by domain (debts, strategies, dashboard)
- Each folder contains related components
- Use index files for clean imports

### Page Components (`src/pages/`)

- Mirror the application's routing structure
- Use bracket notation for dynamic routes: `[id].tsx`
- Keep pages thin, delegate logic to components

## File Naming Conventions

- **Components**: PascalCase (`DebtCard.tsx`)
- **Pages**: kebab-case (`sign-in.tsx`) or bracket notation (`[id].tsx`)
- **Utilities**: camelCase (`calculatePayoff.ts`)
- **Types**: kebab-case (`debt-types.ts`)
- **Schemas**: kebab-case (`debt-schemas.ts`)

## Import Path Aliases

- `@/` maps to `src/` directory
- Use absolute imports: `import { Button } from "@/components/ui/button"`
- Prefer named exports over default exports

## Data Flow Patterns

1. **Convex Schema** → defines database structure
2. **Zod Schemas** → validate input/output data
3. **TypeScript Types** → provide compile-time safety
4. **Components** → consume typed data via Convex hooks

## Testing Structure

- Unit tests: `*.test.tsx` alongside components
- E2E tests: separate `tests/` directory
- Test utilities: `src/test-setup.ts`

## Configuration Files

- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `biome.json` - Linting and formatting rules
- `components.json` - shadcn/ui configuration
