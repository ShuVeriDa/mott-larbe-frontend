"use client";

import type {
	ProcessingStatus,
	TokenSource,
	TokenStatus,
	useTokenizationMutations,
} from "@/entities/token";
import { tokenizationApi, tokenizationKeys } from "@/entities/token";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Modal } from "@/shared/ui/modal";
import { Typography } from "@/shared/ui/typography";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Play, X } from "lucide-react";
import { ComponentProps } from "react";
import { TokenizationLevelBadge } from "./tokenization-level-badge";
import { TokenizationStatusBadge } from "./tokenization-status-badge";

interface TokenizationTextDetailModalProps {
	textId: string | null;
	onClose: () => void;
	mutations: ReturnType<typeof useTokenizationMutations>;
}

const SOURCE_STYLES: Record<TokenSource, string> = {
	ADMIN: "bg-acc-bg text-acc-t",
	CACHE: "bg-grn-bg text-grn-t",
	MORPHOLOGY: "bg-pur-bg text-pur-t",
	ONLINE: "bg-surf-3 text-t-2",
};

const TOKEN_STATUS_STYLES: Record<TokenStatus, string> = {
	ANALYZED: "bg-grn-bg text-grn-t",
	AMBIGUOUS: "bg-amb-bg text-amb-t",
	NOT_FOUND: "bg-red-bg text-red-t",
};

// ── Sub-components ─────────────────────────────────────────────────────────────

type DetailData = Awaited<ReturnType<typeof tokenizationApi.textDetail>>;
type TokensData = Awaited<ReturnType<typeof tokenizationApi.textTokens>>;

const TokenMetaGrid = ({
	detail,
	statusLabels,
	t,
}: {
	detail: DetailData;
	statusLabels: Record<ProcessingStatus, string>;
	t: ReturnType<typeof useI18n>["t"];
}) => {
	const cells = [
		{
			label: t("admin.tokenization.detail.level"),
			value: <TokenizationLevelBadge level={detail.level} />,
		},
		{
			label: t("admin.tokenization.detail.status"),
			value: (
				<TokenizationStatusBadge
					status={detail.processingStatus}
					label={statusLabels[detail.processingStatus]}
					progress={detail.processingProgress}
				/>
			),
		},
		{
			label: t("admin.tokenization.detail.version"),
			value: detail.version ? (
				<Typography tag="span" className="font-mono text-[12px] text-t-2">
					v{detail.version.version}
				</Typography>
			) : (
				<Typography tag="span" className="text-t-4">
					—
				</Typography>
			),
		},
		{
			label: t("admin.tokenization.detail.totalTokens"),
			value: (
				<Typography tag="span" className="font-medium text-t-1">
					{detail.tokenStats.total.toLocaleString()}
				</Typography>
			),
		},
		{
			label: t("admin.tokenization.detail.analyzed"),
			value: (
				<Typography tag="span" className="font-medium text-grn-t">
					{detail.tokenStats.analyzed.toLocaleString()} (
					{detail.tokenStats.analyzePercent}%)
				</Typography>
			),
		},
		{
			label: t("admin.tokenization.detail.notFound"),
			value: (
				<Typography
					tag="span"
					className={
						detail.tokenStats.notFound > 0
							? "font-medium text-red-t"
							: "text-t-4"
					}
				>
					{detail.tokenStats.notFound > 0
						? detail.tokenStats.notFound.toLocaleString()
						: "—"}
				</Typography>
			),
		},
		{
			label: t("admin.tokenization.detail.ambiguous"),
			value: (
				<Typography
					tag="span"
					className={
						detail.tokenStats.ambiguous > 0
							? "font-medium text-amb-t"
							: "text-t-4"
					}
				>
					{detail.tokenStats.ambiguous > 0
						? detail.tokenStats.ambiguous.toLocaleString()
						: "—"}
				</Typography>
			),
		},
		{
			label: t("admin.tokenization.detail.processedAt"),
			value: detail.version?.processedAt ? (
				<Typography tag="span" className="text-[11.5px] text-t-3">
					{new Date(detail.version.processedAt).toLocaleDateString()}
				</Typography>
			) : (
				<Typography tag="span" className="text-t-4">
					—
				</Typography>
			),
		},
	];

	return (
		<div className="mb-4 grid grid-cols-2 gap-2">
			{cells.map(({ label, value }) => (
				<div key={label} className="rounded-[8px] bg-surf-2 px-3 py-2">
					<div className="mb-1 text-[10.5px] text-t-3">{label}</div>
					<div className="text-[13px]">{value}</div>
				</div>
			))}
		</div>
	);
};

