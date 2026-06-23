"use client";

import type { TextProgressItem } from "@/entities/statistics";
import { variants } from "@/shared/lib/animation";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { motion } from "framer-motion";
import Link from "next/link";
import { TextRow } from "./text-row";

interface TextsProgressProps {
	items: TextProgressItem[];
	lang: string;
}

export const TextsProgress = ({ items, lang }: TextsProgressProps) => {
	const { t } = useI18n();

	return (
		<section className="h-full rounded-card border-[0.5px] border-bd-1 bg-surf p-4">
			<header className="mb-3 flex items-center justify-between gap-2">
				<Typography tag="span" className="truncate text-[12.5px] font-semibold text-t-1">
					{t("statistics.texts.title")}
				</Typography>
				<Link
					href={`/${lang}/texts`}
					className="shrink-0 text-[11.5px] text-acc hover:underline"
				>
					{t("statistics.texts.all")}
				</Link>
			</header>

			{items.length === 0 ? (
				<div className="py-6 text-center text-[11px] text-t-3">
					{t("statistics.texts.empty")}
				</div>
			) : (
				<motion.div
					className="flex flex-col"
					variants={variants.staggerContainer}
					initial="hidden"
					animate="visible"
				>
					{items.map(item => (
						<motion.div key={item.id} variants={variants.staggerItem}>
							<TextRow item={item} lang={lang} />
						</motion.div>
					))}
				</motion.div>
			)}
		</section>
	);
};
