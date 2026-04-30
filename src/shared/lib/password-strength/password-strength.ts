export type PasswordScore = 0 | 1 | 2 | 3 | 4;

export const scorePassword = (password: string): PasswordScore => {
	let score = 0;
	if (password.length >= 8) score++;
	if (password.length >= 12) score++;
	if (/[a-zа-я]/i.test(password) && /\d/.test(password)) score++;
	if (/[^a-zа-я0-9]/i.test(password)) score++;
	return Math.min(score, 4) as PasswordScore;
};
