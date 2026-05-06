"use client";

import { useCallback, useState } from "react";
import { useI18n } from "@/shared/lib/i18n";
import {
	useAdminFeedbackThreads,
	useAdminFeedbackThread,
	useAdminFeedbackStats,
	useAdminFeedbackAssignees,
	useAdminFeedbackMutations,
} from "@/entities/feedback";
import type { AdminFeedbackTab, AdminFeedbackThread, FeedbackType, FeedbackStatus, FeedbackPriority } from "@/entities/feedback";

const showToast = (msg: string) => {
	const existing = document.querySelectorAll("[data-feedback-toast]");
	existing.forEach((el) => el.remove());
	const el = document.createElement("div");
	el.dataset.feedbackToast = "1";
	el.style.cssText =
		"position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--t-1,#18180f);color:var(--bg,#f5f4f0);padding:8px 16px;border-radius:8px;font-size:12.5px;font-weight:500;z-index:500;box-shadow:0 4px 12px rgba(0,0,0,.12);white-space:nowrap;pointer-events:none;animation:fadeUp .2s ease";
	el.textContent = msg;
	document.body.appendChild(el);
	setTimeout(() => {
		el.style.opacity = "0";
		el.style.transition = "opacity .3s";
	}, 2000);
	setTimeout(() => el.remove(), 2400);
};

