# Testing Strategy & Validation Approach

## 1. Testing Philosophy

Our testing strategy follows the Testing Pyramid principle with emphasis on:

- **Unit Tests**: Core business logic, calculations, and utilities (60%)
- **Integration Tests**: API endpoints and database operations (30%)
- **E2E Tests**: Critical user journeys (10%)

## 2. Testing Stack

### 2.1 Testing Tools

- **Unit Testing**: Vitest (fast, ESM support, TypeScript native)
- **Component Testing**: React Testing Library + Vitest
- **Integration Testing**: Convex Test Environment
- **E2E Testing**: Playwright
- **Mocking**: MSW (Mock Service Worker)
- **Code Coverage**: Vitest Coverage (c8)

### 2.2 Testing Utilities

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@playwright/test": "^1.40.0",
    "vitest": "^1.0.0",
    "@vitest/coverage-c8": "^0.33.0",
    "msw": "^2.0.0",
    "@faker-js/faker": "^8.0.0"
  }
}
```

## 3. Unit Testing Strategy

### 3.1 Calculation Tests

```typescript
// lib/calculations/__tests__/avalanche.test.ts
import { describe, it, expect } from 'vitest';
import { calculateAvalancheOrder, allocateAvalanchePayments } from '../avalanche';
import { mockDebts } from '../../test-utils/mock-data';

describe('Avalanche Strategy', () => {
  describe('calculateAvalancheOrder', () => {
    it('should sort debts by interest rate descending', () => {
      const sorted = calculateAvalancheOrder(mockDebts);
      expect(sorted[0].interestRate).toBeGreaterThan(sorted[1].interestRate);
    });

    it('should handle empty debt array', () => {
      expect(calculateAvalancheOrder([])).toEqual([]);
    });
  });

  describe('allocateAvalanchePayments', () => {
    it('should allocate extra payment to highest interest debt', () => {
      const budget = 1500;
      const allocations = allocateAvalanchePayments(mockDebts, budget);

      const highestInterestDebt = mockDebts.reduce((prev, current) =>
        prev.interestRate > current.interestRate ? prev : current
      );

      const allocation = allocations.find(a => a.debtId === highestInterestDebt.id);
      expect(allocation.amount).toBeGreaterThan(highestInterestDebt.minimumPayment);
    });

    it('should respect minimum payments for all debts', () => {
      const budget = 1000;
      const allocations = allocateAvalanchePayments(mockDebts, budget);

      allocations.forEach((allocation, index) => {
        expect(allocation.amount).toBeGreaterThanOrEqual(mockDebts[index].minimumPayment);
      });
    });
  });
});
```

### 3.2 Interest Calculation Tests

```typescript
// lib/calculations/__tests__/interest.test.ts
describe('Interest Calculations', () => {
  describe('calculateCreditCardInterest', () => {
    it('should calculate daily compound interest correctly', () => {
      const balance = 1000;
      const apr = 0.1999; // 19.99%
      const daysInMonth = 30;

      const interest = calculateCreditCardInterest(balance, apr, daysInMonth);

      // Expected: ~$16.43 for 30 days
      expect(interest).toBeCloseTo(16.43, 2);
    });

    it('should handle zero balance', () => {
      expect(calculateCreditCardInterest(0, 0.1999, 30)).toBe(0);
    });

    it('should handle zero APR', () => {
      expect(calculateCreditCardInterest(1000, 0, 30)).toBe(0);
    });
  });

  describe('calculateLoanPayment', () => {
    it('should break down payment into principal and interest', () => {
      const balance = 10000;
      const apr = 0.05; // 5%
      const payment = 500;

      const breakdown = calculateLoanPayment(balance, apr, payment);

      expect(breakdown.interest).toBeCloseTo(41.67, 2); // 10000 * 0.05 / 12
      expect(breakdown.principal).toBeCloseTo(458.33, 2);
      expect(breakdown.newBalance).toBeCloseTo(9541.67, 2);
    });
  });
});
```

### 3.3 Utility Function Tests

```typescript
// lib/utils/__tests__/format.test.ts
describe('Formatting Utilities', () => {
  describe('formatCurrency', () => {
    it('should format numbers as USD currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(-100)).toBe('-$100.00');
    });
  });

  describe('formatPercentage', () => {
    it('should format decimals as percentages', () => {
      expect(formatPercentage(0.1999)).toBe('19.99%');
      expect(formatPercentage(0.05)).toBe('5.00%');
      expect(formatPercentage(1)).toBe('100.00%');
    });
  });
});
```

## 4. Component Testing Strategy

### 4.1 Component Test Structure

```typescript
// components/debts/__tests__/debt-card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DebtCard } from '../debt-card';
import { mockDebt } from '@/lib/test-utils/mock-data';

