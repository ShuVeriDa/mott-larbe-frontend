"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { myHeritageQueryOptions, type UserHeritage } from "@/entities/heritage";
import { HeritageForm, VerificationBadge } from "@/features/heritage-form";
import { useI18n } from "@/shared/lib/i18n";
import { getLocalizedName } from "@/shared/lib/localized-name";
import type { LocalizedName } from "@/shared/types";
import { spring, variants } from "@/shared/lib/animation";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { ProfileCard } from "../profile-card";

interface HeritageRowProps {
	label: string;
	value: string | null | undefined;
	children?: React.ReactNode;
}

const HeritageRow = ({ label, value, children }: HeritageRowProps) => (
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

interface HeritageViewProps {
	heritage: UserHeritage;
	lang: string;
}

const HeritageView = ({ heritage, lang }: HeritageViewProps) => {
	const { t } = useI18n();

	const localize = (name: LocalizedName | null | undefined) =>
		name ? getLocalizedName(name, lang) : null;

	const nationName = localize(heritage.nation?.name);
	const tukhumName = localize(heritage.tukhum?.name);
	const taipName = heritage.taip ? localize(heritage.taip.name) : (heritage.taipCustom ?? null);
	const garaName = heritage.gara ? localize(heritage.gara.name) : (heritage.garaCustom ?? null);

	const isNakhchiy = heritage.nation?.slug === "nakhchiy";

	return (
		<div className="flex flex-col">
			<HeritageRow label={t("heritage.nation")} value={nationName} />
			{isNakhchiy && (
				<>
					<HeritageRow label={t("heritage.tukhum")} value={tukhumName} />
					<HeritageRow label={t("heritage.taip")} value={taipName}>
						{heritage.taipStatus && (
							<VerificationBadge status={heritage.taipStatus} />
						)}
					</HeritageRow>
					<HeritageRow label={t("heritage.gara")} value={garaName}>
						{heritage.garaStatus && (
							<VerificationBadge status={heritage.garaStatus} />
						)}
					</HeritageRow>
					<HeritageRow label={t("heritage.nekyi")} value={heritage.nekyi} />
				</>
			)}
		</div>
	);
};

const HeritageSkeleton = () => (
	<div className="px-4 py-3 space-y-3">
		{[90, 70, 80, 60, 75].map((width, i) => (
			<div
				key={i}
				className="h-3.5 rounded-md bg-bd-1 animate-pulse"
				style={{ width: `${width}%` }}
			/>
		))}
	</div>
);

interface HeritageCardProps {
	lang: string;
}

export const HeritageCard = ({ lang }: HeritageCardProps) => {
	const { t } = useI18n();
	const [isEditing, setIsEditing] = useState(false);
	const { data: heritage, isPending } = useQuery(myHeritageQueryOptions());

	const handleEditOpen = () => setIsEditing(true);
	const handleEditClose = () => setIsEditing(false);

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
			title={t("heritage.title")}
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
						<HeritageForm lang={lang} />
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
							<HeritageSkeleton />
						) : heritage ? (
							<div className="px-4 py-2">
								<HeritageView heritage={heritage} lang={lang} />
							</div>
						) : (
							<div className="px-4 py-5 text-center">
								<Typography tag="p" className="text-[12.5px] text-t-3 mb-3">
									{t("heritage.empty")}
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
