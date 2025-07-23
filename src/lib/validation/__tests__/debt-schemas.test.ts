// schemas.test.ts
import { describe, expect, it } from "vitest";
import { DebtType, StrategyType } from "../../types/debt";
import {
	createDebtSchema,
	createPaymentSchema,
	createStrategySchema,
	debtFormSchema,
	debtTypeSchema,
	paymentFormSchema,
	strategyFormSchema,
	strategyTypeSchema,
	updateDebtSchema,
	updateStrategySchema,
} from "../debt-schemas";

describe("debtTypeSchema", () => {
	it("parses each valid DebtType", () => {
		for (const t of Object.values(DebtType)) {
			expect(debtTypeSchema.parse(t)).toBe(t);
		}
	});

	it("throws on invalid debt type", () => {
		expect(() => debtTypeSchema.parse("INVALID")).toThrow();
	});
});

describe("strategyTypeSchema", () => {
	it("parses each valid StrategyType", () => {
		for (const s of Object.values(StrategyType)) {
			expect(strategyTypeSchema.parse(s)).toBe(s);
		}
	});

	it("throws on invalid strategy type", () => {
		expect(() => strategyTypeSchema.parse("FOO")).toThrow();
	});
});

describe("createDebtSchema", () => {
	const validDebt = {
		name: "My Debt",
		type: DebtType.PERSONAL_LOAN,
		currentBalance: 5000.5,
		originalBalance: 10000.0,
		interestRate: 5.25,
		minimumPayment: 100.0,
		dueDate: 15,
	};

	it("parses valid debt data", () => {
		expect(createDebtSchema.parse(validDebt)).toEqual(validDebt);
	});

	it("rejects if currentBalance > originalBalance", () => {
		expect(() =>
			createDebtSchema.parse({
				...validDebt,
				currentBalance: 20000,
			}),
		).toThrowError(/Current balance cannot exceed original balance/);
	});

	it("rejects if minimumPayment > currentBalance", () => {
		expect(() =>
			createDebtSchema.parse({
				...validDebt,
				minimumPayment: 6000,
			}),
		).toThrowError(/Minimum payment cannot exceed current balance/);
	});

	it("rejects empty name", () => {
		expect(() =>
			createDebtSchema.parse({ ...validDebt, name: "" }),
		).toThrowError(/Debt name is required/);
	});
});

describe("updateDebtSchema", () => {
	it("parses partial debt update with updatedAt", () => {
		const data = { updatedAt: Date.now(), currentBalance: 100 };
		expect(updateDebtSchema.parse(data)).toMatchObject(data);
	});

	it("rejects missing updatedAt", () => {
		expect(() => updateDebtSchema.parse({})).toThrowError(/updatedAt/);
	});
});

describe("createPaymentSchema", () => {
	const now = Date.now();
	const validPayment = {
		debtId: "abc123",
		amount: 200.75,
		paymentDate: now - 1000,
		note: "Monthly payment",
	};

	it("parses valid payment data", () => {
		expect(createPaymentSchema.parse(validPayment)).toEqual(validPayment);
	});

	it("rejects future paymentDate", () => {
		expect(() =>
			createPaymentSchema.parse({
				...validPayment,
				paymentDate: now + 100000,
			}),
		).toThrowError(/Payment date cannot be in the future/);
	});

	it("allows missing note", () => {
		const { note: _note, ...noNote } = validPayment;
		expect(createPaymentSchema.parse(noNote)).toEqual(noNote);
	});
});

describe("createStrategySchema", () => {
	const validStrategy = {
		name: "Snowball Plan",
		type: StrategyType.SNOWBALL,
		monthlyBudget: 1000.0,
		extraPayment: 50.0,
		debtPriorities: ["d1", "d2"],
	};

	it("parses valid strategy data", () => {
		expect(createStrategySchema.parse(validStrategy)).toEqual(validStrategy);
	});

	it("rejects duplicate debtPriorities", () => {
		expect(() =>
			createStrategySchema.parse({
				...validStrategy,
				debtPriorities: ["a", "a"],
			}),
		).toThrowError(/Debt priorities must be unique/);
	});
});

describe("updateStrategySchema", () => {
	it("parses partial strategy update with updatedAt", () => {
		const data = { updatedAt: Date.now(), name: "X" };
		expect(updateStrategySchema.parse(data)).toMatchObject(data);
	});

	it("rejects missing updatedAt", () => {
		expect(() => updateStrategySchema.parse({})).toThrowError(/updatedAt/);
	});
});

describe("Form Schemas with coercion", () => {
	it("coerces and validates debtFormSchema from strings", () => {
		const input = {
			name: "D",
			type: DebtType.MORTGAGE,
			currentBalance: "1000",
			originalBalance: "2000",
			interestRate: "3.5",
			minimumPayment: "50",
			dueDate: "10",
		};
		const parsed = debtFormSchema.parse(input);
		expect(parsed.currentBalance).toBe(1000);
		expect(parsed.originalBalance).toBe(2000);
		expect(parsed.interestRate).toBe(3.5);
		expect(parsed.minimumPayment).toBe(50);
		expect(parsed.dueDate).toBe(10);
	});

	it("coerces paymentFormSchema from strings", () => {
		const input = {
			debtId: "id",
			amount: "123.45",
			paymentDate: `${Date.now() - 5000}`,
		};
		const parsed = paymentFormSchema.parse(input);
		expect(parsed.amount).toBe(123.45);
		expect(typeof parsed.paymentDate).toBe("number");
	});

	it("coerces strategyFormSchema from strings", () => {
		const input = {
			name: "S",
			type: StrategyType.AVALANCHE,
			monthlyBudget: "500",
			extraPayment: "20",
		};
		const parsed = strategyFormSchema.parse(input);
		expect(parsed.monthlyBudget).toBe(500);
		expect(parsed.extraPayment).toBe(20);
	});
});
