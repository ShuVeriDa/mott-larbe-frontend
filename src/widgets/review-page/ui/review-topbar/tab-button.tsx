import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/cn";
import { motion, AnimatePresence } from "framer-motion";
import { spring } from "@/shared/lib/animation";

interface TabButtonProps {
	label: string;
	count: number | null;
	active: boolean;
	onClick: () => void;
}

export const TabButton = ({ label, count, active, onClick }: TabButtonProps) => (
	<Button
		role="tab"
		aria-selected={active}
		onClick={onClick}
		style={{ position: "relative" }}
		className={cn(
			"flex h-[26px] min-w-0 cursor-pointer items-center gap-1 rounded-[6px] border-0 px-1.5 text-[11px] font-medium transition-colors duration-150 max-md:flex-1 max-md:justify-center md:gap-1.5 md:px-2.5 md:text-[12px]",
			active ? "font-semibold text-t-1" : "bg-transparent text-t-3 hover:text-t-2",
		)}
	>
		{active && (
			<motion.span
				layoutId="review-tab-bg"
				className="absolute inset-0 rounded-[6px] bg-surf shadow-sm"
				style={{ zIndex: 0 }}
				transition={spring.snappy}
			/>
		)}
		<span className="relative z-10 flex items-center gap-1 md:gap-1.5">
			{label}
			<AnimatePresence mode="wait">
				{count !== null && count > 0 ? (
					<motion.span
						key={count}
						initial={{ opacity: 0, scale: 0.7 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.7 }}
						transition={spring.bouncy}
					>
						<Typography
							tag="span"
							className={cn(
								"rounded-[3px] px-1 py-px text-[10px] font-bold",
								active ? "bg-acc-bg text-acc-t" : "bg-amb-bg text-amb-t",
							)}
						>
							{count}
						</Typography>
					</motion.span>
				) : null}
			</AnimatePresence>
		</span>
	</Button>
);
