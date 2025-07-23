import type {
	Debt,
	DebtWithCalculations,
	Payment,
	PaymentSummary,
	Strategy,
} from "../types/debt";

// Interest calculation utilities
export function calculateMonthlyInterestRate(annualRate: number): number {
	return annualRate / 100 / 12;
}

export function calculateInterestAmount(
	balance: number,
	annualRate: number,
): number {
	const monthlyRate = calculateMonthlyInterestRate(annualRate);
	return balance * monthlyRate;
}

export function calculatePrincipalAmount(
	paymentAmount: number,
	interestAmount: number,
): number {
	return Math.max(0, paymentAmount - interestAmount);
}

// Debt progress calculations
export function calculateDebtProgress(
	debt: Debt,
	payments: Payment[],
): DebtWithCalculations {
	const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
	const progressPercentage =
		debt.originalBalance > 0
			? ((debt.originalBalance - debt.currentBalance) / debt.originalBalance) *
				100
			: 0;

	let monthsRemaining: number | undefined;
	let totalInterestRemaining: number | undefined;

	if (debt.currentBalance > 0 && debt.minimumPayment > 0) {
		const monthlyRate = calculateMonthlyInterestRate(debt.interestRate);

		if (monthlyRate > 0) {
			// Calculate months remaining using amortization formula
			const numerator = Math.log(
				1 + (debt.currentBalance * monthlyRate) / debt.minimumPayment,
			);
			const denominator = Math.log(1 + monthlyRate);
			monthsRemaining = Math.ceil(numerator / denominator);

			// Calculate total interest remaining
			totalInterestRemaining =
				debt.minimumPayment * monthsRemaining - debt.currentBalance;
		} else {
			// No interest case
			monthsRemaining = Math.ceil(debt.currentBalance / debt.minimumPayment);
			totalInterestRemaining = 0;
		}
	}

	return {
		...debt,
		totalPaid,
		progressPercentage: Math.round(progressPercentage * 100) / 100,
		monthsRemaining,
		totalInterestRemaining: totalInterestRemaining
			? Math.round(totalInterestRemaining * 100) / 100
			: undefined,
	};
}

// Payment summary calculations
export function calculatePaymentSummary(payments: Payment[]): PaymentSummary {
	if (payments.length === 0) {
		return {
			totalAmount: 0,
			totalPrincipal: 0,
			totalInterest: 0,
			paymentCount: 0,
		};
	}

	const totalAmount = payments.reduce(
		(sum, payment) => sum + payment.amount,
		0,
	);
	const totalPrincipal = payments.reduce(
		(sum, payment) => sum + payment.principal,
		0,
	);
	const totalInterest = payments.reduce(
		(sum, payment) => sum + payment.interest,
		0,
	);
	const lastPaymentDate = Math.max(
		...payments.map((payment) => payment.paymentDate),
	);

	return {
		totalAmount: Math.round(totalAmount * 100) / 100,
		totalPrincipal: Math.round(totalPrincipal * 100) / 100,
		totalInterest: Math.round(totalInterest * 100) / 100,
		paymentCount: payments.length,
		lastPaymentDate,
	};
}

// Strategy calculations
export function calculateAvalancheOrder(debts: Debt[]): Debt[] {
	return [...debts]
		.filter((debt) => debt.isActive && debt.currentBalance > 0)
		.sort((a, b) => b.interestRate - a.interestRate);
}

export function calculateSnowballOrder(debts: Debt[]): Debt[] {
	return [...debts]
		.filter((debt) => debt.isActive && debt.currentBalance > 0)
		.sort((a, b) => a.currentBalance - b.currentBalance);
}

export function calculateMinimumPayments(debts: Debt[]): number {
	return debts
		.filter((debt) => debt.isActive && debt.currentBalance > 0)
		.reduce((sum, debt) => sum + debt.minimumPayment, 0);
}

