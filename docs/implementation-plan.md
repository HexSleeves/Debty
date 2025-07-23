# Implementation Plan: Component Structure & API Design

## 1. Project Structure

```
debty/
├── src/
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── sign-in.tsx
│   │   │   └── sign-up.tsx
│   │   ├── dashboard/
│   │   │   ├── index.tsx         # Dashboard home
│   │   │   ├── debts/
│   │   │   │   ├── index.tsx     # Debt list
│   │   │   │   ├── [id].tsx      # Debt detail
│   │   │   │   └── new.tsx       # Add debt
│   │   │   ├── strategies/
│   │   │   │   ├── index.tsx     # Strategy selection
│   │   │   │   └── compare.tsx   # Strategy comparison
│   │   │   ├── payments/
│   │   │   │   └── index.tsx     # Payment history
│   │   │   └── settings/
│   │   │       └── index.tsx     # User settings
│   │   ├── index.tsx             # Landing page
│   │   └── _app.tsx              # App wrapper
│   ├── layouts/
│   │   ├── root-layout.tsx
│   │   ├── auth-layout.tsx
│   │   └── dashboard-layout.tsx
│   ├── router/
│   │   └── index.tsx             # Tanstack Router configuration
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── dashboard/
│   │   │   ├── dashboard-header.tsx
│   │   │   ├── debt-summary-card.tsx
│   │   │   ├── progress-chart.tsx
│   │   │   └── upcoming-payments.tsx
│   │   ├── debts/
│   │   │   ├── debt-form.tsx
│   │   │   ├── debt-list.tsx
│   │   │   ├── debt-card.tsx
│   │   │   └── payment-history.tsx
│   │   ├── strategies/
│   │   │   ├── strategy-selector.tsx
│   │   │   ├── projection-chart.tsx
│   │   │   └── savings-comparison.tsx
│   │   ├── forms/
│   │   │   ├── debt-form.tsx
│   │   │   ├── payment-form.tsx
│   │   │   └── strategy-form.tsx
│   │   └── shared/
│   │       ├── theme-toggle.tsx
│   │       ├── loading-spinner.tsx
│   │       └── error-boundary.tsx
│   ├── providers/
│   │   ├── theme-provider.tsx
│   │   ├── auth-provider.tsx
│   │   └── convex-provider.tsx
│   ├── main.tsx                  # Vite entry point
│   └── index.css                 # Global styles
├── convex/
│   ├── _generated/
│   ├── schema.ts                 # Database schema
│   ├── auth.ts                   # Auth config
│   ├── debts.ts                  # Debt CRUD operations
│   ├── payments.ts               # Payment operations
│   ├── strategies.ts             # Strategy calculations
│   ├── projections.ts            # Projection calculations
│   └── plaid.ts                  # Plaid integration
├── lib/
│   ├── calculations/
│   │   ├── avalanche.ts
│   │   ├── snowball.ts
│   │   ├── interest.ts
│   │   └── projections.ts
│   ├── utils/
│   │   ├── format.ts             # Number/date formatting
│   │   ├── validation.ts         # Form validation
│   │   └── constants.ts          # App constants
│   └── hooks/
│       ├── use-debts.ts
│       ├── use-strategies.ts
│       └── use-payments.ts
├── types/
│   ├── debt.ts
│   ├── payment.ts
│   ├── strategy.ts
│   └── user.ts
├── public/                       # Static assets
├── index.html                    # HTML template
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies
```

## 2. Component Specifications

### 2.1 Core Components

#### Dashboard Components

```typescript
// components/dashboard/dashboard-header.tsx
interface DashboardHeaderProps {
  totalDebt: number;
  monthlyPayment: number;
  projectedPayoffDate: Date;
  userName: string;
}

// components/dashboard/debt-summary-card.tsx
interface DebtSummaryCardProps {
  title: string;
  value: number | string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  format?: 'currency' | 'percentage' | 'date';
}

// components/dashboard/progress-chart.tsx
interface ProgressChartProps {
  data: ProgressDataPoint[];
  height?: number;
  showProjection?: boolean;
}
```

#### Debt Management Components

```typescript
// components/debts/debt-form.tsx
interface DebtFormProps {
  debt?: Debt; // For editing
  onSubmit: (data: DebtFormData) => Promise<void>;
  onCancel: () => void;
}

// components/debts/debt-card.tsx
interface DebtCardProps {
  debt: Debt;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPayment: (id: string) => void;
  showProgress?: boolean;
}

// components/debts/debt-list.tsx
interface DebtListProps {
  debts: Debt[];
  sortBy?: 'balance' | 'interest' | 'dueDate';
  filterBy?: DebtType;
}
```

