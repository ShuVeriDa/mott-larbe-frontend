import { ReviewListItem, ReviewListItemSkeleton } from "@/shared/ui/review-list-item";
import type { Suggestion } from "@/features/suggestions";

interface SuggestionListItemProps {
	item: Suggestion;
	isActive: boolean;
	onSelect: (id: string) => void;
	t: (key: string) => string;
}

export const SuggestionListItem = ({ item, isActive, onSelect, t }: SuggestionListItemProps) => {
	const title = item.text?.title ?? item.entry?.rawWord ?? "—";
	const subtitle = `${t(`suggest.fields.${item.field}`)} · ${new Date(item.createdAt).toLocaleDateString()}`;

	return (
		<ReviewListItem
			id={item.id}
			title={title}
			subtitle={subtitle}
			status={item.status}
			isActive={isActive}
			onSelect={onSelect}
		/>
	);
};

export const SuggestionListItemSkeleton = ReviewListItemSkeleton;
