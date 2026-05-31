"use client";

import { Typography } from "@/shared/ui/typography";
import { useSuggestTextPage } from "../model/use-suggest-text-page";
import { SuggestTextForm } from "./suggest-text-form";

export const SuggestTextPage = () => {
	const hook = useSuggestTextPage();
	const { t } = hook;

	return (
		<div className="flex h-full flex-col overflow-hidden">
			{/* Header */}
			<header className="flex shrink-0 items-center border-b border-bd-1 bg-surf px-[22px] py-3 transition-colors max-sm:px-4">
				<Typography tag="h1" className="text-[13.5px] font-semibold text-t-1">
					{t("suggestTextPage.title")}
				</Typography>
			</header>

			{/* Scrollable body */}
			<div className="flex-1 overflow-y-auto">
				<div className="mx-auto max-w-xl px-4 py-6">
					<div className="rounded-xl border border-bd-1 bg-surf px-5 py-5 max-sm:px-4">
						<Typography tag="h2" className="font-display text-[18px] font-semibold text-t-1 mb-1">
							{t("suggestTextPage.title")}
						</Typography>
						<Typography tag="p" className="mb-5 text-[13px] text-t-3 leading-relaxed">
							{t("suggestTextPage.description")}
						</Typography>

						<SuggestTextForm hook={hook} />
					</div>
				</div>
			</div>
		</div>
	);
};
