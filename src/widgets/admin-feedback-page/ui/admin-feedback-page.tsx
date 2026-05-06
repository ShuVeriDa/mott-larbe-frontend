"use client";

import { useAdminFeedbackPage } from "../model/use-admin-feedback-page";
import { FeedbackListPanel } from "./feedback-list-panel";
import { FeedbackChatPanel } from "./feedback-chat-panel";
import { FeedbackEmptyState } from "./feedback-empty-state";
import { FeedbackAssignModal } from "./feedback-assign-modal";
import { FeedbackTransferModal } from "./feedback-transfer-modal";
import { FeedbackInfoDrawer } from "./feedback-info-drawer";

export const AdminFeedbackPage = () => {
	const {
		t,
		tab,
		typeFilter,
		search,
		inputMode,
		isAssignModalOpen,
		isTransferModalOpen,
		isInfoDrawerOpen,
		isMobileChat,
		isExporting,
		threads,
		thread,
		stats,
		assignees,
		isAssigneesLoading,
		isListLoading,
		isFetchingNextPage,
		hasNextPage,
		isReplying,
		openCount,
		handleTabChange,
		handleTypeChange,
		handleSearchChange,
		handleSelect,
		handleBack,
		handleSend,
		handleStatusChange,
		handlePriorityChange,
		handleAssign,
		handleTransfer,
		handleClose,
		handleReopen,
		handleDelete,
		handleCopyLink,
		handleExport,
		handleMoreMenu,
		fetchNextPage,
		setInputMode,
		setIsAssignModalOpen,
		setIsTransferModalOpen,
		setIsInfoDrawerOpen,
	} = useAdminFeedbackPage();

	return (
		<>
			{/* Topbar */}
			<div className="flex shrink-0 items-center gap-2.5 border-b border-bd-1 bg-bg px-[22px] py-[14px] max-sm:px-3.5">
				<div>
					<p className="font-display text-[16px] text-t-1">{t("admin.feedback.title")}</p>
					<p className="text-[12px] text-t-3">{t("admin.feedback.subtitle")}</p>
				</div>
				<div className="ml-auto flex items-center gap-2">
					{stats && (
						<>
							<StatChip
								label={t("admin.feedback.stats.total")}
								value={stats.total}
							/>
							<StatChip
								label={t("admin.feedback.stats.open")}
								value={stats.openTotal}
								highlight
							/>
						</>
					)}
					<button
						type="button"
						disabled={isExporting}
						onClick={handleExport}
						className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-surf px-2.5 text-[12px] font-medium text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1 disabled:opacity-50"
					>
						<svg viewBox="0 0 16 16" fill="none" className="size-[13px]">
							<path d="M8 2v9M4 8l4 4 4-4M3 14h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						{t("admin.feedback.export")}
					</button>
				</div>
			</div>

			{/* Body */}
			<div className="flex min-h-0 flex-1 overflow-hidden">
				<FeedbackListPanel
					threads={threads}
					activeId={thread?.id ?? null}
					tab={tab}
					typeFilter={typeFilter}
					search={search}
					openCount={openCount}
					isLoading={isListLoading}
					isFetchingNextPage={isFetchingNextPage}
					hasNextPage={hasNextPage}
					isMobileVisible={isMobileChat}
					t={t}
					onTabChange={handleTabChange}
					onTypeChange={handleTypeChange}
					onSearchChange={handleSearchChange}
					onSelect={handleSelect}
					onLoadMore={fetchNextPage}
				/>

				{thread ? (
					<FeedbackChatPanel
						thread={thread}
						inputMode={inputMode}
						isReplying={isReplying}
						isMobileVisible={isMobileChat}
						t={t}
						onBack={handleBack}
						onInfoOpen={() => setIsInfoDrawerOpen(true)}
						onCopyLink={handleCopyLink}
						onMoreMenu={handleMoreMenu}
						onModeChange={setInputMode}
						onSend={handleSend}
						onReopen={handleReopen}
						onStatusChange={handleStatusChange}
						onPriorityChange={handlePriorityChange}
						onAssignOpen={() => setIsAssignModalOpen(true)}
						onTransferOpen={() => setIsTransferModalOpen(true)}
						onClose={handleClose}
						onDelete={handleDelete}
					/>
				) : (
					<FeedbackEmptyState t={t} />
				)}
			</div>

			{/* Info drawer (tablet / mobile) */}
			<FeedbackInfoDrawer
				isOpen={isInfoDrawerOpen}
				thread={thread}
				t={t}
				onClose={() => setIsInfoDrawerOpen(false)}
				onStatusChange={handleStatusChange}
				onPriorityChange={handlePriorityChange}
				onAssignOpen={() => { setIsInfoDrawerOpen(false); setIsAssignModalOpen(true); }}
				onTransferOpen={() => { setIsInfoDrawerOpen(false); setIsTransferModalOpen(true); }}
				onClose2={handleClose}
				onReopen={handleReopen}
				onDelete={handleDelete}
			/>

			{/* Assign modal */}
			<FeedbackAssignModal
				isOpen={isAssignModalOpen}
				assignees={assignees}
				currentThread={thread}
				isLoading={isAssigneesLoading}
				t={t}
				onAssign={handleAssign}
				onClose={() => setIsAssignModalOpen(false)}
			/>

			{/* Transfer modal */}
			<FeedbackTransferModal
				isOpen={isTransferModalOpen}
				assignees={assignees}
				currentAssigneeId={thread?.assigneeAdminId ?? null}
				isLoading={isAssigneesLoading}
				t={t}
				onTransfer={handleTransfer}
				onClose={() => setIsTransferModalOpen(false)}
			/>
		</>
	);
};

const StatChip = ({
	label,
	value,
	highlight,
}: {
	label: string;
	value: number;
	highlight?: boolean;
}) => (
	<div className="flex items-center gap-1 rounded-[6px] border border-bd-1 bg-surf px-2 py-[3px]">
		<span className="text-[10.5px] text-t-3">{label}</span>
		<span
			className={`text-[12px] font-semibold ${highlight ? "text-acc-t" : "text-t-1"}`}
		>
			{value}
		</span>
	</div>
);
