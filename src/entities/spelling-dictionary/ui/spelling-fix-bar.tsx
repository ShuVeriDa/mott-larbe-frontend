"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/shared/ui/tooltip";
import { useI18n } from "@/shared/lib/i18n";
import { variants, spring } from "@/shared/lib/animation";

interface SpellingFixBarProps {
	selectedCount: number;
	canBulkFix: boolean;
	onFixSelected: () => void;
	disabledReason?: string;
}

export const SpellingFixBar = ({ selectedCount, canBulkFix, onFixSelected, disabledReason }: SpellingFixBarProps) => {
	const { t } = useI18n();

	const button = (
		<Button
			onClick={onFixSelected}
			disabled={!canBulkFix || selectedCount === 0}
			className="h-8 px-3.5 text-[12.5px]"
		>
			{t("admin.spellingDictionaryDetail.fixSelected", { count: selectedCount })}
		</Button>
	);

	return (
		<AnimatePresence>
			{selectedCount > 0 && (
				<motion.div
					variants={variants.fadeUp}
					initial="hidden"
					animate="visible"
					exit="exit"
					transition={spring.default}
					className="flex items-center justify-between gap-3 border-b border-bd-1 bg-acc-bg px-4 py-2.5"
				>
					<Typography tag="span" className="text-[12.5px] font-medium text-acc-t">
						{t("admin.spellingDictionaryDetail.selectedCount", { count: selectedCount })}
					</Typography>
					{canBulkFix ? (
						button
					) : (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<span>{button}</span>
								</TooltipTrigger>
								<TooltipContent>
									{disabledReason ?? t("admin.spellingDictionaryDetail.canBulkFixDisabledTooltip")}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
};
