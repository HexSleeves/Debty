import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
	{
		debts: defineTable({
			userId: v.string(),
			name: v.string(),
			type: v.union(
				v.literal("credit_card"),
				v.literal("personal_loan"),
				v.literal("student_loan"),
				v.literal("mortgage"),
				v.literal("auto_loan"),
				v.literal("other"),
			),
			currentBalance: v.number(),
			originalBalance: v.number(),
			interestRate: v.number(),
			minimumPayment: v.number(),
			dueDate: v.number(), // Day of month (1-31)
			isActive: v.boolean(),
			createdAt: v.number(),
			updatedAt: v.number(),
		})
			.index("by_user", ["userId"])
			.index("by_user_active", ["userId", "isActive"])
			.index("by_user_created", ["userId", "createdAt"]),

		payments: defineTable({
			userId: v.string(),
			debtId: v.id("debts"),
			amount: v.number(),
			paymentDate: v.number(),
			principal: v.number(),
			interest: v.number(),
			remainingBalance: v.number(),
			note: v.optional(v.string()),
			createdAt: v.number(),
		})
			.index("by_user", ["userId"])
			.index("by_debt", ["debtId"])
			.index("by_date", ["paymentDate"])
			.index("by_user_date", ["userId", "paymentDate"]),

		strategies: defineTable({
			userId: v.string(),
			name: v.string(),
			type: v.union(
				v.literal("avalanche"),
				v.literal("snowball"),
				v.literal("custom"),
			),
			monthlyBudget: v.number(),
			extraPayment: v.number(),
			debtPriorities: v.optional(v.array(v.id("debts"))),
			isActive: v.boolean(),
			createdAt: v.number(),
			updatedAt: v.number(),
		})
			.index("by_user", ["userId"])
			.index("by_user_active", ["userId", "isActive"]),
	},
	{ schemaValidation: true },
);
