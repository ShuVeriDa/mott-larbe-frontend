"use client";

import {
	scriptVersionsQueryOptions,
	userScriptVersionsQueryOptions,
	useGenerateScriptVersion,
	useGenerateUserScriptVersion,
	useDeleteScriptVersion,
	useDeleteUserScriptVersion,
	type ChScript,
	type ScriptVersionStatus,
	type TextScriptVersionInfo,
} from "@/entities/text-script-version";
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { MetaSection } from "@/shared/ui/admin-text-meta-fields";
import { Button } from "@/shared/ui/button";
import { useQuery } from "@tanstack/react-query";

interface ScriptVersionsPanelProps {
	textId: string;
	isUserText?: boolean;
}

const SCRIPTS: { value: ChScript; labelKey: string }[] = [
	{ value: "LATIN", labelKey: "admin.texts.editPage.scriptVersions.latin" },
	{ value: "ARABIC", labelKey: "admin.texts.editPage.scriptVersions.arabic" },
];

const STATUS_BADGE_CLASS: Record<ScriptVersionStatus, string> = {
	IDLE: "bg-surf-3 text-t-3",
	RUNNING: "bg-amb-bg text-amb-t",
	COMPLETED: "bg-grn-bg text-grn-t",
	ERROR: "bg-red-bg text-red-t",
};

const StatusBadge = ({ status }: { status: ScriptVersionStatus | null }) => {
	const { t } = useI18n();
	const resolved = status ?? "IDLE";
	const labelKey =
		resolved === "IDLE" ? "admin.texts.editPage.scriptVersions.statusNone" :
		resolved === "RUNNING" ? "admin.texts.editPage.scriptVersions.statusRunning" :
		resolved === "COMPLETED" ? "admin.texts.editPage.scriptVersions.statusDone" :
		"admin.texts.editPage.scriptVersions.statusError";

	return (
		<span
			className={cn(
				"inline-flex items-center rounded-[4px] px-1.5 py-0.5 text-[10.5px] font-medium",
				STATUS_BADGE_CLASS[resolved],
			)}
		>
			{t(labelKey)}
		</span>
	);
};

const ScriptRow = ({
	script,
	labelKey,
	version,
	onGenerate,
	onDelete,
	isGenerating,
	isDeleting,
}: {
	script: ChScript;
	labelKey: string;
	version: TextScriptVersionInfo | undefined;
	onGenerate: (s: ChScript) => void;
	onDelete: (s: ChScript) => void;
	isGenerating: boolean;
	isDeleting: boolean;
}) => {
	const { t } = useI18n();
	const status = version?.status ?? null;
	const isRunning = status === "RUNNING" || isGenerating;
	const hasVersion = status !== null;

	const handleGenerate = () => onGenerate(script);
	const handleDelete = () => {
		if (window.confirm(t("admin.texts.editPage.scriptVersions.deleteConfirm"))) {
			onDelete(script);
		}
	};

	return (
		<div className="flex items-center justify-between gap-2 py-1.5">
			<div className="flex items-center gap-2 min-w-0">
				<span className="text-[12px] font-medium text-t-1 shrink-0">
					{t(labelKey)}
				</span>
				<StatusBadge status={status} />
			</div>
			<div className="flex items-center gap-1 shrink-0">
				{hasVersion && (
					<Button
						variant="ghost"
						size={null}
						onClick={handleDelete}
						disabled={isRunning || isDeleting}
						className="h-[26px] px-2 text-[11px] text-red hover:bg-red-muted"
					>
						{t("admin.texts.editPage.scriptVersions.delete")}
					</Button>
				)}
				<Button
					variant="ghost"
					size={null}
					onClick={handleGenerate}
					disabled={isRunning}
					className="h-[26px] px-2 text-[11px]"
				>
					{isRunning
						? t("admin.texts.editPage.scriptVersions.generating")
						: t("admin.texts.editPage.scriptVersions.generate")}
				</Button>
			</div>
		</div>
	);
};

export const ScriptVersionsPanel = ({ textId, isUserText = false }: ScriptVersionsPanelProps) => {
	const { t } = useI18n();

	const adminQuery = useQuery({
		...scriptVersionsQueryOptions(textId),
		enabled: !isUserText,
		refetchInterval: (query) => {
			const data = (query.state.data ?? []) as TextScriptVersionInfo[];
			return data.some((v) => v.status === "RUNNING") ? 3000 : false;
		},
	});

	const userQuery = useQuery({
		...userScriptVersionsQueryOptions(textId),
		enabled: isUserText,
		refetchInterval: (query) => {
			const data = (query.state.data ?? []) as TextScriptVersionInfo[];
			return data.some((v) => v.status === "RUNNING") ? 3000 : false;
		},
	});

	const versions = (isUserText ? userQuery.data : adminQuery.data) ?? [];

	const generateAdmin = useGenerateScriptVersion(textId);
	const deleteAdmin = useDeleteScriptVersion(textId);
	const generateUser = useGenerateUserScriptVersion(textId);
	const deleteUser = useDeleteUserScriptVersion(textId);

	const generate = isUserText ? generateUser : generateAdmin;
	const remove = isUserText ? deleteUser : deleteAdmin;

	const handleGenerate = (script: ChScript) => generate.mutate(script);
	const handleDelete = (script: ChScript) => remove.mutate(script);

	return (
		<MetaSection title={t("admin.texts.editPage.sections.scriptVersions")}>
			<div className="flex flex-col divide-y divide-bd-1">
				{SCRIPTS.map((s) => {
					const version = versions.find((v) => v.script === s.value);
					return (
						<ScriptRow
							key={s.value}
							script={s.value}
							labelKey={s.labelKey}
							version={version}
							onGenerate={handleGenerate}
							onDelete={handleDelete}
							isGenerating={generate.isPending && generate.variables === s.value}
							isDeleting={remove.isPending && remove.variables === s.value}
						/>
					);
				})}
			</div>
		</MetaSection>
	);
};
