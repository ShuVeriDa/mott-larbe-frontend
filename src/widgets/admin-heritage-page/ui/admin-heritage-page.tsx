"use client";

import { useI18n } from "@/shared/lib/i18n";
import { AdminTabStrip } from "@/shared/ui/admin-tab-strip";
import { Typography } from "@/shared/ui/typography";
import { useAdminHeritagePage } from "../model/use-admin-heritage-page";
import type { HeritageTab } from "../model/types";
import { NationsTab } from "./nations-tab";
import { TukhumyTab } from "./tukhumy-tab";
import { TaipsTab } from "./taips-tab";
import { GarasTab } from "./garas-tab";

export const AdminHeritagePage = () => {
	const { t } = useI18n();
	const state = useAdminHeritagePage();

	const tabs: { key: HeritageTab; label: string }[] = [
		{ key: "nations", label: t("admin.heritage.tabs.nations") },
		{ key: "tukhumy", label: t("admin.heritage.tabs.tukhumy") },
		{ key: "taips", label: t("admin.heritage.tabs.taips") },
		{ key: "garas", label: t("admin.heritage.tabs.garas") },
	];

	const handleOpenNationCreate = () => state.setNationModal({ open: true, item: null });
	const handleOpenNationEdit = (item: Parameters<typeof state.setNationModal>[0]["item"]) =>
		state.setNationModal({ open: true, item });
	const handleCloseNation = () => state.setNationModal({ open: false, item: null });

	const handleOpenTukhumCreate = () => state.setTukhumModal({ open: true, item: null });
	const handleOpenTukhumEdit = (item: Parameters<typeof state.setTukhumModal>[0]["item"]) =>
		state.setTukhumModal({ open: true, item });
	const handleCloseTukhum = () => state.setTukhumModal({ open: false, item: null });

	const handleOpenTaipCreate = () => state.setTaipModal({ open: true, item: null });
	const handleOpenTaipEdit = (item: Parameters<typeof state.setTaipModal>[0]["item"]) =>
		state.setTaipModal({ open: true, item });
	const handleCloseTaip = () => state.setTaipModal({ open: false, item: null });

	const handleOpenGaraCreate = () => state.setGaraModal({ open: true, item: null });
	const handleOpenGaraEdit = (item: Parameters<typeof state.setGaraModal>[0]["item"]) =>
		state.setGaraModal({ open: true, item });
	const handleCloseGara = () => state.setGaraModal({ open: false, item: null });

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="flex items-center justify-between border-b border-bd-1 px-5 py-3.5">
				<div>
					<Typography tag="h1" className="text-[15px] font-semibold text-t-1">
						{t("admin.heritage.title")}
					</Typography>
					<Typography tag="p" className="text-[12px] text-t-3">
						{t("admin.heritage.subtitle")}
					</Typography>
				</div>
			</div>

			<AdminTabStrip
				tabs={tabs}
				activeTab={state.activeTab}
				onTabChange={state.setActiveTab}
			/>

			<div className="min-h-0 flex-1 overflow-y-auto">
				{state.activeTab === "nations" && (
					<NationsTab
						nations={state.nations}
						query={state.nationsQuery}
						modal={state.nationModal}
						onOpenCreate={handleOpenNationCreate}
						onOpenEdit={handleOpenNationEdit}
						onCloseModal={handleCloseNation}
						createMutation={state.createNationMutation}
						updateMutation={state.updateNationMutation as unknown as Parameters<typeof NationsTab>[0]["updateMutation"]}
						deleteMutation={state.deleteNationMutation}
					/>
				)}
				{state.activeTab === "tukhumy" && (
					<TukhumyTab
						tukhumy={state.tukhumy}
						nations={state.nations}
						selectedNationId={state.selectedNationId}
						query={state.tukhumQuery}
						modal={state.tukhumModal}
						onSelectNation={state.setSelectedNationId}
						onOpenCreate={handleOpenTukhumCreate}
						onOpenEdit={handleOpenTukhumEdit}
						onCloseModal={handleCloseTukhum}
						createMutation={state.createTukhumMutation}
						updateMutation={state.updateTukhumMutation as unknown as Parameters<typeof TukhumyTab>[0]["updateMutation"]}
						deleteMutation={state.deleteTukhumMutation}
					/>
				)}
				{state.activeTab === "taips" && (
					<TaipsTab
						taips={state.taips}
						nations={state.nations}
						tukhumy={state.tukhumy}
						selectedNationId={state.selectedNationId}
						query={state.taipsQuery}
						modal={state.taipModal}
						onSelectNation={state.setSelectedNationId}
						onOpenCreate={handleOpenTaipCreate}
						onOpenEdit={handleOpenTaipEdit}
						onCloseModal={handleCloseTaip}
						createMutation={state.createTaipMutation}
						updateMutation={state.updateTaipMutation as unknown as Parameters<typeof TaipsTab>[0]["updateMutation"]}
						deleteMutation={state.deleteTaipMutation}
					/>
				)}
				{state.activeTab === "garas" && (
					<GarasTab
						garas={state.garas}
						nations={state.nations}
						taips={state.taips}
						selectedNationId={state.selectedNationId}
						selectedTaipId={state.selectedTaipId}
						query={state.garasQuery}
						modal={state.garaModal}
						onSelectNation={state.setSelectedNationId}
						onSelectTaip={state.setSelectedTaipId}
						onOpenCreate={handleOpenGaraCreate}
						onOpenEdit={handleOpenGaraEdit}
						onCloseModal={handleCloseGara}
						createMutation={state.createGaraMutation}
						updateMutation={state.updateGaraMutation as unknown as Parameters<typeof GarasTab>[0]["updateMutation"]}
						deleteMutation={state.deleteGaraMutation}
					/>
				)}
			</div>
		</div>
	);
};