export const useAdminFeedbackPage = () => {
	const { t } = useI18n();

	const [tab, setTab] = useState<AdminFeedbackTab>("OPEN");
	const [typeFilter, setTypeFilter] = useState<FeedbackType | "all">("all");
	const [search, setSearch] = useState("");
	const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
	const [inputMode, setInputMode] = useState<"reply" | "note">("reply");
	const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
	const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
	const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
	const [isMobileChat, setIsMobileChat] = useState(false);
	const [isExporting, setIsExporting] = useState(false);

	const listQuery = useAdminFeedbackThreads({
		tab,
		...(typeFilter !== "all" ? { type: typeFilter } : {}),
		...(search ? { search } : {}),
		limit: 30,
	});

	const detailQuery = useAdminFeedbackThread(activeThreadId);
	const statsQuery = useAdminFeedbackStats();
	const assigneesQuery = useAdminFeedbackAssignees(isAssignModalOpen || isTransferModalOpen);
	const mutations = useAdminFeedbackMutations(activeThreadId);

	const threads = listQuery.data?.pages.flatMap((p) => p.items) ?? [];
	const thread = detailQuery.data ?? null;
	const stats = statsQuery.data ?? null;

	const handleTabChange = useCallback((next: AdminFeedbackTab) => {
		setTab(next);
	}, []);

	const handleTypeChange = useCallback((next: FeedbackType | "all") => {
		setTypeFilter(next);
	}, []);

	const handleSearchChange = useCallback((value: string) => {
		setSearch(value);
	}, []);

	const handleSelect = useCallback((item: AdminFeedbackThread) => {
		setActiveThreadId(item.id);
		setIsMobileChat(true);
		setInputMode("reply");
	}, []);

	const handleBack = useCallback(() => {
		setIsMobileChat(false);
	}, []);

	const handleSend = useCallback(
		(body: string, isInternal: boolean) => {
			if (!activeThreadId) return;
			mutations.reply.mutate(
				{ body, isInternal },
				{ onSuccess: () => showToast(t("admin.feedback.toast.sent")) },
			);
		},
		[activeThreadId, mutations.reply, t],
	);

	const handleStatusChange = useCallback(
		(status: FeedbackStatus) => {
			mutations.updateStatus.mutate(status, {
				onSuccess: () => showToast(t("admin.feedback.toast.statusUpdated")),
			});
		},
		[mutations.updateStatus, t],
	);

	const handlePriorityChange = useCallback(
		(priority: FeedbackPriority) => {
			mutations.updatePriority.mutate(priority, {
				onSuccess: () => showToast(t("admin.feedback.toast.priorityUpdated")),
			});
		},
		[mutations.updatePriority, t],
	);

	const handleAssign = useCallback(
		(adminId: string | null) => {
			mutations.assign.mutate(
				{ assigneeAdminId: adminId },
				{
					onSuccess: () => {
						setIsAssignModalOpen(false);
						showToast(
							adminId
								? t("admin.feedback.toast.assigned")
								: t("admin.feedback.toast.unassigned"),
						);
					},
				},
			);
		},
		[mutations.assign, t],
	);

	const handleTransfer = useCallback(
		(targetAdminId: string, note?: string) => {
			mutations.transferThread.mutate(
				{ targetAdminId, note },
				{
					onSuccess: () => {
						setIsTransferModalOpen(false);
						showToast(t("admin.feedback.toast.transferred"));
					},
				},
			);
		},
		[mutations.transferThread, t],
	);

	const handleClose = useCallback(() => {
		handleStatusChange("RESOLVED");
	}, [handleStatusChange]);

	const handleReopen = useCallback(() => {
		handleStatusChange("NEW");
	}, [handleStatusChange]);

	const handleDelete = useCallback(() => {
		if (!window.confirm(t("admin.feedback.deleteConfirm"))) return;
		mutations.deleteThread.mutate(undefined, {
			onSuccess: () => {
				setActiveThreadId(null);
				setIsMobileChat(false);
				showToast(t("admin.feedback.toast.deleted"));
			},
		});
	}, [mutations.deleteThread, t]);

	const handleCopyLink = useCallback(() => {
		if (!thread) return;
		const url = `${window.location.origin}${window.location.pathname}?ticket=${thread.ticketNumber}`;
		navigator.clipboard?.writeText(url).catch(() => {});
		showToast(t("admin.feedback.toast.linkCopied"));
	}, [thread, t]);

	const handleExport = useCallback(async () => {
		if (isExporting) return;
		setIsExporting(true);
		try {
			const { adminFeedbackApi } = await import("@/entities/feedback");
			const blob = await adminFeedbackApi.export({
				tab,
				...(typeFilter !== "all" ? { type: typeFilter } : {}),
				...(search ? { search } : {}),
				format: "csv",
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "feedback.csv";
			a.click();
			URL.revokeObjectURL(url);
		} catch {
			showToast(t("admin.feedback.toast.exportError"));
		} finally {
			setIsExporting(false);
		}
	}, [isExporting, tab, typeFilter, search, t]);

	const handleMoreMenu = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			if (!thread) return;
			const btn = e.currentTarget;
			const existing = document.getElementById("feedback-more-menu");
			if (existing) { existing.remove(); return; }

			const menu = document.createElement("div");
			menu.id = "feedback-more-menu";
			menu.style.cssText =
				"position:fixed;background:var(--surf);border:.5px solid var(--bd-2);border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,.08);z-index:300;min-width:190px;padding:4px;animation:fadeUp .15s ease";

			const items = [
				{ label: t("admin.feedback.actions.copyLink"), action: () => handleCopyLink() },
				{
					label: thread.status === "RESOLVED"
						? t("admin.feedback.actions.reopen")
						: t("admin.feedback.actions.close"),
					action: () => thread.status === "RESOLVED" ? handleReopen() : handleClose(),
				},
				{ label: t("admin.feedback.actions.delete"), action: () => handleDelete(), red: true },
			];

			menu.innerHTML = items
				.map(
					(item) =>
						`<button style="display:flex;align-items:center;gap:9px;padding:7px 10px;width:100%;background:none;border:none;border-radius:6px;font-family:inherit;font-size:12.5px;color:${(item as { red?: boolean }).red ? "var(--red-t)" : "var(--t-1)"};cursor:pointer;text-align:left" onmouseover="this.style.background='var(--surf-2)'" onmouseout="this.style.background='none'">${item.label}</button>`,
				)
				.join("");

			menu.querySelectorAll("button").forEach((b, i) => {
				b.addEventListener("click", () => {
					items[i].action();
					menu.remove();
				});
			});

			document.body.appendChild(menu);
			const rect = btn.getBoundingClientRect();
			const mw = 196;
			let left = rect.right - mw;
			if (left < 8) left = 8;
			menu.style.top = `${rect.bottom + 4}px`;
			menu.style.left = `${left}px`;

			const closeMenu = (ev: MouseEvent) => {
				if (!menu.contains(ev.target as Node)) { menu.remove(); document.removeEventListener("click", closeMenu); }
			};
			setTimeout(() => document.addEventListener("click", closeMenu, { once: true }), 10);
		},
		[thread, handleCopyLink, handleClose, handleReopen, handleDelete, t],
	);

	return {
		t,
		tab,
		typeFilter,
		search,
		activeThreadId,
		inputMode,
		isAssignModalOpen,
		isTransferModalOpen,
		isInfoDrawerOpen,
		isMobileChat,
		isExporting,
		threads,
		thread,
		stats,
		assignees: assigneesQuery.data ?? [],
		isAssigneesLoading: assigneesQuery.isLoading,
		isListLoading: listQuery.isLoading,
		isFetchingNextPage: listQuery.isFetchingNextPage,
		hasNextPage: listQuery.hasNextPage,
		isDetailLoading: detailQuery.isLoading,
		isReplying: mutations.reply.isPending,
		openCount: stats?.openTotal ?? 0,
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
		fetchNextPage: listQuery.fetchNextPage,
		setInputMode,
		setIsAssignModalOpen,
		setIsTransferModalOpen,
		setIsInfoDrawerOpen,
	};
};
