import type { Doc, Id } from "../../../convex/_generated/dataModel";

// Core data model interfaces based on Convex schema
export interface Debt extends Doc<"debts"> {}
export interface Payment extends Doc<"payments"> {}
export interface Strategy extends Doc<"strategies"> {}

// Utility types for creating new records (without generated fields)
export type NewDebt = Omit<
	Debt,
	"_id" | "_creationTime" | "createdAt" | "updatedAt"
> & {
	createdAt?: number;
	updatedAt?: number;
};

export type NewPayment = Omit<
	Payment,
	"_id" | "_creationTime" | "createdAt"
> & {
	createdAt?: number;
};

export type NewStrategy = Omit<
	Strategy,
	"_id" | "_creationTime" | "createdAt" | "updatedAt"
> & {
	createdAt?: number;
	updatedAt?: number;
};

// Update types for partial updates
export type DebtUpdate = Partial<
	Omit<Debt, "_id" | "_creationTime" | "userId" | "createdAt">
> & {
	updatedAt: number;
};

export type StrategyUpdate = Partial<
	Omit<Strategy, "_id" | "_creationTime" | "userId" | "createdAt">
> & {
	updatedAt: number;
};

// Enum types for better type safety
export const DebtType = {
	CREDIT_CARD: "credit_card",
	PERSONAL_LOAN: "personal_loan",
	STUDENT_LOAN: "student_loan",
	MORTGAGE: "mortgage",
	AUTO_LOAN: "auto_loan",
	OTHER: "other",
} as const;

export type DebtTypeValue = (typeof DebtType)[keyof typeof DebtType];

export const StrategyType = {
	AVALANCHE: "avalanche",
	SNOWBALL: "snowball",
	CUSTOM: "custom",
} as const;

export type StrategyTypeValue =
	(typeof StrategyType)[keyof typeof StrategyType];

// Calculated fields and derived types
export interface DebtWithCalculations extends Debt {
	totalPaid: number;
	progressPercentage: number;
	monthsRemaining?: number;
	totalInterestRemaining?: number;
}

export interface PaymentSummary {
	totalAmount: number;
	totalPrincipal: number;
	totalInterest: number;
	paymentCount: number;
	lastPaymentDate?: number;
}

export interface StrategyProjection {
	strategyId: Id<"strategies">;
	totalMonths: number;
	totalInterest: number;
	totalPayments: number;
	payoffDate: number;
	monthlyBreakdown: Array<{
		month: number;
		payment: number;
		principal: number;
		interest: number;
		remainingBalance: number;
	}>;
}
