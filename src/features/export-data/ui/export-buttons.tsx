"use client";

import {
	useExportArchive,
	useExportProgress,
	useExportVocabulary,
} from "@/entities/settings";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { ExportRow } from "./export-row";

export const ExportButtons = () => {
	const { t } = useI18n();
	const { success, error } = useToast();
	const exportVocab = useExportVocabulary();
	const exportProgress = useExportProgress();
	const exportArchive = useExportArchive();

	const handleVocab = async (format: "csv" | "json") => {
		try {
			await exportVocab.mutateAsync(format);
			success(`${t("settings.toasts.exportStarted")} · ${format.toUpperCase()}`);
		} catch {
			error(t("settings.toasts.exportFailed"));
		}
	};

	const handleProgress = async () => {
		try {
			await exportProgress.mutateAsync();
			success(t("settings.toasts.exportStarted"));
		} catch {
			error(t("settings.toasts.exportFailed"));
		}
	};

	const handleArchive = async () => {
		try {
			await exportArchive.mutateAsync();
			success(t("settings.toasts.archiveQueued"));
		} catch {
			error(t("settings.toasts.exportFailed"));
		}
	};

		const handleClick: NonNullable<React.ComponentProps<typeof Button>["onClick"]> = () => handleVocab("csv");
	const handleClick2: NonNullable<React.ComponentProps<typeof Button>["onClick"]> = () => handleVocab("json");
return (
		<>
			<ExportRow
				label={t("settings.data.exportVocab")}
				description={t("settings.data.exportVocabDesc")}
				actions={
					<>
						<Button
							variant="outline"
							onClick={handleClick}
							disabled={exportVocab.isPending}
						>
							{t("settings.data.csv")}
						</Button>
						<Button
							variant="outline"
							onClick={handleClick2}
							disabled={exportVocab.isPending}
						>
							{t("settings.data.json")}
						</Button>
					</>
				}
			/>
			<ExportRow
				label={t("settings.data.exportProgress")}
				description={t("settings.data.exportProgressDesc")}
				actions={
					<Button
						variant="outline"
						onClick={handleProgress}
						disabled={exportProgress.isPending}
					>
						{t("settings.data.downloadJson")}
					</Button>
				}
			/>
			<ExportRow
				label={t("settings.data.exportArchive")}
				description={t("settings.data.exportArchiveDesc")}
				actions={
					<Button
						variant="outline"
						onClick={handleArchive}
						disabled={exportArchive.isPending}
					>
						{t("settings.data.requestArchive")}
					</Button>
				}
			/>
		</>
	);
};
