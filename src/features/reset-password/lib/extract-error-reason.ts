import axios from "axios";

export type ResetErrorReason =
	| "token_invalid"
	| "token_expired"
	| "token_used"
	| "weak_password"
	| "account_unavailable"
	| "generic";

const KNOWN_REASONS: ResetErrorReason[] = [
	"token_invalid",
	"token_expired",
	"token_used",
	"weak_password",
	"account_unavailable",
];

export const extractResetErrorReason = (error: unknown): ResetErrorReason => {
	if (axios.isAxiosError(error)) {
		const data = error.response?.data as
			| { message?: unknown; reason?: unknown }
			| undefined;
		const candidate =
			typeof data?.message === "string"
				? data.message
				: typeof data?.reason === "string"
					? data.reason
					: undefined;
		if (candidate && (KNOWN_REASONS as string[]).includes(candidate)) {
			return candidate as ResetErrorReason;
		}
	}
	return "generic";
};
