"use client";

import type { FeatureFlagItem } from "@/entities/feature-flag";
import { cn } from "@/shared/lib/cn";
import { ComponentProps, useEffect, useState } from 'react';
interface FeatureFlagDuplicateModalProps {
	flag: FeatureFlagItem | null;
	isDuplicating: boolean;
	onConfirm: (newKey: string) => void;
	onClose: () => void;
	t: (key: string) => string;
}

export const FeatureFlagDuplicateModal = ({
	flag,
	isDuplicating,
	onConfirm,
	onClose,
	t,
}: FeatureFlagDuplicateModalProps) => {
	const [key, setKey] = useState("");
	const [keyError, setKeyError] = useState("");

	useEffect(() => {
		if (!flag) return;
		setKey(`${flag.key}_copy`);
		setKeyError("");
	}, [flag]);

	if (!flag) return null;

	const handleSubmit = () => {
		const keyPattern = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;
		if (!keyPattern.test(key)) {
			setKeyError(t("admin.featureFlags.modal.keyHint"));
			return;
		}
		onConfirm(key);
	};

		const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = e => {
				if (/* intentional: backdrop-only click */ e.target === e.currentTarget) onClose();
			};
	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e => {
							setKey(e.currentTarget.value);
							setKeyError("");
						};
return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-[3px]"
			onClick={handleClick}
		>
			<div className="w-[400px] rounded-[14px] border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
				<h2 className="font-display text-[16px] text-t-1 mb-1">
					{t("admin.featureFlags.duplicateModal.title")}
				</h2>
				<p className="mb-4 text-[12.5px] text-t-3">
					{t("admin.featureFlags.duplicateModal.subtitle")}
				</p>
				<div className="mb-1.5">
					<label className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.featureFlags.modal.keyLabel")} *
					</label>
					<input
						className={cn(
							"h-[34px] w-full rounded-[8px] border border-bd-2 bg-bg px-2.5 text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc",
							keyError && "border-red-400",
						)}
						value={key}
						onChange={handleChange}
					/>
					{keyError ? (
						<p className="mt-1 text-[11px] text-red-t">{keyError}</p>
					) : (
						<p className="mt-1 text-[11px] text-t-3">
							{t("admin.featureFlags.modal.keyHint")}
						</p>
					)}
				</div>
				<div className="mt-5 flex justify-end gap-2">
					<button
						type="button"
						onClick={onClose}
						disabled={isDuplicating}
						className="h-8 cursor-pointer rounded-base border border-bd-2 bg-transparent px-3.5 text-[12.5px] text-t-2 transition-all hover:border-bd-3 hover:bg-surf-2 disabled:opacity-50"
					>
						{t("admin.featureFlags.modal.cancel")}
					</button>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={isDuplicating || !key}
						className="h-8 cursor-pointer rounded-base bg-acc px-3.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-[.88] disabled:opacity-50"
					>
						{isDuplicating
							? t("admin.featureFlags.duplicateModal.duplicating")
							: t("admin.featureFlags.duplicateModal.confirm")}
					</button>
				</div>
			</div>
		</div>
	);
};
