"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFeedbackApi, adminFeedbackKeys } from "../api";
import type {
	AdminReplyDto,
	AssignFeedbackDto,
	FeedbackPriority,
	TransferFeedbackDto,
	UpdateFeedbackStatusDto,
} from "../api";
import type { FeedbackStatus } from "../api";

export const useAdminFeedbackMutations = (threadId: string | null) => {
	const qc = useQueryClient();

	const invalidate = () => {
		if (threadId) {
			qc.invalidateQueries({ queryKey: adminFeedbackKeys.detail(threadId) });
		}
		qc.invalidateQueries({ queryKey: adminFeedbackKeys.root });
		qc.invalidateQueries({ queryKey: adminFeedbackKeys.stats() });
	};

	const reply = useMutation({
		mutationFn: (dto: AdminReplyDto) => {
			if (!threadId) return Promise.reject(new Error("No thread selected"));
			return adminFeedbackApi.reply(threadId, dto);
		},
		onSuccess: invalidate,
	});

	const updateStatus = useMutation({
		mutationFn: (status: FeedbackStatus) => {
			if (!threadId) return Promise.reject(new Error("No thread selected"));
			return adminFeedbackApi.updateStatus(threadId, { status } satisfies UpdateFeedbackStatusDto);
		},
		onSuccess: invalidate,
	});

	const updatePriority = useMutation({
		mutationFn: (priority: FeedbackPriority) => {
			if (!threadId) return Promise.reject(new Error("No thread selected"));
			return adminFeedbackApi.updatePriority(threadId, { priority });
		},
		onSuccess: invalidate,
	});

	const assign = useMutation({
		mutationFn: (dto: AssignFeedbackDto) => {
			if (!threadId) return Promise.reject(new Error("No thread selected"));
			return adminFeedbackApi.assign(threadId, dto);
		},
		onSuccess: invalidate,
	});

	const transferThread = useMutation({
		mutationFn: (dto: TransferFeedbackDto) => {
			if (!threadId) return Promise.reject(new Error("No thread selected"));
			return adminFeedbackApi.transfer(threadId, dto);
		},
		onSuccess: invalidate,
	});

	const deleteThread = useMutation({
		mutationFn: () => {
			if (!threadId) return Promise.reject(new Error("No thread selected"));
			return adminFeedbackApi.deleteThread(threadId);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: adminFeedbackKeys.root });
			qc.invalidateQueries({ queryKey: adminFeedbackKeys.stats() });
		},
	});

	return { reply, updateStatus, updatePriority, assign, transferThread, deleteThread };
};
