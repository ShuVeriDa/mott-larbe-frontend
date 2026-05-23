"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useAdminSuggestionsPage } from "../model/use-admin-suggestions-page";
import { AdminSuggestionsStats } from "./admin-suggestions-stats";
import { SuggestionReviewPanel } from "./suggestion-review-panel";
import { SuggestionsLeftColumn } from "./suggestions-left-column";
import { SuggestionsTopbar } from "./suggestions-topbar";

export const AdminSuggestionsPage = () => {
	const { t } = useI18n();

	const {
		suggestions,
		stats,
		isLoading,
		statusFilter,
		query,
		selectedId,
		selectedSuggestion,
		reviewComment,
		isReviewing,
		handleStatusFilterChange,
		handleQueryChange,
		handleSelect,
		handleReviewCommentChange,
		handleApprove,
		handleReject,
	} = useAdminSuggestionsPage();

	const total = stats?.total ?? 0;

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<SuggestionsTopbar total={total} isLoading={isLoading} t={t} />

			<AdminSuggestionsStats stats={stats} t={t} />

			<div className="flex flex-1 overflow-hidden max-sm:flex-col">
				<div className="flex w-[320px] shrink-0 flex-col overflow-hidden bg-surf max-sm:h-[50vh] max-sm:w-full max-sm:border-b max-sm:border-bd-1">
					<SuggestionsLeftColumn
						items={suggestions}
						isLoading={isLoading}
						selectedId={selectedId}
						search={query}
						statusFilter={statusFilter}
						onSearchChange={handleQueryChange}
						onStatusChange={handleStatusFilterChange}
						onSelect={handleSelect}
						t={t}
					/>
				</div>

				<div className="min-w-0 flex-1 overflow-y-auto bg-surf max-sm:flex-1">
					<SuggestionReviewPanel
						suggestion={selectedSuggestion}
						comment={reviewComment}
						isPending={isReviewing}
						onCommentChange={handleReviewCommentChange}
						onApprove={handleApprove}
						onReject={handleReject}
						t={t}
					/>
				</div>
			</div>
		</div>
	);
};
