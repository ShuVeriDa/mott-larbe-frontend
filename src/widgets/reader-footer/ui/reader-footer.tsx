"use client";

import { Typography } from "@/shared/ui/typography";
import { FontSizeGroup } from "@/features/reader-font-size";
import { useI18n } from "@/shared/lib/i18n";
import { ScriptSwitcherFooter } from "./script-switcher-footer";

const LEGEND = [
	{ key: "KNOWN", color: "var(--grn)" },
	{ key: "LEARNING", color: "var(--amb)" },
	{ key: "NEW", color: "var(--t-4)" },
] as const;

export interface ReaderFooterProps {
	textId?: string;
}

export const ReaderFooter = ({ textId }: ReaderFooterProps) => {
	const { t } = useI18n();

	return (
		<footer className="flex shrink-0 items-center gap-2.5 border-t-[0.5px] border-bd-1 bg-surf px-4 py-2.5 max-md:hidden">
			<Typography tag="span" className="text-[11px] text-t-3 shrink-0">
				{t("reader.footer.size")}:
			</Typography>
			<FontSizeGroup />

			{textId && (
				<>
					<Typography tag="span" aria-hidden="true" className="h-4 w-px bg-bd-2 shrink-0" />
					<ScriptSwitcherFooter textId={textId} />
				</>
			)}

			<div className="ml-auto flex items-center gap-2.5">
				{LEGEND.map(item => (
					<Typography
						tag="span"
						key={item.key}
						className="flex items-center gap-1.5 text-[11px] text-t-3"
					>
						<Typography
							tag="span"
							aria-hidden="true"
							className="block h-0.5 w-3.5 rounded-[1px]"
							style={{ background: item.color }}
						/>
						{t(`reader.learnStatus.${item.key}`)}
					</Typography>
				))}
			</div>
		</footer>
	);
};