describe('DebtCard', () => {
  const defaultProps = {
    debt: mockDebt,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onPayment: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render debt information correctly', () => {
    render(<DebtCard {...defaultProps} />);

    expect(screen.getByText(mockDebt.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockDebt.currentBalance.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockDebt.interestRate}% APR`)).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<DebtCard {...defaultProps} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockDebt.id);
  });

  it('should show progress bar when showProgress is true', () => {
    render(<DebtCard {...defaultProps} showProgress />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });
});
```

### 4.2 Form Testing

```typescript
// components/forms/__tests__/debt-form.test.tsx
describe('DebtForm', () => {
  it('should validate required fields', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<DebtForm onSubmit={onSubmit} />);

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should submit valid form data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<DebtForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/name/i), 'Chase Visa');
    await user.type(screen.getByLabelText(/current balance/i), '5000');
    await user.type(screen.getByLabelText(/interest rate/i), '19.99');
    await user.type(screen.getByLabelText(/minimum payment/i), '125');

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Chase Visa',
      currentBalance: 5000,
      interestRate: 19.99,
      minimumPayment: 125,
      // ... other fields
    });
  });
});
```

## 5. Integration Testing Strategy

### 5.1 Convex Function Tests

```typescript
// convex/__tests__/debts.test.ts
import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import { api } from '../_generated/api';
import schema from '../schema';

test('create debt', async () => {
  const t = convexTest(schema);

  // Mock authenticated user
  const asUser = t.withIdentity({ subject: 'user123' });

  const debtId = await asUser.mutation(api.debts.create, {
    name: 'Test Credit Card',
    type: 'credit_card',
    currentBalance: 5000,
    originalBalance: 5000,
    interestRate: 19.99,
    minimumPayment: 125,
    dueDate: 15,
  });

  expect(debtId).toBeDefined();

  // Verify debt was created
  const debts = await asUser.query(api.debts.list);
  expect(debts).toHaveLength(1);
  expect(debts[0].name).toBe('Test Credit Card');
});

test('payment recording updates balance', async () => {
  const t = convexTest(schema);
  const asUser = t.withIdentity({ subject: 'user123' });

  // Create a debt
  const debtId = await asUser.mutation(api.debts.create, {
    name: 'Test Loan',
    type: 'personal_loan',
    currentBalance: 10000,
    originalBalance: 10000,
    interestRate: 5.0,
    minimumPayment: 300,
    dueDate: 1,
  });

  // Record a payment
  const result = await asUser.mutation(api.payments.recordPayment, {
    debtId,
    amount: 500,
  });

  expect(result.newBalance).toBeLessThan(10000);
  expect(result.principalPaid).toBeGreaterThan(450); // Most should be principal at 5% APR

  // Verify debt balance was updated
  const debts = await asUser.query(api.debts.list);
  expect(debts[0].currentBalance).toBe(result.newBalance);
});
```

### 5.2 API Integration Tests

```typescript
// __tests__/api/plaid-webhook.test.ts
import { createMocks } from 'node-mocks-http';
import { POST } from '@/app/api/webhooks/plaid/route';
import { verifyWebhook } from '@/lib/plaid';

vi.mock('@/lib/plaid');

describe('Plaid Webhook Handler', () => {
  it('should handle balance update webhook', async () => {
    const { req } = createMocks({
      method: 'POST',
      headers: {
        'plaid-verification': 'test-signature',
      },
      body: {
        webhook_type: 'TRANSACTIONS',
        webhook_code: 'DEFAULT_UPDATE',
        item_id: 'test-item-id',
      },
    });

    vi.mocked(verifyWebhook).mockReturnValue(true);

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should reject invalid webhook signature', async () => {
    const { req } = createMocks({
      method: 'POST',
      headers: {
        'plaid-verification': 'invalid-signature',
      },
      body: {},
    });

    vi.mocked(verifyWebhook).mockReturnValue(false);

    const response = await POST(req);

    expect(response.status).toBe(401);
  });
});
```

## 6. E2E Testing Strategy

### 6.1 Critical User Journeys

```typescript
// e2e/onboarding.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Onboarding', () => {
  test('new user can sign up and add first debt', async ({ page }) => {
    // Navigate to landing page
    await page.goto('/');

    // Click sign up
    await page.click('text=Get Started');

    // Complete Clerk sign up (mocked in test environment)
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Click add debt button
    await page.click('text=Add Your First Debt');

    // Fill debt form
    await page.fill('[name="name"]', 'Chase Visa');
    await page.selectOption('[name="type"]', 'credit_card');
    await page.fill('[name="currentBalance"]', '5000');
    await page.fill('[name="interestRate"]', '19.99');
    await page.fill('[name="minimumPayment"]', '125');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify debt appears in list
    await expect(page.locator('text=Chase Visa')).toBeVisible();
    await expect(page.locator('text=$5,000.00')).toBeVisible();
  });
});
```

### 6.2 Payment Strategy Flow

```typescript
// e2e/strategy-selection.spec.ts
test.describe('Strategy Selection', () => {
  test.beforeEach(async ({ page }) => {
    // Login and setup test data
    await loginAsTestUser(page);
    await setupTestDebts(page);
  });

  test('user can compare avalanche vs snowball strategies', async ({ page }) => {
    await page.goto('/strategies');

    // Enter monthly budget
    await page.fill('[name="monthlyBudget"]', '1500');

    // View comparison
    await page.click('text=Compare Strategies');

    // Verify comparison results
    await expect(page.locator('[data-testid="avalanche-savings"]')).toBeVisible();
    await expect(page.locator('[data-testid="snowball-timeline"]')).toBeVisible();

    // Select avalanche strategy
    await page.click('text=Choose Avalanche');

    // Verify strategy is active
    await expect(page.locator('text=Avalanche Strategy Active')).toBeVisible();
  });
});
```

## 7. Test Data Management

### 7.1 Mock Data Factory

```typescript
// lib/test-utils/factories.ts
import { faker } from '@faker-js/faker';

export const debtFactory = {
  build: (overrides = {}) => ({
    id: faker.string.uuid(),
    name: faker.company.name() + ' ' + faker.helpers.arrayElement(['Visa', 'Mastercard', 'Loan']),
    type: faker.helpers.arrayElement(['credit_card', 'personal_loan', 'student_loan']),
    currentBalance: faker.number.int({ min: 1000, max: 50000 }),
    originalBalance: faker.number.int({ min: 1000, max: 50000 }),
    interestRate: faker.number.float({ min: 3, max: 25, precision: 0.01 }),
    minimumPayment: faker.number.int({ min: 25, max: 500 }),
    dueDate: faker.number.int({ min: 1, max: 28 }),
    isActive: true,
    ...overrides,
  }),

  buildList: (count: number, overrides = {}) =>
    Array.from({ length: count }, () => debtFactory.build(overrides)),
};
```

### 7.2 Test Fixtures

```typescript
// lib/test-utils/fixtures.ts
export const testFixtures = {
  // Typical user with mixed debts
  overwhelmedJugglerDebts: [
    debtFactory.build({
      name: 'Chase Sapphire',
      type: 'credit_card',
      currentBalance: 8500,
      interestRate: 19.99,
      minimumPayment: 170,
    }),
    debtFactory.build({
      name: 'Student Loan',
      type: 'student_loan',
      currentBalance: 25000,
      interestRate: 5.5,
      minimumPayment: 280,
    }),
    debtFactory.build({
      name: 'Car Loan',
      type: 'auto_loan',
      currentBalance: 15000,
      interestRate: 4.2,
      minimumPayment: 350,
    }),
  ],

  // Edge case: high interest debts
  highInterestScenario: [
    debtFactory.build({ interestRate: 29.99 }),
    debtFactory.build({ interestRate: 24.99 }),
    debtFactory.build({ interestRate: 22.99 }),
  ],
};
```

## 8. Testing Best Practices

### 8.1 Test Organization

```
__tests__/
├── unit/           # Pure function tests
├── integration/    # API and database tests
├── components/     # React component tests
└── e2e/           # End-to-end tests

components/
└── [component]/
    └── __tests__/  # Co-located component tests
```

### 8.2 Testing Checklist

- [ ] All calculations have unit tests with edge cases
- [ ] Critical user paths have E2E tests
- [ ] Forms validate user input correctly
- [ ] API endpoints handle errors gracefully
- [ ] Authentication is properly tested
- [ ] Payment calculations are accurate to the cent
- [ ] Strategy comparisons show correct projections
- [ ] Real-time updates work correctly

### 8.3 Performance Testing

```typescript
// performance/debt-calculations.bench.ts
import { bench, describe } from 'vitest';
import { calculateAvalancheProjection } from '@/lib/calculations';
import { debtFactory } from '@/lib/test-utils';

describe('Projection Calculations Performance', () => {
  bench('calculate 5-year projection for 5 debts', () => {
    const debts = debtFactory.buildList(5);
    calculateAvalancheProjection(debts, 2000, 60); // 60 months
  });

  bench('calculate 5-year projection for 20 debts', () => {
    const debts = debtFactory.buildList(20);
    calculateAvalancheProjection(debts, 5000, 60);
  });
});
```

## 9. Continuous Integration

### 9.1 GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run type checking
        run: npm run type-check

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration
        env:
          CONVEX_TEST_URL: ${{ secrets.CONVEX_TEST_URL }}

      - name: Run E2E tests
        run: npx playwright install && npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## 10. Quality Metrics

### 10.1 Coverage Goals

- Overall: 80%
- Critical paths (calculations, payments): 95%
- UI Components: 70%
- Utilities: 90%

### 10.2 Performance Benchmarks

- Unit tests: < 5 seconds
- Integration tests: < 30 seconds
- E2E tests: < 2 minutes
- CI pipeline: < 5 minutes total
