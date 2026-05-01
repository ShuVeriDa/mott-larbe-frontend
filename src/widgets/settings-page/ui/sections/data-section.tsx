"use client";

import { useState } from "react";
import { ClearVocabModal } from "@/features/clear-vocabulary";
import { DeleteAccountModal } from "@/features/delete-account";
import { ExportButtons, ExportRow } from "@/features/export-data";
import { ResetProgressModal } from "@/features/reset-progress";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { SectionHeader } from "../section-header";
import { SettingCard } from "../setting-card";

export const DataSection = () => {
	const { t } = useI18n();
	const [resetOpen, setResetOpen] = useState(false);
	const [clearOpen, setClearOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

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
						<Button variant="danger" onClick={() => setResetOpen(true)}>
							{t("settings.data.resetButton")}
						</Button>
					}
				/>
				<ExportRow
					label={t("settings.data.clearVocab")}
					description={t("settings.data.clearVocabDesc")}
					actions={
						<Button variant="danger" onClick={() => setClearOpen(true)}>
							{t("settings.data.clearButton")}
						</Button>
					}
				/>
			</SettingCard>

			<section className="overflow-hidden rounded-[11px] border-hairline border-red/20 bg-surf">
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
						<Button variant="danger" onClick={() => setDeleteOpen(true)}>
							{t("settings.data.deleteButton")}
						</Button>
					}
				/>
			</section>

			<ResetProgressModal
				open={resetOpen}
				onClose={() => setResetOpen(false)}
			/>
			<ClearVocabModal open={clearOpen} onClose={() => setClearOpen(false)} />
			<DeleteAccountModal
				open={deleteOpen}
				onClose={() => setDeleteOpen(false)}
			/>
		</div>
	);
};
