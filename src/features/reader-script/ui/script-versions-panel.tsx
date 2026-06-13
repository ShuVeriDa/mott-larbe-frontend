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
import { MetaSection } from "@/shared/ui/admin-text-meta-fields";
import { Button } from "@/shared/ui/button";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Loader2, AlertCircle, Trash2 } from "lucide-react";

interface ScriptVersionsPanelProps {
	textId: string;
	isUserText?: boolean;
}

const SCRIPTS: { value: ChScript; labelKey: string }[] = [
	{ value: "LATIN", labelKey: "admin.texts.editPage.scriptVersions.latin" },
	{ value: "ARABIC", labelKey: "admin.texts.editPage.scriptVersions.arabic" },
];

const StatusIcon = ({ status }: { status: ScriptVersionStatus | null }) => {
	if (!status || status === "IDLE") return null;
	if (status === "COMPLETED")
		return <CheckCircle2 className="size-4 text-grn-t shrink-0" />;
	if (status === "RUNNING")
		return <Loader2 className="size-4 text-amb-t shrink-0 animate-spin" />;
	return <AlertCircle className="size-4 text-red shrink-0" />;
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
		<div className="flex items-center justify-between gap-3 py-2">
			<div className="flex items-center gap-2 min-w-0">
				<span className="text-[12px] font-medium text-t-1 w-16 shrink-0">
					{t(labelKey)}
				</span>
				<StatusIcon status={isGenerating ? "RUNNING" : status} />
			</div>
			<div className="flex items-center gap-1.5 shrink-0">
				<Button
					variant="outline"
					size={null}
					onClick={handleGenerate}
					disabled={isRunning}
					className="h-[26px] px-2.5 text-[11px]"
				>
					{t("admin.texts.editPage.scriptVersions.generate")}
				</Button>
				{hasVersion && (
					<Button
						variant="ghost"
						size={null}
						onClick={handleDelete}
						disabled={isRunning || isDeleting}
						className="h-[26px] w-[26px] p-0 text-t-3 hover:text-red hover:bg-red/5"
					>
						<Trash2 className="size-3.5" />
					</Button>
				)}
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
