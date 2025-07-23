# Task Category: Core Data Models & API

## Overview

Implementation of Convex database schema, API functions, and core business logic.

## Tasks

### 2.1 Implement Database Schema

**Priority:** Must Have
**Effort:** 2 hours
**Dependencies:** Project Setup Complete

**Subtasks:**

- [ ] Create debts table with all fields
- [ ] Create payments table with relations
- [ ] Create strategies table
- [ ] Create projections table
- [ ] Add proper indexes for performance

**Acceptance Criteria:**

- Schema matches specification
- All relations properly defined
- Indexes optimize common queries

### 2.2 Implement Debt CRUD Operations

**Priority:** Must Have
**Effort:** 3 hours
**Dependencies:** 2.1

**Subtasks:**

- [ ] Create `debts.create` mutation
- [ ] Create `debts.list` query with filtering
- [ ] Create `debts.update` mutation
- [ ] Create `debts.delete` mutation
- [ ] Add proper authorization checks

**Code Structure:**

```typescript
// convex/debts.ts
export const create = mutation({...});
export const list = query({...});
export const update = mutation({...});
export const delete = mutation({...});
```

### 2.3 Implement Payment Recording System

**Priority:** Must Have
**Effort:** 3 hours
**Dependencies:** 2.2

**Subtasks:**

- [ ] Create `payments.recordPayment` mutation
- [ ] Implement interest/principal calculation
- [ ] Update debt balance automatically
- [ ] Create `payments.history` query
- [ ] Add payment validation logic

**Key Features:**

- Automatic balance updates
- Interest calculation based on debt type
- Payment history tracking

### 2.4 Implement Strategy Management

**Priority:** Must Have
**Effort:** 2 hours
**Dependencies:** 2.2

**Subtasks:**

- [ ] Create `strategies.create` mutation
- [ ] Create `strategies.getActive` query
- [ ] Create `strategies.update` mutation
- [ ] Implement strategy switching logic
- [ ] Add custom priority support

**Acceptance Criteria:**

- Only one active strategy at a time
- Strategy types validated
- Custom priorities saved correctly

### 2.5 Implement Calculation Functions

**Priority:** Must Have
**Effort:** 4 hours
**Dependencies:** 2.1

**Subtasks:**

- [ ] Create avalanche algorithm
- [ ] Create snowball algorithm
- [ ] Implement interest calculations
- [ ] Create projection generator
- [ ] Add comparison calculator

**Files to Create:**

```
lib/calculations/
├── avalanche.ts
├── snowball.ts
├── interest.ts
├── projections.ts
└── comparison.ts
```

### 2.6 Implement Real-time Subscriptions

**Priority:** Should Have
**Effort:** 2 hours
**Dependencies:** 2.2, 2.3

**Subtasks:**

- [ ] Set up real-time debt updates
- [ ] Configure payment notifications
- [ ] Implement strategy change broadcasts
- [ ] Add optimistic updates

**Acceptance Criteria:**

- Changes reflect immediately
- Multiple clients stay in sync
- No flickering or delays

### 2.7 Create Data Validation Layer

**Priority:** Must Have
**Effort:** 2 hours
**Dependencies:** 2.1

**Subtasks:**

- [ ] Add Zod schemas for all inputs
- [ ] Validate business rules
- [ ] Create error messages
- [ ] Add data sanitization

**Validation Rules:**

- Balance must be positive
- Interest rate 0-100%
- Payment >= minimum payment
- Due date 1-31

### 2.8 Implement Data Export/Import

**Priority:** Should Have
**Effort:** 2 hours
**Dependencies:** 2.2

**Subtasks:**

- [ ] Create CSV export function
- [ ] Create import template
- [ ] Add import validation
- [ ] Handle duplicate detection

**Acceptance Criteria:**

- Export includes all debt data
- Import validates data format
- Clear error messages for invalid data

### 2.9 Add Analytics Tracking

**Priority:** Could Have
**Effort:** 1 hour
**Dependencies:** 2.3

**Subtasks:**

- [ ] Track total debt paid
- [ ] Calculate average payment size
- [ ] Track strategy effectiveness
- [ ] Create summary statistics

## Testing Requirements

### Unit Tests

- [ ] Test all calculation functions
- [ ] Test validation logic
- [ ] Test interest calculations
- [ ] Test projection accuracy

### Integration Tests

- [ ] Test CRUD operations
- [ ] Test payment recording
- [ ] Test strategy switching
- [ ] Test real-time updates

## Summary

**Total Effort:** ~20 hours
**Critical Path:** Schema → CRUD → Calculations → Projections
**Risk Areas:** Complex interest calculations, real-time sync
