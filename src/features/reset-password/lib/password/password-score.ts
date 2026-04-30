export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

export const scorePassword = (value: string): PasswordStrength => {
	if (!value) return 0;
	let score = 0;
	if (value.length >= 8) score += 1;
	if (value.length >= 12) score += 1;
	if (/[a-zа-яё]/i.test(value) && /\d/.test(value)) score += 1;
	const hasSpecial = /[^a-zа-яё0-9]/i.test(value);
	const hasMixedCase = /[A-ZА-ЯЁ]/.test(value) && /[a-zа-яё]/.test(value);
	if (hasSpecial || hasMixedCase) score += 1;
	return Math.min(score, 4) as PasswordStrength;
};
