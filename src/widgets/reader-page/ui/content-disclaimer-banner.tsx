"use client";

import { X, Info } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";
import { useContentDisclaimer } from "../model/use-content-disclaimer";

export const ContentDisclaimerBanner = () => {
	const { t } = useI18n();
	const { showDisclaimer, dismiss } = useContentDisclaimer();

	if (!showDisclaimer) return null;

	return (
		<div
			role="note"
			aria-label={t("reader.disclaimer.ariaLabel")}
			className="flex items-start gap-3 border-b border-amb/20 bg-amb-bg px-4 py-3 md:items-center md:px-6"
		>
			<Info
				aria-hidden="true"
				className="mt-0.5 size-4 shrink-0 text-amb md:mt-0"
				strokeWidth={1.8}
			/>

			<p className="flex-1 text-[12.5px] leading-relaxed text-amb-t">
				<span className="font-semibold">
					{t("reader.disclaimer.title")}{" "}
				</span>
				{t("reader.disclaimer.body")}
			</p>

			<Button
				variant="bare"
				size="bare"
				aria-label={t("reader.disclaimer.close")}
				onClick={dismiss}
				className="mt-0.5 shrink-0 rounded p-1 text-amb/60 transition-colors hover:bg-amb/10 hover:text-amb md:mt-0"
			>
				<X className="size-3.5" strokeWidth={1.8} />
			</Button>
		</div>
	);
};
