import { z } from "zod";
import { DebtType, StrategyType } from "../types/debt";

// Base validation schemas
export const debtTypeSchema = z.enum([
	DebtType.CREDIT_CARD,
	DebtType.PERSONAL_LOAN,
	DebtType.STUDENT_LOAN,
	DebtType.MORTGAGE,
	DebtType.AUTO_LOAN,
	DebtType.OTHER,
]);

export const strategyTypeSchema = z.enum([
	StrategyType.AVALANCHE,
	StrategyType.SNOWBALL,
	StrategyType.CUSTOM,
]);

// Debt validation schemas
export const createDebtSchema = z
	.object({
		name: z
			.string()
			.min(1, "Debt name is required")
			.max(100, "Debt name must be less than 100 characters")
			.trim(),
		type: debtTypeSchema,
		currentBalance: z
			.number()
			.positive("Current balance must be positive")
			.max(10000000, "Balance cannot exceed $10,000,000")
			.multipleOf(0.01, "Balance must be a valid currency amount"),
		originalBalance: z
			.number()
			.positive("Original balance must be positive")
			.max(10000000, "Balance cannot exceed $10,000,000")
			.multipleOf(0.01, "Balance must be a valid currency amount"),
		interestRate: z
			.number()
			.min(0, "Interest rate cannot be negative")
			.max(100, "Interest rate cannot exceed 100%")
			.multipleOf(0.01, "Interest rate must have at most 2 decimal places"),
		minimumPayment: z
			.number()
			.positive("Minimum payment must be positive")
			.max(100000, "Minimum payment cannot exceed $100,000")
			.multipleOf(0.01, "Payment must be a valid currency amount"),
		dueDate: z
			.number()
			.int("Due date must be a whole number")
			.min(1, "Due date must be between 1 and 31")
			.max(31, "Due date must be between 1 and 31"),
	})
	.refine((data) => data.currentBalance <= data.originalBalance, {
		message: "Current balance cannot exceed original balance",
		path: ["currentBalance"],
	})
	.refine((data) => data.minimumPayment <= data.currentBalance, {
		message: "Minimum payment cannot exceed current balance",
		path: ["minimumPayment"],
	});

export const updateDebtSchema = createDebtSchema.partial().extend({
	updatedAt: z.number().positive(),
});

// Payment validation schemas
export const createPaymentSchema = z.object({
	debtId: z.string().min(1, "Debt ID is required"),
	amount: z
		.number()
		.positive("Payment amount must be positive")
		.max(100000, "Payment cannot exceed $100,000")
		.multipleOf(0.01, "Payment must be a valid currency amount"),
	paymentDate: z
		.number()
		.positive("Payment date is required")
		.refine(
			(date) => date <= Date.now(),
			"Payment date cannot be in the future",
		),
	note: z.string().max(500, "Note must be less than 500 characters").optional(),
});

// Strategy validation schemas
export const createStrategySchema = z.object({
	name: z
		.string()
		.min(1, "Strategy name is required")
		.max(100, "Strategy name must be less than 100 characters")
		.trim(),
	type: strategyTypeSchema,
	monthlyBudget: z
		.number()
		.positive("Monthly budget must be positive")
		.max(100000, "Monthly budget cannot exceed $100,000")
		.multipleOf(0.01, "Budget must be a valid currency amount"),
	extraPayment: z
		.number()
		.min(0, "Extra payment cannot be negative")
		.max(100000, "Extra payment cannot exceed $100,000")
		.multipleOf(0.01, "Payment must be a valid currency amount"),
	debtPriorities: z
		.array(z.string())
		.optional()
		.refine(
			(priorities) =>
				!priorities || new Set(priorities).size === priorities.length,
			"Debt priorities must be unique",
		),
});

export const updateStrategySchema = createStrategySchema.partial().extend({
	updatedAt: z.number().positive(),
});

// Form validation schemas (for client-side forms)
export const debtFormSchema = createDebtSchema.extend({
	// Add any form-specific validations or transformations
	currentBalance: z.coerce.number().pipe(createDebtSchema.shape.currentBalance),
	originalBalance: z.coerce
		.number()
		.pipe(createDebtSchema.shape.originalBalance),
	interestRate: z.coerce.number().pipe(createDebtSchema.shape.interestRate),
	minimumPayment: z.coerce.number().pipe(createDebtSchema.shape.minimumPayment),
	dueDate: z.coerce.number().pipe(createDebtSchema.shape.dueDate),
});

export const paymentFormSchema = createPaymentSchema.extend({
	amount: z.coerce.number().pipe(createPaymentSchema.shape.amount),
	paymentDate: z.coerce.number().pipe(createPaymentSchema.shape.paymentDate),
});

export const strategyFormSchema = createStrategySchema.extend({
	monthlyBudget: z.coerce
		.number()
		.pipe(createStrategySchema.shape.monthlyBudget),
	extraPayment: z.coerce.number().pipe(createStrategySchema.shape.extraPayment),
});

// Type exports for use in components
export type CreateDebtInput = z.infer<typeof createDebtSchema>;
export type UpdateDebtInput = z.infer<typeof updateDebtSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type CreateStrategyInput = z.infer<typeof createStrategySchema>;
export type UpdateStrategyInput = z.infer<typeof updateStrategySchema>;

export type DebtFormInput = z.infer<typeof debtFormSchema>;
export type PaymentFormInput = z.infer<typeof paymentFormSchema>;
export type StrategyFormInput = z.infer<typeof strategyFormSchema>;
