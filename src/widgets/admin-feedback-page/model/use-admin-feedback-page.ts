"use client";

import type {
	AdminFeedbackTab,
	AdminFeedbackThread,
	FeedbackPriority,
	FeedbackStatus,
	FeedbackType,
} from "@/entities/feedback";
import {
	useAdminFeedbackAssignees,
	useAdminFeedbackMutations,
	useAdminFeedbackStats,
	useAdminFeedbackThread,
	useAdminFeedbackThreads,
} from "@/entities/feedback";
import { useMarkNotificationRead } from "@/features/mark-notification-read";
import { notificationKeys, type Notification } from "@/entities/notification";
import { useI18n } from "@/shared/lib/i18n";
import { useToastStore } from "@/shared/lib/toast";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { type MouseEvent as ReactMouseEvent, useEffect, useState } from "react";

export const useAdminFeedbackPage = () => {
	const { t } = useI18n();
	const showToast = useToastStore(s => s.push);
	const router = useRouter();
	const searchParams = useSearchParams();
	const qc = useQueryClient();
	const { mutate: markNotificationRead } = useMarkNotificationRead();

	const [tab, setTab] = useState<AdminFeedbackTab>("OPEN");
	const [typeFilter, setTypeFilter] = useState<FeedbackType | "all">("all");
	const [search, setSearch] = useState("");
	const activeThreadId = searchParams.get("thread");
	const [inputMode, setInputMode] = useState<"reply" | "note">("reply");
	const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
	const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
	const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
	const [isMobileChat, setIsMobileChat] = useState(() => !!searchParams.get("thread"));
	const [isExporting, setIsExporting] = useState(false);

	const listQuery = useAdminFeedbackThreads({
		tab,
		...(typeFilter !== "all" ? { type: typeFilter } : {}),
		...(search ? { search } : {}),
		limit: 30,
	});

	const detailQuery = useAdminFeedbackThread(activeThreadId);
	const statsQuery = useAdminFeedbackStats();
	const assigneesQuery = useAdminFeedbackAssignees(
		isAssignModalOpen || isTransferModalOpen,
	);
	const mutations = useAdminFeedbackMutations(activeThreadId);

	const threads = listQuery.data?.pages.flatMap(p => p.items) ?? [];
	const thread = detailQuery.data ?? null;
	const stats = statsQuery.data ?? null;

	useEffect(() => {
		if (!activeThreadId) return;
		const notifications = qc.getQueryData<Notification[]>(notificationKeys.list());
		const match = notifications?.find(
			(n) => !n.isRead && n.type === "NEW_FEEDBACK_THREAD" && n.entityId === activeThreadId,
		);
		if (match) markNotificationRead(match.id);
	}, [activeThreadId, qc, markNotificationRead]);

	const setThread = (id: string | null) => {
		const params = new URLSearchParams(searchParams.toString());
		if (id) {
			params.set("thread", id);
		} else {
			params.delete("thread");
		}
		router.replace(`?${params.toString()}`, { scroll: false });
	};

	const handleTabChange = (next: AdminFeedbackTab) => {
		setTab(next);
	};

	const handleTypeChange = (next: FeedbackType | "all") => {
		setTypeFilter(next);
	};

	const handleSearchChange = (value: string) => {
		setSearch(value);
	};

	const handleSelect = (item: AdminFeedbackThread) => {
		setThread(item.id);
		setIsMobileChat(true);
		setInputMode("reply");
	};

	const handleBack = () => {
		setIsMobileChat(false);
	};

	const handleSend = (body: string, isInternal: boolean) => {
		if (!activeThreadId) return;
		mutations.reply.mutate(
			{ body, isInternal },
			{ onSuccess: () => showToast(t("admin.feedback.toast.sent")) },
		);
	};

	const handleStatusChange = (status: FeedbackStatus) => {
		mutations.updateStatus.mutate(status, {
			onSuccess: () => showToast(t("admin.feedback.toast.statusUpdated")),
		});
	};

	const handlePriorityChange = (priority: FeedbackPriority) => {
		mutations.updatePriority.mutate(priority, {
			onSuccess: () => showToast(t("admin.feedback.toast.priorityUpdated")),
		});
	};

	const handleAssign = (adminId: string | null) => {
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
	};

	const handleTransfer = (targetAdminId: string, note?: string) => {
		mutations.transferThread.mutate(
			{ targetAdminId, note },
			{
				onSuccess: () => {
					setIsTransferModalOpen(false);
					showToast(t("admin.feedback.toast.transferred"));
				},
			},
		);
	};

	const handleClose = () => {
		handleStatusChange("RESOLVED");
	};

	const handleReopen = () => {
		handleStatusChange("NEW");
	};

	const handleDelete = () => {
		if (!window.confirm(t("admin.feedback.deleteConfirm"))) return;
		mutations.deleteThread.mutate(undefined, {
			onSuccess: () => {
				setThread(null);
				setIsMobileChat(false);
				showToast(t("admin.feedback.toast.deleted"));
			},
		});
	};

	const handleCopyLink = () => {
		if (!thread) return;
		const url = `${window.location.origin}${window.location.pathname}?ticket=${thread.ticketNumber}`;
		navigator.clipboard?.writeText(url).catch(() => {});
		showToast(t("admin.feedback.toast.linkCopied"));
	};

	const handleExport = async () => {
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
	};

	const handleMoreMenu = (e: ReactMouseEvent<HTMLButtonElement>) => {
		if (!thread) return;
		const btn = e.currentTarget;
		const existing = document.getElementById("feedback-more-menu");
		if (existing) {
			existing.remove();
			return;
		}

		const menu = document.createElement("div");
		menu.id = "feedback-more-menu";
		menu.style.cssText =
			"position:fixed;background:var(--surf);border:.5px solid var(--bd-2);border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,.08);z-index:300;min-width:190px;padding:4px;animation:fadeUp .15s ease";

		const items = [
			{
				label: t("admin.feedback.actions.copyLink"),
				action: () => handleCopyLink(),
			},
			{
				label:
					thread.status === "RESOLVED"
						? t("admin.feedback.actions.reopen")
						: t("admin.feedback.actions.close"),
				action: () =>
					thread.status === "RESOLVED" ? handleReopen() : handleClose(),
			},
			{
				label: t("admin.feedback.actions.delete"),
				action: () => handleDelete(),
				red: true,
			},
		];

		menu.innerHTML = items
			.map(
				item =>
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

		const closeMenu = (ev: globalThis.MouseEvent) => {
			if (!menu.contains(ev.target as Node)) {
				menu.remove();
				document.removeEventListener("click", closeMenu);
			}
		};
		setTimeout(
			() => document.addEventListener("click", closeMenu, { once: true }),
			10,
		);
	};

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
