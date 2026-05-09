"use client";

import { useState } from "react";
import { useResetProgress } from "@/entities/settings";
import { ClearVocabModal } from "@/features/clear-vocabulary";
import { DeleteAccountModal } from "@/features/delete-account";
import { ExportButtons, ExportRow } from "@/features/export-data";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { SectionHeader } from "../section-header";
import { SettingCard } from "../setting-card";

export const DataSection = () => {
	const { t } = useI18n();
	const { success, error } = useToast();
	const { mutateAsync: resetProgress, isPending: isResetting } =
		useResetProgress();
	const [clearOpen, setClearOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	const handleResetProgress = async () => {
		try {
			await resetProgress();
			success(t("settings.toasts.progressReset"));
		} catch {
			error(t("settings.toasts.genericError"));
		}
	};

		const handleClick: NonNullable<React.ComponentProps<typeof Button>["onClick"]> = () => setClearOpen(true);
	const handleClick2: NonNullable<React.ComponentProps<typeof Button>["onClick"]> = () => setDeleteOpen(true);
	const handleClose: NonNullable<React.ComponentProps<typeof ClearVocabModal>["onClose"]> = () => setClearOpen(false);
	const handleClose2: NonNullable<React.ComponentProps<typeof DeleteAccountModal>["onClose"]> = () => setDeleteOpen(false);
return (
		<div className="flex flex-col gap-3.5">
			<SectionHeader
				title={t("settings.data.title")}
				subtitle={t("settings.data.sub")}
			/>

			<SettingCard title={t("settings.data.export")} noBody>
				<ExportButtons />
			</SettingCard>

			<SettingCard title={t("settings.data.reset")} noBody>
				<ExportRow
					label={t("settings.data.resetProgress")}
					description={t("settings.data.resetProgressDesc")}
					actions={
						<Button
							variant="danger"
							onClick={handleResetProgress}
							disabled={isResetting}
						>
							{t("settings.data.resetButton")}
						</Button>
					}
				/>
				<ExportRow
					label={t("settings.data.clearVocab")}
					description={t("settings.data.clearVocabDesc")}
					actions={
						<Button variant="danger" onClick={handleClick}>
							{t("settings.data.clearButton")}
						</Button>
					}
				/>
			</SettingCard>

			<section className="overflow-hidden rounded-card border-hairline border-red/20 bg-surf">
				<header className="border-hairline border-b border-red/10 bg-red-bg px-4 pb-2.5 pt-3">
					<Typography
						tag="h3"
						className="text-[12.5px] font-semibold text-red-t"
					>
						{t("settings.data.dangerZone")}
					</Typography>
				</header>
				<ExportRow
					label={t("settings.data.deleteAccount")}
					description={t("settings.data.deleteAccountDesc")}
					actions={
						<Button variant="danger" onClick={handleClick2}>
							{t("settings.data.deleteButton")}
						</Button>
					}
				/>
			</section>

			<ClearVocabModal open={clearOpen} onClose={handleClose} />
			<DeleteAccountModal
				open={deleteOpen}
				onClose={handleClose2}
			/>
		</div>
	);
};
