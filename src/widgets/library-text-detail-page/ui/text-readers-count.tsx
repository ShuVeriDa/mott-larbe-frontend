"use client";

import { spring } from "@/shared/lib/animation";
import { Typography } from "@/shared/ui/typography";
import { AnimatePresence, motion } from "framer-motion";
import { Users } from "lucide-react";

type Translator = (
	key: string,
	vars?: Record<string, string | number>,
) => string;

interface TextReadersCountProps {
	count: number;
	t: Translator;
}

export const TextReadersCount = ({ count, t }: TextReadersCountProps) => {
	if (count <= 0) return null;

	return (
		<Typography
			tag="span"
			className="inline-flex items-center gap-1 whitespace-nowrap"
		>
			<Users className="size-3.5 shrink-0 text-t-4" aria-hidden />
			<AnimatePresence mode="wait" initial={false}>
				<motion.span
					key={count}
					initial={{ opacity: 0, y: -6 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 6 }}
					transition={spring.snappy}
					className="inline-block tabular-nums"
				>
					{t("library.textDetail.readersCount", { count: count.toLocaleString() })}
				</motion.span>
			</AnimatePresence>
		</Typography>
	);
};