#### Strategy Components

```typescript
// components/strategies/strategy-selector.tsx
interface StrategySelectorProps {
  currentStrategy?: Strategy;
  monthlyBudget: number;
  onSelect: (strategy: StrategyType) => void;
}

// components/strategies/projection-chart.tsx
interface ProjectionChartProps {
  projections: MonthlyProjection[];
  strategy: StrategyType;
  showComparison?: boolean;
}
```

## 3. Convex API Design

### 3.1 Schema Definition

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  debts: defineTable({
    userId: v.string(),
    name: v.string(),
    type: v.union(
      v.literal("credit_card"),
      v.literal("personal_loan"),
      v.literal("student_loan"),
      v.literal("mortgage"),
      v.literal("auto_loan"),
      v.literal("other")
    ),
    currentBalance: v.number(),
    originalBalance: v.number(),
    interestRate: v.number(),
    minimumPayment: v.number(),
    dueDate: v.number(), // Day of month (1-31)
    isActive: v.boolean(),
    plaidAccountId: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_active", ["userId", "isActive"]),

  payments: defineTable({
    userId: v.string(),
    debtId: v.id("debts"),
    amount: v.number(),
    paymentDate: v.number(), // Unix timestamp
    principal: v.number(),
    interest: v.number(),
    remainingBalance: v.number(),
    note: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_debt", ["debtId"])
    .index("by_date", ["paymentDate"]),

  strategies: defineTable({
    userId: v.string(),
    name: v.string(),
    type: v.union(
      v.literal("avalanche"),
      v.literal("snowball"),
      v.literal("custom")
    ),
    monthlyBudget: v.number(),
    extraPayment: v.number(),
    debtPriorities: v.optional(v.array(v.id("debts"))), // For custom
    isActive: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_active", ["userId", "isActive"]),

  projections: defineTable({
    userId: v.string(),
    strategyId: v.id("strategies"),
    debtFreeDate: v.number(), // Unix timestamp
    totalInterestPaid: v.number(),
    totalAmountPaid: v.number(),
    monthlyBreakdown: v.string(), // JSON string
    calculatedAt: v.number(),
  })
    .index("by_strategy", ["strategyId"])
    .index("by_user", ["userId"]),
});
```

### 3.2 API Functions

#### Debt Operations

```typescript
// convex/debts.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    currentBalance: v.number(),
    originalBalance: v.number(),
    interestRate: v.number(),
    minimumPayment: v.number(),
    dueDate: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    return ctx.db.insert("debts", {
      ...args,
      userId: identity.subject,
      isActive: true,
    });
  },
});

export const list = query({
  args: {
    includeInactive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const query = ctx.db
      .query("debts")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject));

    if (!args.includeInactive) {
      return query.filter((q) => q.eq(q.field("isActive"), true)).collect();
    }

    return query.collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("debts"),
    currentBalance: v.optional(v.number()),
    minimumPayment: v.optional(v.number()),
    interestRate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return ctx.db.patch(id, updates);
  },
});
```

#### Payment Operations

```typescript
// convex/payments.ts
export const recordPayment = mutation({
  args: {
    debtId: v.id("debts"),
    amount: v.number(),
    paymentDate: v.optional(v.number()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const debt = await ctx.db.get(args.debtId);
    if (!debt) throw new Error("Debt not found");

    // Calculate interest and principal
    const monthlyInterestRate = debt.interestRate / 12 / 100;
    const interestAmount = debt.currentBalance * monthlyInterestRate;
    const principalAmount = args.amount - interestAmount;
    const newBalance = debt.currentBalance - principalAmount;

    // Record payment
    await ctx.db.insert("payments", {
      userId: identity.subject,
      debtId: args.debtId,
      amount: args.amount,
      paymentDate: args.paymentDate || Date.now(),
      principal: principalAmount,
      interest: interestAmount,
      remainingBalance: newBalance,
      note: args.note,
    });

    // Update debt balance
    await ctx.db.patch(args.debtId, {
      currentBalance: newBalance,
    });

    return { newBalance, principalPaid: principalAmount };
  },
});
```

#### Strategy Operations

```typescript
// convex/strategies.ts
export const createStrategy = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("avalanche"), v.literal("snowball"), v.literal("custom")),
    monthlyBudget: v.number(),
    debtPriorities: v.optional(v.array(v.id("debts"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    // Deactivate current strategy
    const currentActive = await ctx.db
      .query("strategies")
      .withIndex("by_user_active", (q) =>
        q.eq("userId", identity.subject).eq("isActive", true)
      )
      .first();

    if (currentActive) {
      await ctx.db.patch(currentActive._id, { isActive: false });
    }

    // Create new strategy
    const strategyId = await ctx.db.insert("strategies", {
      ...args,
      userId: identity.subject,
      extraPayment: args.monthlyBudget - await calculateMinimumPayments(ctx, identity.subject),
      isActive: true,
    });

    // Generate projections
    await generateProjections(ctx, strategyId);

    return strategyId;
  },
});
```

## 4. State Management Patterns

### 4.1 Custom Hooks

```typescript
// lib/hooks/use-debts.ts
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useDebts() {
  const debts = useQuery(api.debts.list);
  const createDebt = useMutation(api.debts.create);
  const updateDebt = useMutation(api.debts.update);
  const deleteDebt = useMutation(api.debts.delete);

  return {
    debts: debts ?? [],
    isLoading: debts === undefined,
    createDebt,
    updateDebt,
    deleteDebt,
  };
}

