"use client";

import { cn } from "@/shared/lib/cn";
import type { useI18n } from "@/shared/lib/i18n";
import { Checkbox } from "@/shared/ui/checkbox";
import { InputLabel } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Typography } from "@/shared/ui/typography";
import {
	InfoCard,
	ReviewForm,
	ReviewPanelEmpty,
	ReviewPanelHeader,
	ReviewPanelShell,
} from "@/shared/ui/review-panel";
import type { Nation, PendingHeritageItem, Tukhum } from "@/entities/heritage";
import type { ReviewFormState } from "../model/types";

interface ModerationDetailPanelProps {
	selectedItem: PendingHeritageItem | null;
	reviewForm: ReviewFormState;
	nations: Nation[];
	tukhumy: Tukhum[];
	isPending: boolean;
	showDetail: boolean;
	onBack: () => void;
	onRejectReasonChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	onAddToDirectoryChange: (checked: boolean) => void;
	onNationIdChange: (value: string) => void;
	onTukhumIdChange: (value: string) => void;
	onTaipIdChange: (value: string) => void;
	onApprove: () => void;
	onReject: () => void;
	t: ReturnType<typeof useI18n>["t"];
}

export const ModerationDetailPanel = ({
	selectedItem,
	reviewForm,
	nations,
	tukhumy,
	isPending,
	showDetail,
	onBack,
	onRejectReasonChange,
	onAddToDirectoryChange,
	onNationIdChange,
	onTukhumIdChange,
	onTaipIdChange,
	onApprove,
	onReject,
	t,
}: ModerationDetailPanelProps) => (
	<ReviewPanelShell mobileOverlay showDetail={showDetail} onBack={onBack} backLabel={t("common.back")}>
		{!selectedItem ? (
			<ReviewPanelEmpty text={t("admin.heritage.moderation.selectToReview")} />
		) : (
			<ModerationDetailContent
				item={selectedItem}
				reviewForm={reviewForm}
				nations={nations}
				tukhumy={tukhumy}
				isPending={isPending}
				onRejectReasonChange={onRejectReasonChange}
				onAddToDirectoryChange={onAddToDirectoryChange}
				onNationIdChange={onNationIdChange}
				onTukhumIdChange={onTukhumIdChange}
				onTaipIdChange={onTaipIdChange}
				onApprove={onApprove}
				onReject={onReject}
				t={t}
			/>
		)}
	</ReviewPanelShell>
);

interface ModerationDetailContentProps {
	item: PendingHeritageItem;
	reviewForm: ReviewFormState;
	nations: Nation[];
	tukhumy: Tukhum[];
	isPending: boolean;
	onRejectReasonChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	onAddToDirectoryChange: (checked: boolean) => void;
	onNationIdChange: (value: string) => void;
	onTukhumIdChange: (value: string) => void;
	onTaipIdChange: (value: string) => void;
	onApprove: () => void;
	onReject: () => void;
	t: ReturnType<typeof useI18n>["t"];
}

