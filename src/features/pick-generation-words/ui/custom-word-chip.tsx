"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { springs } from "@/shared/lib/animations";

interface CustomWordChipProps {
	word: string;
	onRemove: (word: string) => void;
}

export const CustomWordChip = ({ word, onRemove }: CustomWordChipProps) => {
	const handleRemoveClick = () => onRemove(word);

	return (
		<motion.li
			layout
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={springs.snappy}
		>
			<Badge variant="pur" className="gap-1">
				{word}
				<button
					type="button"
					onClick={handleRemoveClick}
					aria-label={word}
					className="rounded-full transition-colors duration-150 ease-out hover:bg-pur-t/20"
				>
					<X className="size-3" />
				</button>
			</Badge>
		</motion.li>
	);
};