// lib/hooks/use-strategies.ts
export function useStrategies() {
  const activeStrategy = useQuery(api.strategies.getActive);
  const projections = useQuery(
    api.projections.getByStrategy,
    activeStrategy ? { strategyId: activeStrategy._id } : "skip"
  );

  return {
    activeStrategy,
    projections,
    isLoading: activeStrategy === undefined,
  };
}
```

## 5. Form Management with Tanstack Form

### 5.1 Debt Form Example

```typescript
// components/forms/debt-form.tsx
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';

const debtSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["credit_card", "personal_loan", "student_loan", "mortgage", "auto_loan", "other"]),
  currentBalance: z.number().positive("Balance must be positive"),
  originalBalance: z.number().positive("Original balance must be positive"),
  interestRate: z.number().min(0).max(100, "Interest rate must be between 0-100%"),
  minimumPayment: z.number().positive("Minimum payment must be positive"),
  dueDate: z.number().min(1).max(31, "Due date must be between 1-31"),
});

export function DebtForm({ onSubmit }: DebtFormProps) {
  const form = useForm({
    defaultValues: {
      name: '',
      type: 'credit_card' as const,
      currentBalance: 0,
      originalBalance: 0,
      interestRate: 0,
      minimumPayment: 0,
      dueDate: 1,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
    validatorAdapter: zodValidator,
    validators: {
      onChange: debtSchema,
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }}>
      {/* Form fields */}
    </form>
  );
}
```

## 6. UI Component Library Setup

### 6.1 App Entry Point and Providers

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './providers/theme-provider';
import App from './App';
import './index.css';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL!);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProvider client={convex}>
        <BrowserRouter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </ConvexProvider>
    </ClerkProvider>
  </React.StrictMode>
);
```

### 6.2 Router Configuration

```typescript
// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import RootLayout from './layouts/root-layout';
import DashboardLayout from './layouts/dashboard-layout';
import Landing from './pages';
import SignIn from './pages/auth/sign-in';
import SignUp from './pages/auth/sign-up';
import Dashboard from './pages/dashboard';
import Debts from './pages/dashboard/debts';
import NewDebt from './pages/dashboard/debts/new';
import DebtDetail from './pages/dashboard/debts/[id]';
import Strategies from './pages/dashboard/strategies';
import StrategyCompare from './pages/dashboard/strategies/compare';
import Payments from './pages/dashboard/payments';
import Settings from './pages/dashboard/settings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/sign-in/*" element={<SignIn />} />
        <Route path="/sign-up/*" element={<SignUp />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/debts" element={<Debts />} />
          <Route path="/dashboard/debts/new" element={<NewDebt />} />
          <Route path="/dashboard/debts/:id" element={<DebtDetail />} />
          <Route path="/dashboard/strategies" element={<Strategies />} />
          <Route path="/dashboard/strategies/compare" element={<StrategyCompare />} />
          <Route path="/dashboard/payments" element={<Payments />} />
          <Route path="/dashboard/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

### 6.3 Component Examples

```typescript
// Example usage of shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function DebtCard({ debt }: { debt: Debt }) {
  const percentagePaid = ((debt.originalBalance - debt.currentBalance) / debt.originalBalance) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{debt.name}</CardTitle>
        <CardDescription>
          <Badge variant={debt.type === "credit_card" ? "destructive" : "secondary"}>
            {debt.type.replace("_", " ")}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={percentagePaid} />
          <div className="flex justify-between text-sm">
            <span>${debt.currentBalance.toFixed(2)}</span>
            <span>{debt.interestRate}% APR</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```
