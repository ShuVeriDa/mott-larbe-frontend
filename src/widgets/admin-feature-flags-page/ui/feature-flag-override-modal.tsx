"use client";

import type {
	CreateFeatureFlagOverrideDto,
	FeatureFlagKeyItem,
} from "@/entities/feature-flag";
import { useAdminFeatureFlagKeys } from "@/entities/feature-flag";
import { http } from "@/shared/api";
import { useDebounce } from "@/shared/lib/debounce";
import { useEffect, useRef, useState } from "react";
import { FlagToggle } from "./flag-toggle";

interface UserSuggestion {
	id: string;
	email: string;
	name: string;
	surname: string;
}

const searchUsers = async (q: string): Promise<UserSuggestion[]> => {
	const r = await http.get<{ items: UserSuggestion[] }>("/admin/users", {
		params: { search: q, limit: 10 },
	});
	return r.data.items;
};

interface FeatureFlagOverrideModalProps {
	open: boolean;
	preselectedFlagId?: string;
	isSubmitting: boolean;
	onSubmit: (dto: CreateFeatureFlagOverrideDto) => void;
	onClose: () => void;
	t: (key: string) => string;
}

export const FeatureFlagOverrideModal = ({
	open,
	preselectedFlagId,
	isSubmitting,
	onSubmit,
	onClose,
	t,
}: FeatureFlagOverrideModalProps) => {
	const [flagId, setFlagId] = useState("");
	const [userInput, setUserInput] = useState("");
	const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [isEnabled, setIsEnabled] = useState(true);
	const [reason, setReason] = useState("");
	const debouncedUser = useDebounce(userInput, 300);
	const suggestRef = useRef<HTMLDivElement>(null);

	const keysQuery = useAdminFeatureFlagKeys({ limit: 100 });
	const flagKeys: FeatureFlagKeyItem[] = keysQuery.data?.items ?? [];

	useEffect(() => {
		if (!open) return;
		setFlagId(preselectedFlagId ?? "");
		setUserInput("");
		setSuggestions([]);
		setIsEnabled(true);
		setReason("");
	}, [open, preselectedFlagId]);

	useEffect(() => {
		if (!debouncedUser || debouncedUser.length < 2) {
			setSuggestions([]);
			return;
		}
		searchUsers(debouncedUser).then(items => {
			setSuggestions(items);
			setShowSuggestions(true);
		});
	}, [debouncedUser]);

	useEffect(() => {
		if (!showSuggestions) return;
		const handler = (e: MouseEvent) => {
			if (
				suggestRef.current &&
				!suggestRef.current.contains(e.target as Node)
			) {
				setShowSuggestions(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [showSuggestions]);

	if (!open) return null;

	const handleSubmit = () => {
		if (!flagId || !userInput) return;
		onSubmit({
			flagId,
			userIdOrEmail: userInput,
			isEnabled,
			reason: reason.trim() || undefined,
		});
	};

	const inputCls =
		"h-[34px] w-full rounded-[8px] border border-bd-2 bg-bg px-2.5 text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc";

	return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-[3px] max-sm:items-end"
			onClick={e => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="w-[440px] rounded-[14px] border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-sm:w-full max-sm:rounded-b-none max-sm:rounded-t-[18px] max-sm:px-4.5 max-sm:pb-8">
				<h2 className="font-display text-[16px] text-t-1 mb-1">
					{t("admin.featureFlags.overrideModal.title")}
				</h2>
				<p className="mb-4 text-[12.5px] text-t-3">
					{t("admin.featureFlags.overrideModal.subtitle")}
				</p>

				{/* Flag select */}
				<div className="mb-3.5">
					<label className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.featureFlags.overrideModal.flagLabel")} *
					</label>
					<select
						className="h-[34px] w-full cursor-pointer rounded-[8px] border border-bd-2 bg-bg px-2.5 text-[13px] text-t-1 outline-none transition-colors focus:border-acc"
						value={flagId}
						onChange={e => setFlagId(e.target.value)}
					>
						<option value="">
							{t("admin.featureFlags.overrideModal.selectFlag")}
						</option>
						{flagKeys.map(f => (
							<option key={f.id} value={f.id}>
								{f.key}
							</option>
						))}
					</select>
				</div>

				{/* User typeahead */}
				<div className="mb-3.5" ref={suggestRef}>
					<label className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.featureFlags.overrideModal.userLabel")} *
					</label>
					<div className="relative">
						<input
							className={inputCls}
							placeholder={t(
								"admin.featureFlags.overrideModal.userPlaceholder",
							)}
							value={userInput}
							onChange={e => {
								setUserInput(e.target.value);
								setShowSuggestions(true);
							}}
							onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
						/>
						{showSuggestions && suggestions.length > 0 && (
							<div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full rounded-[9px] border border-bd-2 bg-surf p-1 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
								{suggestions.map(u => (
									<button
										key={u.id}
										type="button"
										className="flex w-full flex-col rounded-[6px] px-2.5 py-1.5 text-left transition-colors hover:bg-surf-2"
										onClick={() => {
											setUserInput(u.email);
											setShowSuggestions(false);
										}}
									>
										<span className="text-[12.5px] text-t-1">
											{u.name} {u.surname}
										</span>
										<span className="text-[11px] text-t-3">{u.email}</span>
									</button>
								))}
							</div>
						)}
					</div>
				</div>

				{/* isEnabled toggle */}
				<div className="mb-3.5 flex items-center justify-between rounded-[8px] border border-bd-1 bg-bg px-3 py-2.5">
					<span className="text-[12.5px] text-t-2">
						{t("admin.featureFlags.overrideModal.valueLabel")}
					</span>
					<FlagToggle enabled={isEnabled} onChange={setIsEnabled} />
				</div>

				{/* Reason */}
				<div className="mb-3.5">
					<label className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.featureFlags.overrideModal.reasonLabel")}
					</label>
					<input
						className={inputCls}
						placeholder={t(
							"admin.featureFlags.overrideModal.reasonPlaceholder",
						)}
						value={reason}
						onChange={e => setReason(e.target.value)}
					/>
				</div>

				<div className="mt-5 flex justify-end gap-2 max-sm:flex-col-reverse">
					<button
						type="button"
						onClick={onClose}
						disabled={isSubmitting}
						className="h-8 cursor-pointer rounded-base border border-bd-2 bg-transparent px-3.5 text-[12.5px] text-t-2 transition-all hover:border-bd-3 hover:bg-surf-2 disabled:opacity-50 max-sm:h-10"
					>
						{t("admin.featureFlags.modal.cancel")}
					</button>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={isSubmitting || !flagId || !userInput}
						className="h-8 cursor-pointer rounded-base bg-acc px-3.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-[.88] disabled:opacity-50 max-sm:h-10"
					>
						{isSubmitting
							? t("admin.featureFlags.overrideModal.saving")
							: t("admin.featureFlags.overrideModal.confirm")}
					</button>
				</div>
			</div>
		</div>
	);
};
