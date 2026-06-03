import { ReviewListItem, ReviewListItemSkeleton } from "@/shared/ui/review-list-item";
import type { TextSubmission } from "@/features/text-submission";
import { TextSubmissionSubmissionTypeBadge } from "./text-submission-submission-type-badge";

interface TextSubmissionListItemProps {
	item: TextSubmission;
	isActive: boolean;
	onSelect: (id: string) => void;
	t: (key: string) => string;
}

export const TextSubmissionListItem = ({
	item, isActive, onSelect, t,
}: TextSubmissionListItemProps) => (
	<ReviewListItem
		id={item.id}
		title={item.title}
		subtitle={`${item.language.toUpperCase()} · ${item.user?.username ?? item.user?.name ?? "—"}`}
		status={item.status}
		isActive={isActive}
		onSelect={onSelect}
		rightSlot={
			<TextSubmissionSubmissionTypeBadge
				submissionType={item.submissionType}
				t={t}
			/>
		}
	/>
);

export const TextSubmissionListItemSkeleton = ReviewListItemSkeleton;
