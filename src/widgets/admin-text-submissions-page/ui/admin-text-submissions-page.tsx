"use client";

import { useAdminTextSubmissionsPage } from "../model/use-admin-text-submissions-page";
import { AdminTextSubmissionsStats } from "./admin-text-submissions-stats";
import { TextSubmissionReviewPanel } from "./text-submission-review-panel";
import { TextSubmissionsLeftColumn } from "./text-submissions-left-column";
import { TextSubmissionsTopbar } from "./text-submissions-topbar";

export const AdminTextSubmissionsPage = () => {
	const {
		submissions, stats, total, isLoading, isFetching,
		statusFilter, query, order,
		page, pageSize,
		selectedId, selectedSubmission,
		reviewComment, isReviewing, showDetail,
		handleStatusFilterChange, handleQueryChange, handleOrderChange,
		handlePageChange, handlePageSizeChange,
		handleSelect, handleBack,
		handleReviewCommentChange, handleApprove, handleReject,
		t,
	} = useAdminTextSubmissionsPage();

	const statsTotal = stats?.total ?? 0;

	return (
		<div className="relative flex h-full flex-col overflow-hidden">
			<TextSubmissionsTopbar total={statsTotal} isLoading={isLoading} t={t} />

			<AdminTextSubmissionsStats stats={stats} t={t} />

			<div className="flex flex-1 overflow-hidden">
				<div className="flex w-[320px] shrink-0 flex-col overflow-hidden bg-surf max-sm:w-full">
					<TextSubmissionsLeftColumn
						items={submissions}
						isLoading={isLoading}
						selectedId={selectedId}
						search={query}
						statusFilter={statusFilter}
						order={order}
						page={page}
						pageSize={pageSize}
						total={total}
						onSearchChange={handleQueryChange}
						onStatusChange={handleStatusFilterChange}
						onOrderChange={handleOrderChange}
						onPageChange={handlePageChange}
						onPageSizeChange={handlePageSizeChange}
						onSelect={handleSelect}
						t={t}
					/>
				</div>

				<div className="relative min-w-0 flex-1 overflow-y-auto bg-surf max-sm:hidden sm:block">
					<TextSubmissionReviewPanel
						submission={selectedSubmission}
						comment={reviewComment}
						isPending={isReviewing}
						showDetail={showDetail}
						onCommentChange={handleReviewCommentChange}
						onApprove={handleApprove}
						onReject={handleReject}
						onBack={handleBack}
						t={t}
					/>
				</div>
			</div>

			{showDetail && (
				<div className="absolute inset-0 z-10 bg-surf sm:hidden">
					<TextSubmissionReviewPanel
						submission={selectedSubmission}
						comment={reviewComment}
						isPending={isReviewing}
						showDetail={showDetail}
						onCommentChange={handleReviewCommentChange}
						onApprove={handleApprove}
						onReject={handleReject}
						onBack={handleBack}
						t={t}
					/>
				</div>
			)}
		</div>
	);
};