const ModerationDetailContent = ({
	item,
	reviewForm,
	nations,
	tukhumy,
	isPending,
	onRejectReasonChange,
	onAddToDirectoryChange,
	onNationIdChange,
	onTukhumIdChange,
	onTaipIdChange,
	onApprove,
	onReject,
	t,
}: ModerationDetailContentProps) => {
	const typeLabel = item.type === "TAIP"
		? t("admin.heritage.moderation.typeTaip")
		: t("admin.heritage.moderation.typeGara");

	const handleAddToDirectoryChange = (checked: boolean | "indeterminate") => {
		onAddToDirectoryChange(checked === true);
	};

	const handleNationChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
		onNationIdChange(e.currentTarget.value);

	const handleTukhumChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
		onTukhumIdChange(e.currentTarget.value);

	const handleTaipChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
		onTaipIdChange(e.currentTarget.value);

	return (
		<div className="flex h-full flex-col gap-4">
			<ReviewPanelHeader
				title={item.customValue}
				subtitle={`${typeLabel} · ${item.username ? `@${item.username}` : item.userId}`}
				status="PENDING"
				statusLabel={t("admin.heritage.moderation.statusPending")}
			/>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<InfoCard label={t("admin.heritage.moderation.user")}>
					<Typography tag="p" className="text-[13px] text-t-1">
						{item.username ? `@${item.username}` : "—"}
					</Typography>
				</InfoCard>

				<InfoCard label={t("admin.heritage.moderation.type")}>
					<Typography
						tag="p"
						className={cn(
							"text-[13px] font-medium",
							item.type === "TAIP"
								? "text-blue-700 dark:text-blue-400"
								: "text-purple-700 dark:text-purple-400",
						)}
					>
						{typeLabel}
					</Typography>
				</InfoCard>

				<InfoCard label={t("admin.heritage.moderation.customValue")}>
					<Typography tag="p" className="text-[13px] font-semibold text-t-1">
						{item.customValue}
					</Typography>
				</InfoCard>

				{item.nationName && (
					<InfoCard label={t("admin.heritage.moderation.nation")}>
						<Typography tag="p" className="text-[13px] text-t-1">
							{item.nationName.ru}
						</Typography>
						{item.tukhumName && (
							<Typography tag="p" className="mt-0.5 text-[11px] text-t-3">
								{t("admin.heritage.moderation.tukhum")}: {item.tukhumName.ru}
							</Typography>
						)}
					</InfoCard>
				)}
			</div>

			<div className="rounded-card border border-bd-1 bg-surf px-4 py-3">
				<label className="flex cursor-pointer items-center gap-2.5">
					<Checkbox
						checked={reviewForm.addToDirectory}
						onCheckedChange={handleAddToDirectoryChange}
						disabled={isPending}
					/>
					<Typography tag="span" className="text-[13px] text-t-1">
						{t("admin.heritage.moderation.addToDirectory")}
					</Typography>
				</label>

				{reviewForm.addToDirectory && item.type === "TAIP" && (
					<div className="mt-3 flex flex-col gap-2">
						<div>
							<InputLabel htmlFor="mod-nation">
								{t("admin.heritage.moderation.nation")}
							</InputLabel>
							<Select
								id="mod-nation"
								variant="lg"
								value={reviewForm.nationId}
								onChange={handleNationChange}
								disabled={isPending}
							>
								<option value="">
									{t("admin.heritage.moderation.selectNation")}
								</option>
								{nations.map((n) => (
									<option key={n.id} value={n.id}>
										{n.name.ru}
									</option>
								))}
							</Select>
						</div>

						{reviewForm.nationId && (
							<div>
								<InputLabel htmlFor="mod-tukhum">
									{t("admin.heritage.moderation.tukhum")}
								</InputLabel>
								<Select
									id="mod-tukhum"
									variant="lg"
									value={reviewForm.tukhumId}
									onChange={handleTukhumChange}
									disabled={isPending || tukhumy.length === 0}
								>
									<option value="">
										{t("admin.heritage.moderation.noTukhum")}
									</option>
									{tukhumy.map((tk) => (
										<option key={tk.id} value={tk.id}>
											{tk.name.ru}
										</option>
									))}
								</Select>
							</div>
						)}
					</div>
				)}

				{reviewForm.addToDirectory && item.type === "GARA" && (
					<div className="mt-3">
						<InputLabel htmlFor="mod-taip">
							{t("admin.heritage.moderation.taip")}
						</InputLabel>
						<Select
							id="mod-taip"
							variant="lg"
							value={reviewForm.taipId}
							onChange={handleTaipChange}
							disabled={isPending}
						>
							<option value="">
								{t("admin.heritage.moderation.selectTaip")}
							</option>
						</Select>
						<Typography tag="p" className="mt-1 text-[11px] text-t-4">
							{t("admin.heritage.moderation.garaDirectoryHint")}
						</Typography>
					</div>
				)}
			</div>

			<ReviewForm
				comment={reviewForm.rejectReason}
				isPending={isPending}
				commentLabel={t("admin.heritage.moderation.rejectReason")}
				approveLabel={t("admin.heritage.moderation.approve")}
				rejectLabel={t("admin.heritage.moderation.reject")}
				onCommentChange={onRejectReasonChange}
				onApprove={onApprove}
				onReject={onReject}
				inputId="heritage-review-comment"
			/>
		</div>
	);
};
