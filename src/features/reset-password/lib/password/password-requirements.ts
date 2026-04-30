export interface PasswordRequirements {
	len: boolean;
	num: boolean;
	case: boolean;
}

export const checkPasswordRequirements = (
	value: string,
): PasswordRequirements => ({
	len: value.length >= 8,
	num: /\d/.test(value),
	case: /[A-ZА-ЯЁ]/.test(value) && /[a-zа-яё]/.test(value),
});

export const allRequirementsMet = (reqs: PasswordRequirements): boolean =>
	reqs.len && reqs.num && reqs.case;
