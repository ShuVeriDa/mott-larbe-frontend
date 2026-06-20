"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
	countriesQueryOptions,
	regionsByCountryQueryOptions,
	districtsByRegionQueryOptions,
	settlementsByDistrictQueryOptions,
	type SettlementType,
} from "@/entities/geo";
import { myHeritageQueryOptions, type UserHeritage } from "@/entities/heritage";
import { LocationForm } from "@/features/location-form";
import { useI18n } from "@/shared/lib/i18n";
import { spring, variants } from "@/shared/lib/animation";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Typography } from "@/shared/ui/typography";
import { ProfileCard } from "../profile-card";

const SETTLEMENT_TYPE_KEYS: Record<SettlementType, string> = {
	city: "location.type_city",
	village: "location.type_village",
	town: "location.type_town",
};

interface LocationRowProps {
	label: string;
	value: string | null | undefined;
	children?: React.ReactNode;
}

const LocationRow = ({ label, value, children }: LocationRowProps) => (
	<div className="flex items-start gap-2 py-1.5 border-b border-bd-1/50 last:border-0">
		<Typography tag="p" className="min-w-[90px] shrink-0 text-[12px] text-t-3">
			{label}
		</Typography>
		<div className="flex flex-1 items-center gap-1.5 flex-wrap">
			{value ? (
				<Typography tag="p" className="text-[12.5px] text-t-1">
					{value}
				</Typography>
			) : (
				<Typography tag="p" className="text-[12.5px] text-t-3 italic">
					—
				</Typography>
			)}
			{children}
		</div>
	</div>
);

interface LocationViewProps {
	heritage: UserHeritage;
	lang: string;
}

const LocationView = ({ heritage, lang }: LocationViewProps) => {
	const { t } = useI18n();
	const langKey = lang as "che" | "ru" | "en";

	const { data: countriesData } = useQuery({
		...countriesQueryOptions(),
		enabled: !!heritage.countryId,
	});

	const { data: regionsData } = useQuery({
		...regionsByCountryQueryOptions(heritage.countryId ?? ""),
		enabled: !!heritage.countryId,
	});

	const { data: districtsData } = useQuery({
		...districtsByRegionQueryOptions(heritage.regionId ?? ""),
		enabled: !!heritage.regionId,
	});

	const { data: settlementsData } = useQuery({
		...settlementsByDistrictQueryOptions(heritage.districtId ?? ""),
		enabled: !!heritage.districtId,
	});

	const country = countriesData?.items.find((c) => c.id === heritage.countryId);
	const region = regionsData?.items.find((r) => r.id === heritage.regionId);
	const district = districtsData?.items.find((d) => d.id === heritage.districtId);
	const settlement = settlementsData?.items.find((s) => s.id === heritage.settlementId);

	const countryName = country?.name?.[langKey] ?? country?.name?.ru ?? null;
	const regionName = region?.name?.[langKey] ?? region?.name?.ru ?? null;
	const districtName = district?.name?.[langKey] ?? district?.name?.ru ?? null;
	const settlementName = settlement?.name?.[langKey] ?? settlement?.name?.ru ?? null;
	const settlementType = settlement?.type ?? null;

	return (
		<div className="flex flex-col">
			<LocationRow label={t("location.country")} value={countryName} />
			<LocationRow label={t("location.region")} value={regionName} />
			<LocationRow label={t("location.district")} value={districtName} />
			<LocationRow label={t("location.settlement")} value={settlementName}>
				{settlementType && (
					<Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
						{t(SETTLEMENT_TYPE_KEYS[settlementType])}
					</Badge>
				)}
			</LocationRow>
			{heritage.ancestralVillage && (
				<LocationRow label={t("location.ancestral_village")} value={heritage.ancestralVillage} />
			)}
		</div>
	);
};

const LocationSkeleton = () => (
	<div className="px-4 py-3 space-y-3">
		{[75, 60, 85].map((width, i) => (
			<div
				key={i}
				className="h-3.5 rounded-md bg-bd-1 animate-pulse"
				style={{ width: `${width}%` }}
			/>
		))}
	</div>
);

interface LocationCardProps {
	lang: string;
}

export const LocationCard = ({ lang }: LocationCardProps) => {
	const { t } = useI18n();
	const [isEditing, setIsEditing] = useState(false);
	const { data: heritage, isPending } = useQuery(myHeritageQueryOptions());

	const handleEditOpen = () => setIsEditing(true);
	const handleEditClose = () => setIsEditing(false);

	const hasLocation = !!(
		heritage?.countryId ||
		heritage?.regionId ||
		heritage?.districtId ||
		heritage?.settlementId ||
		heritage?.ancestralVillage
	);

	const headExtra = isEditing ? (
		<Button
			type="button"
			variant="ghost"
			onClick={handleEditClose}
			aria-label={t("profile.common.cancel")}
			className="h-7 w-7 p-0 rounded-md text-t-3 hover:text-t-1 transition-colors duration-150 ease-out"
		>
			<X className="h-3.5 w-3.5" aria-hidden />
		</Button>
	) : (
		<Button
			type="button"
			variant="ghost"
			onClick={handleEditOpen}
			aria-label={t("profile.common.edit")}
			className="h-7 w-7 p-0 rounded-md text-t-3 hover:text-t-1 transition-colors duration-150 ease-out"
		>
			<Pencil className="h-3.5 w-3.5" aria-hidden />
		</Button>
	);

	return (
		<ProfileCard
			title={t("location.title")}
			headExtra={headExtra}
			bodyClassName="gap-0 px-0 py-0"
		>
			<AnimatePresence mode="wait" initial={false}>
				{isEditing ? (
					<motion.div
						key="edit"
						variants={variants.fadeUp}
						initial="hidden"
						animate="visible"
						exit="exit"
						transition={spring.default}
						className="px-4 py-3.5"
					>
						<LocationForm lang={lang} />
					</motion.div>
				) : (
					<motion.div
						key="view"
						variants={variants.fadeIn}
						initial="hidden"
						animate="visible"
						exit="exit"
						transition={spring.default}
					>
						{isPending ? (
							<LocationSkeleton />
						) : hasLocation && heritage ? (
							<div className="px-4 py-2">
								<LocationView heritage={heritage} lang={lang} />
							</div>
						) : (
							<div className="px-4 py-5 text-center">
								<Typography tag="p" className="text-[12.5px] text-t-3 mb-3">
									{t("location.empty")}
								</Typography>
								<Button
									type="button"
									variant="action"
									onClick={handleEditOpen}
									className="h-8 text-[12px] px-3 rounded-base"
								>
									{t("profile.common.fill")}
								</Button>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</ProfileCard>
	);
};
