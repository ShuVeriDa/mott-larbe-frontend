// ─── Types ─────────────────────────────────────────────────────────────────

export type {
	TextSubmission,
	TextSubmissionStatus,
	TextSubmissionDecision,
	TextSubmissionUser,
	TextSubmissionStats,
	TextSubmissionsListResponse,
	TextSubmissionsListMeta,
	CreateTextSubmissionDto,
	UpdateTextSubmissionDto,
	ReviewTextSubmissionDto,
	GetTextSubmissionsParams,
	GetMyTextSubmissionsParams,
	// New
	SubmissionType,
	SubmissionLicenseType,
} from "./types";

// ─── API ───────────────────────────────────────────────────────────────────

export { textSubmissionsApi } from "./api";

// ─── Query keys + hooks ────────────────────────────────────────────────────

export {
	textSubmissionKeys,
	// Existing
	useMyTextSubmissions,
	useTextSubmissions,
	useTextSubmission,
	useTextSubmissionStats,
	useCreateTextSubmission,
	useReviewTextSubmission,
	// New
	useOwnedTextSubmission,
	useUpdateTextSubmission,
	useDeleteTextSubmission,
	useSubmitTextSubmission,
} from "./queries";