export function calculateExtraPaymentAllocation(
	debts: Debt[],
	strategy: Strategy,
	extraAmount: number,
): Array<{ debtId: string; amount: number }> {
	const activeDebts = debts.filter(
		(debt) => debt.isActive && debt.currentBalance > 0,
	);

	if (activeDebts.length === 0 || extraAmount <= 0) {
		return [];
	}

	let orderedDebts: Debt[];

	switch (strategy.type) {
		case "avalanche":
			orderedDebts = calculateAvalancheOrder(activeDebts);
			break;
		case "snowball":
			orderedDebts = calculateSnowballOrder(activeDebts);
			break;
		case "custom":
			if (strategy.debtPriorities) {
				const priorityMap = new Map(
					strategy.debtPriorities.map((id, index) => [id, index]),
				);
				orderedDebts = [...activeDebts].sort((a, b) => {
					const aPriority = priorityMap.get(a._id) ?? Number.MAX_SAFE_INTEGER;
					const bPriority = priorityMap.get(b._id) ?? Number.MAX_SAFE_INTEGER;
					return aPriority - bPriority;
				});
			} else {
				orderedDebts = calculateAvalancheOrder(activeDebts);
			}
			break;
		default:
			orderedDebts = calculateAvalancheOrder(activeDebts);
	}

	// Allocate extra payment to highest priority debt first
	const allocation: Array<{ debtId: string; amount: number }> = [];
	let remainingExtra = extraAmount;

	for (const debt of orderedDebts) {
		if (remainingExtra <= 0) break;

		const maxPayment = Math.min(remainingExtra, debt.currentBalance);
		if (maxPayment > 0) {
			allocation.push({
				debtId: debt._id,
				amount: Math.round(maxPayment * 100) / 100,
			});
			remainingExtra -= maxPayment;
		}
	}

	return allocation;
}

// Payoff projection calculations
export function calculatePayoffProjection(
	debts: Debt[],
	strategy: Strategy,
	maxMonths = 360,
): {
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
} {
	const activeDebts = debts.filter(
		(debt) => debt.isActive && debt.currentBalance > 0,
	);

	if (activeDebts.length === 0) {
		return {
			totalMonths: 0,
			totalInterest: 0,
			totalPayments: 0,
			payoffDate: Date.now(),
			monthlyBreakdown: [],
		};
	}

	// Create working copies of debts
	const workingDebts = activeDebts.map((debt) => ({ ...debt }));
	const monthlyBreakdown: Array<{
		month: number;
		payment: number;
		principal: number;
		interest: number;
		remainingBalance: number;
	}> = [];

	let month = 0;
	let totalInterest = 0;
	let totalPayments = 0;

	while (
		month < maxMonths &&
		workingDebts.some((debt) => debt.currentBalance > 0)
	) {
		month++;
		let monthlyPayment = 0;
		let monthlyPrincipal = 0;
		let monthlyInterest = 0;

		// Calculate minimum payments for all debts
		for (const debt of workingDebts) {
			if (debt.currentBalance <= 0) continue;

			const interestAmount = calculateInterestAmount(
				debt.currentBalance,
				debt.interestRate,
			);
			const principalAmount = Math.min(
				calculatePrincipalAmount(debt.minimumPayment, interestAmount),
				debt.currentBalance,
			);

			debt.currentBalance -= principalAmount;
			monthlyPayment += debt.minimumPayment;
			monthlyPrincipal += principalAmount;
			monthlyInterest += interestAmount;
			totalInterest += interestAmount;
		}

		// Apply extra payment according to strategy
		const extraPaymentAllocation = calculateExtraPaymentAllocation(
			workingDebts,
			strategy,
			strategy.extraPayment,
		);

		for (const allocation of extraPaymentAllocation) {
			const debt = workingDebts.find((d) => d._id === allocation.debtId);
			if (debt && debt.currentBalance > 0) {
				const extraPrincipal = Math.min(allocation.amount, debt.currentBalance);
				debt.currentBalance -= extraPrincipal;
				monthlyPayment += extraPrincipal;
				monthlyPrincipal += extraPrincipal;
			}
		}

		const remainingBalance = workingDebts.reduce(
			(sum, debt) => sum + debt.currentBalance,
			0,
		);

		monthlyBreakdown.push({
			month,
			payment: Math.round(monthlyPayment * 100) / 100,
			principal: Math.round(monthlyPrincipal * 100) / 100,
			interest: Math.round(monthlyInterest * 100) / 100,
			remainingBalance: Math.round(remainingBalance * 100) / 100,
		});

		totalPayments += monthlyPayment;

		if (remainingBalance <= 0) break;
	}

	const payoffDate = new Date();
	payoffDate.setMonth(payoffDate.getMonth() + month);

	return {
		totalMonths: month,
		totalInterest: Math.round(totalInterest * 100) / 100,
		totalPayments: Math.round(totalPayments * 100) / 100,
		payoffDate: payoffDate.getTime(),
		monthlyBreakdown,
	};
}
