import {
	type CreateDebtInput,
	type CreatePaymentInput,
	type CreateStrategyInput,
	createDebtSchema,
	createPaymentSchema,
	createStrategySchema,
	type UpdateDebtInput,
	type UpdateStrategyInput,
	updateDebtSchema,
	updateStrategySchema,
} from "./debt-schemas";

// Validation result type
export type ValidationResult<T> =
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			error: string;
			issues: Array<{ path: string; message: string }>;
	  };

// Debt validation functions
export function validateCreateDebt(
	data: unknown,
): ValidationResult<CreateDebtInput> {
	const result = createDebtSchema.safeParse(data);

	if (result.success) {
		return { success: true, data: result.data };
	}

	return {
		success: false,
		error: "Invalid debt data",
		issues: result.error.issues.map((issue) => ({
			path: issue.path.join("."),
			message: issue.message,
		})),
	};
}

export function validateUpdateDebt(
	data: unknown,
): ValidationResult<UpdateDebtInput> {
	const result = updateDebtSchema.safeParse(data);

	if (result.success) {
		return { success: true, data: result.data };
	}

	return {
		success: false,
		error: "Invalid debt update data",
		issues: result.error.issues.map((issue) => ({
			path: issue.path.join("."),
			message: issue.message,
		})),
	};
}

// Payment validation functions
export function validateCreatePayment(
	data: unknown,
): ValidationResult<CreatePaymentInput> {
	const result = createPaymentSchema.safeParse(data);

	if (result.success) {
		return { success: true, data: result.data };
	}

	return {
		success: false,
		error: "Invalid payment data",
		issues: result.error.issues.map((issue) => ({
			path: issue.path.join("."),
			message: issue.message,
		})),
	};
}

// Strategy validation functions
export function validateCreateStrategy(
	data: unknown,
): ValidationResult<CreateStrategyInput> {
	const result = createStrategySchema.safeParse(data);

	if (result.success) {
		return { success: true, data: result.data };
	}

	return {
		success: false,
		error: "Invalid strategy data",
		issues: result.error.issues.map((issue) => ({
			path: issue.path.join("."),
			message: issue.message,
		})),
	};
}

export function validateUpdateStrategy(
	data: unknown,
): ValidationResult<UpdateStrategyInput> {
	const result = updateStrategySchema.safeParse(data);

	if (result.success) {
		return { success: true, data: result.data };
	}

	return {
		success: false,
		error: "Invalid strategy update data",
		issues: result.error.issues.map((issue) => ({
			path: issue.path.join("."),
			message: issue.message,
		})),
	};
}

// Utility validation functions
export function validatePositiveNumber(
	value: unknown,
	fieldName: string,
): ValidationResult<number> {
	if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
		return {
			success: false,
			error: `Invalid ${fieldName}`,
			issues: [
				{ path: fieldName, message: `${fieldName} must be a positive number` },
			],
		};
	}

	return { success: true, data: value };
}

export function validateCurrencyAmount(
	value: unknown,
	fieldName: string,
): ValidationResult<number> {
	if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
		return {
			success: false,
			error: `Invalid ${fieldName}`,
			issues: [
				{
					path: fieldName,
					message: `${fieldName} must be a valid currency amount`,
				},
			],
		};
	}

	// Check if it's a valid currency amount (max 2 decimal places)
	if (Math.round(value * 100) !== value * 100) {
		return {
			success: false,
			error: `Invalid ${fieldName}`,
			issues: [
				{
					path: fieldName,
					message: `${fieldName} must have at most 2 decimal places`,
				},
			],
		};
	}

	return { success: true, data: value };
}

export function validatePercentage(
	value: unknown,
	fieldName: string,
): ValidationResult<number> {
	if (
		typeof value !== "number" ||
		Number.isNaN(value) ||
		value < 0 ||
		value > 100
	) {
		return {
			success: false,
			error: `Invalid ${fieldName}`,
			issues: [
				{ path: fieldName, message: `${fieldName} must be between 0 and 100` },
			],
		};
	}

	return { success: true, data: value };
}

export function validateDateNotFuture(
	value: unknown,
	fieldName: string,
): ValidationResult<number> {
	if (typeof value !== "number" || Number.isNaN(value) || value > Date.now()) {
		return {
			success: false,
			error: `Invalid ${fieldName}`,
			issues: [
				{ path: fieldName, message: `${fieldName} cannot be in the future` },
			],
		};
	}

	return { success: true, data: value };
}
