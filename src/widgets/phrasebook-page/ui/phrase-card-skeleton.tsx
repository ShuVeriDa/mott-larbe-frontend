import { Skeleton } from "@/shared/ui/skeleton";
import { PhraseCardSkeleton } from "./phrase-card-skeleton-item";

export const PhraseListSkeleton = () => (
	<div className="flex flex-col gap-1.5">
		{Array.from({ length: 5 }, (_, i) => (
			<PhraseCardSkeleton key={i} />
		))}
	</div>
);