const TokensTable = ({
	tokens,
	t,
}: {
	tokens: TokensData | undefined;
	t: ReturnType<typeof useI18n>["t"];
}) => {
	if (!tokens || tokens.data.length === 0) {
		return (
			<div className="rounded-[8px] border border-bd-1 py-6 text-center text-[12px] text-t-3">
				{t("admin.tokenization.detail.noTokens")}
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-[8px] border border-bd-1">
			<Table className="w-full border-collapse text-[12px]" aria-label={t("admin.tokenization.detail.tokensTitle")}>
				<TableHeader>
					<TableRow className="border-b border-bd-1 bg-surf-2">
						<TableHead className="px-2.5 py-[7px] text-left text-[10px] font-semibold uppercase tracking-[0.4px] text-t-3">
							{t("admin.tokenization.detail.colOriginal")}
						</TableHead>
						<TableHead className="px-2.5 py-[7px] text-left text-[10px] font-semibold uppercase tracking-[0.4px] text-t-3 max-sm:hidden">
							{t("admin.tokenization.detail.colNormalized")}
						</TableHead>
						<TableHead className="px-2.5 py-[7px] text-left text-[10px] font-semibold uppercase tracking-[0.4px] text-t-3">
							{t("admin.tokenization.detail.colSource")}
						</TableHead>
						<TableHead className="px-2.5 py-[7px] text-left text-[10px] font-semibold uppercase tracking-[0.4px] text-t-3 max-sm:hidden">
							{t("admin.tokenization.detail.colPage")}
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tokens.data.map(token => (
						<TableRow
							key={token.id}
							className="border-b border-bd-1 last:border-b-0 hover:bg-surf-2"
						>
							<TableCell className="px-2.5 py-2">
								<Typography
									tag="span"
									className={`inline-flex items-center rounded-[4px] px-1.5 py-0.5 font-mono text-[11.5px] font-semibold ${TOKEN_STATUS_STYLES[token.status]}`}
								>
									{token.original}
								</Typography>
							</TableCell>
							<TableCell className="px-2.5 py-2 font-mono text-[11px] text-t-3 max-sm:hidden">
								{token.normalized}
							</TableCell>
							<TableCell className="px-2.5 py-2">
								<Typography
									tag="span"
									className={`inline-flex items-center rounded-[4px] px-1.5 py-0.5 text-[10px] font-semibold ${SOURCE_STYLES[token.source]}`}
								>
									{token.source}
								</Typography>
							</TableCell>
							<TableCell className="px-2.5 py-2 text-[11px] text-t-3 tabular-nums max-sm:hidden">
								{token.pageNumber}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

// ── Main component ─────────────────────────────────────────────────────────────

export const TokenizationTextDetailModal = ({
	textId,
	onClose,
	mutations,
}: TokenizationTextDetailModalProps) => {
	const { t } = useI18n();

	const { data: detail } = useQuery({
		queryKey: tokenizationKeys.detail(textId ?? ""),
		queryFn: () => tokenizationApi.textDetail(textId!),
		enabled: !!textId,
	});

	const { data: tokens } = useQuery({
		queryKey: tokenizationKeys.tokens(textId ?? "", { limit: 50 }),
		queryFn: () => tokenizationApi.textTokens(textId!, { limit: 50 }),
		enabled: !!textId,
	});

	if (!textId) return null;

	const statusLabels: Record<ProcessingStatus, string> = {
		IDLE: t("admin.tokenization.status.IDLE"),
		RUNNING: t("admin.tokenization.status.RUNNING"),
		COMPLETED: t("admin.tokenization.status.COMPLETED"),
		ERROR: t("admin.tokenization.status.ERROR"),
	};

	const handleRunClick: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		textId && mutations.runText.mutate(textId);
	const handleResetClick: NonNullable<
		ComponentProps<"button">["onClick"]
	> = () => textId && mutations.resetText.mutate(textId);

	return (
		<Modal
			open={!!textId}
			onClose={onClose}
			className="p-0 max-w-[580px] max-sm:max-w-full flex flex-col max-h-[90vh] max-sm:max-h-[92vh] overflow-hidden"
		>
			{/* Header */}
			<div className="flex shrink-0 items-center justify-between border-b border-bd-1 px-4 py-3.5">
				<Typography tag="span" className="font-display text-[15px] text-t-1">
					{t("admin.tokenization.detail.title")}
				</Typography>
				<Button
					size={"bare"}
					onClick={onClose}
					title={t("admin.tokenization.detail.closeBtn")}
					className="flex size-[26px] items-center justify-center rounded-[6px] bg-surf-2 text-t-2 hover:bg-surf-3"
				>
					<X className="size-3" />
				</Button>
			</div>

			{/* Body */}
			<div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-0">
				{!detail ? (
					<div className="space-y-3">
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className="h-10 animate-pulse rounded-[8px] bg-surf-3"
							/>
						))}
					</div>
				) : (
					<>
						<TokenMetaGrid
							detail={detail}
							statusLabels={statusLabels}
							t={t}
						/>

						<div className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
							{t("admin.tokenization.detail.tokensTitle")}
						</div>
						<TokensTable tokens={tokens} t={t} />
					</>
				)}
			</div>

			{/* Footer actions */}
			<div className="flex shrink-0 gap-2 border-t border-bd-1 px-4 py-3.5">
				<Button
					variant="action"
					onClick={handleRunClick}
					disabled={
						mutations.runText.isPending ||
						detail?.processingStatus === "RUNNING"
					}
					title={t("admin.tokenization.detail.runBtn")}
					className="h-[34px] px-4 rounded-lg text-[13px] flex items-center gap-1.5"
				>
					<Play className="size-[11px]" />
					{t("admin.tokenization.detail.runBtn")}
				</Button>
				<Button
					variant="ghost"
					onClick={handleResetClick}
					disabled={mutations.resetText.isPending}
					title={t("admin.tokenization.detail.resetBtn")}
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.tokenization.detail.resetBtn")}
				</Button>
				<Button
					variant="bare"
					onClick={onClose}
					title={t("admin.tokenization.detail.closeBtn")}
					className="ml-auto h-[34px] px-3 rounded-lg text-[12px] text-t-3 transition-colors hover:text-t-1"
				>
					{t("admin.tokenization.detail.closeBtn")}
				</Button>
			</div>
		</Modal>
	);
};
