"use client";

import { useI18n } from "@/shared/lib/i18n";
import { AdminTabStrip } from "@/shared/ui/admin-tab-strip";
import { Typography } from "@/shared/ui/typography";
import { useAdminGeoPage } from "../model/use-admin-geo-page";
import type { GeoTab } from "../model/types";
import type { District, Region, Settlement } from "@/entities/geo";
import { RegionsTab } from "./regions-tab";
import { DistrictsTab } from "./districts-tab";
import { SettlementsTab } from "./settlements-tab";

export const AdminGeoPage = () => {
	const { t } = useI18n();
	const state = useAdminGeoPage();

	const tabs: { key: GeoTab; label: string }[] = [
		{ key: "regions", label: t("admin.geo.tabs.regions") },
		{ key: "districts", label: t("admin.geo.tabs.districts") },
		{ key: "settlements", label: t("admin.geo.tabs.settlements") },
	];

	const handleOpenRegionCreate = () => state.setRegionModal({ open: true, item: null });
	const handleOpenRegionEdit = (item: Region) =>
		state.setRegionModal({ open: true, item });
	const handleCloseRegion = () => state.setRegionModal({ open: false, item: null });

	const handleOpenDistrictCreate = () => state.setDistrictModal({ open: true, item: null });
	const handleOpenDistrictEdit = (item: District) =>
		state.setDistrictModal({ open: true, item });
	const handleCloseDistrict = () => state.setDistrictModal({ open: false, item: null });

	const handleOpenSettlementCreate = () => state.setSettlementModal({ open: true, item: null });
	const handleOpenSettlementEdit = (item: Settlement) =>
		state.setSettlementModal({ open: true, item });
	const handleCloseSettlement = () => state.setSettlementModal({ open: false, item: null });

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="flex items-center justify-between border-b border-bd-1 px-5 py-3.5">
				<div>
					<Typography tag="h1" className="text-[15px] font-semibold text-t-1">
						{t("admin.geo.title")}
					</Typography>
					<Typography tag="p" className="text-[12px] text-t-3">
						{t("admin.geo.subtitle")}
					</Typography>
				</div>
			</div>

			<AdminTabStrip
				tabs={tabs}
				activeTab={state.activeTab}
				onTabChange={state.setActiveTab}
			/>

			<div className="min-h-0 flex-1 overflow-y-auto">
				{state.activeTab === "regions" && (
					<RegionsTab
						regions={state.regions}
						countries={state.countries}
						selectedCountryId={state.selectedCountryId}
						query={state.regionsQuery}
						modal={state.regionModal}
						onSelectCountry={state.setSelectedCountryId}
						onOpenCreate={handleOpenRegionCreate}
						onOpenEdit={handleOpenRegionEdit}
						onCloseModal={handleCloseRegion}
						createMutation={state.createRegionMutation}
						updateMutation={state.updateRegionMutation as unknown as Parameters<typeof RegionsTab>[0]["updateMutation"]}
						deleteMutation={state.deleteRegionMutation}
					/>
				)}
				{state.activeTab === "districts" && (
					<DistrictsTab
						districts={state.districts}
						regions={state.regions}
						selectedRegionId={state.selectedRegionId}
						query={state.districtsQuery}
						modal={state.districtModal}
						onSelectRegion={state.setSelectedRegionId}
						onOpenCreate={handleOpenDistrictCreate}
						onOpenEdit={handleOpenDistrictEdit}
						onCloseModal={handleCloseDistrict}
						createMutation={state.createDistrictMutation}
						updateMutation={state.updateDistrictMutation as unknown as Parameters<typeof DistrictsTab>[0]["updateMutation"]}
						deleteMutation={state.deleteDistrictMutation}
					/>
				)}
				{state.activeTab === "settlements" && (
					<SettlementsTab
						settlements={state.settlements}
						regions={state.regions}
						districts={state.districts}
						selectedRegionId={state.selectedRegionId}
						selectedDistrictId={state.selectedDistrictId}
						query={state.settlementsQuery}
						modal={state.settlementModal}
						onSelectRegion={state.setSelectedRegionId}
						onSelectDistrict={state.setSelectedDistrictId}
						onOpenCreate={handleOpenSettlementCreate}
						onOpenEdit={handleOpenSettlementEdit}
						onCloseModal={handleCloseSettlement}
						createMutation={state.createSettlementMutation}
						updateMutation={state.updateSettlementMutation as unknown as Parameters<typeof SettlementsTab>[0]["updateMutation"]}
						deleteMutation={state.deleteSettlementMutation}
					/>
				)}
			</div>
		</div>
	);
};
