"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import type {
	CreateFeatureFlagOverrideDto,
	FeatureFlagKeyItem,
} from "@/entities/feature-flag";
import { useAdminFeatureFlagKeys } from "@/entities/feature-flag";
import { http } from "@/shared/api";
import { useDebounce } from "@/shared/lib/debounce";
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { Select } from "@/shared/ui/select";
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
		// eslint-disable-next-line react-hooks/set-state-in-effect -- reset modal state on open
		setFlagId(preselectedFlagId ?? "");
		setUserInput("");
		setSuggestions([]);
		setIsEnabled(true);
		setReason("");
	}, [open, preselectedFlagId]);

	useEffect(() => {
		if (!debouncedUser || debouncedUser.length < 2) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- clear typeahead list for short query
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
				!suggestRef.current.contains(e.target as Node /* intentional: outside-click target */)
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

	const handleBackdropClick: NonNullable<ComponentProps<"div">["onClick"]> = e => {
			if (/* intentional: backdrop-only click */ e.target === e.currentTarget) onClose();
		};
	const handleFlagChange: NonNullable<ComponentProps<"select">["onChange"]> = e => setFlagId(e.currentTarget.value);
	const handleUserInputChange: NonNullable<ComponentProps<"input">["onChange"]> = e => {
		setUserInput(e.currentTarget.value);
		setShowSuggestions(true);
	};
	const handleFocus: NonNullable<ComponentProps<"input">["onFocus"]> = () => suggestions.length > 0 && setShowSuggestions(true);
	const handleReasonChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setReason(e.currentTarget.value);
return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-[3px] max-sm:items-end"
			onClick={handleBackdropClick}
		>
			<div className="w-[440px] rounded-[14px] border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-sm:w-full max-sm:rounded-b-none max-sm:rounded-t-[18px] max-sm:px-4.5 max-sm:pb-8">
				<Typography tag="h2" className="font-display text-[16px] text-t-1 mb-1">
					{t("admin.featureFlags.overrideModal.title")}
				</Typography>
				<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
					{t("admin.featureFlags.overrideModal.subtitle")}
				</Typography>

				{/* Flag select */}
				<div className="mb-3.5">
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.featureFlags.overrideModal.flagLabel")} *
					</Typography>
					<Select
						variant="lg"
						value={flagId}
						onChange={handleFlagChange}
						className="bg-bg"
					>
						<option value="">
							{t("admin.featureFlags.overrideModal.selectFlag")}
						</option>
						{flagKeys.map(f => (
							<option key={f.id} value={f.id}>
								{f.key}
							</option>
						))}
					</Select>
				</div>

				{/* User typeahead */}
				<div className="mb-3.5" ref={suggestRef}>
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.featureFlags.overrideModal.userLabel")} *
					</Typography>
					<div className="relative">
						<input
							className={inputCls}
							placeholder={t(
								"admin.featureFlags.overrideModal.userPlaceholder",
							)}
							value={userInput}
							onChange={handleUserInputChange}
							onFocus={handleFocus}
						/>
						{showSuggestions && suggestions.length > 0 && (
							<div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full rounded-[9px] border border-bd-2 bg-surf p-1 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
								{suggestions.map(u => {
								  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => {
											setUserInput(u.email);
											setShowSuggestions(false);
										};
								  return (
									<Button
										key={u.id}
										className="flex w-full flex-col rounded-[6px] px-2.5 py-1.5 text-left transition-colors hover:bg-surf-2"
										onClick={handleClick}
									>
										<Typography tag="span" className="text-[12.5px] text-t-1">
											{u.name} {u.surname}
										</Typography>
										<Typography tag="span" className="text-[11px] text-t-3">{u.email}</Typography>
									</Button>
								);
								})}
							</div>
						)}
					</div>
				</div>

				{/* isEnabled toggle */}
				<div className="mb-3.5 flex items-center justify-between rounded-[8px] border border-bd-1 bg-bg px-3 py-2.5">
					<Typography tag="span" className="text-[12.5px] text-t-2">
						{t("admin.featureFlags.overrideModal.valueLabel")}
					</Typography>
					<FlagToggle enabled={isEnabled} onChange={setIsEnabled} />
				</div>

				{/* Reason */}
				<div className="mb-3.5">
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.featureFlags.overrideModal.reasonLabel")}
					</Typography>
					<input
						className={inputCls}
						placeholder={t(
							"admin.featureFlags.overrideModal.reasonPlaceholder",
						)}
						value={reason}
						onChange={handleReasonChange}
					/>
				</div>

				<div className="mt-5 flex justify-end gap-2 max-sm:flex-col-reverse">
					<Button
						onClick={onClose}
						disabled={isSubmitting}
						className="h-8 cursor-pointer rounded-base border border-bd-2 bg-transparent px-3.5 text-[12.5px] text-t-2 transition-all hover:border-bd-3 hover:bg-surf-2 disabled:opacity-50 max-sm:h-10"
					>
						{t("admin.featureFlags.modal.cancel")}
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isSubmitting || !flagId || !userInput}
						className="h-8 cursor-pointer rounded-base bg-acc px-3.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-[.88] disabled:opacity-50 max-sm:h-10"
					>
						{isSubmitting
							? t("admin.featureFlags.overrideModal.saving")
							: t("admin.featureFlags.overrideModal.confirm")}
					</Button>
				</div>
			</div>
		</div>
	);
};
