"use client";

import { Avatar } from "@/shared/ui/avatar";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";
import { useAvatarUpload } from "../model/use-avatar-upload";

export interface AvatarUploadProps {
	currentSrc?: string;
	alt: string;
	initials: string;
	className?: string;
}

export const AvatarUpload = ({ currentSrc, alt, initials, className }: AvatarUploadProps) => {
	const { t } = useI18n();
	const { inputRef, isPending, displaySrc, handleTrigger, handleKeyDown, handleFileChange } =
		useAvatarUpload(currentSrc);

	return (
		<div
			role="button"
			tabIndex={0}
			aria-label={t("profile.avatar.changeLabel")}
			aria-disabled={isPending}
			onClick={handleTrigger}
			onKeyDown={handleKeyDown}
			className={cn(
				"relative shrink-0 group cursor-pointer select-none",
				isPending && "pointer-events-none",
				className,
			)}
		>
			<Avatar
				src={displaySrc}
				alt={alt}
				className={cn(
					"size-full text-inherit font-inherit border-[0.5px] border-bd-2",
					"transition-opacity duration-150 ease-out",
					isPending && "opacity-70",
				)}
			>
				{initials}
			</Avatar>

			{/* Camera overlay — always in DOM, Tier 1: CSS transition only */}
			{!isPending && (
				<div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 ease-out">
					<Camera className="size-[38%] text-white" strokeWidth={1.5} />
				</div>
			)}

			{/* Spinner — unmounts when done, Tier 3: AnimatePresence */}
			<AnimatePresence>
				{isPending && (
					<motion.div
						key="spinner"
						className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15, ease: "easeOut" }}
					>
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
						>
							<Loader2 className="size-[40%] text-white" />
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<input
				ref={inputRef}
				type="file"
				accept="image/jpeg,image/png,image/webp,image/gif"
				className="sr-only"
				tabIndex={-1}
				aria-hidden
				onChange={handleFileChange}
			/>
		</div>
	);
};
