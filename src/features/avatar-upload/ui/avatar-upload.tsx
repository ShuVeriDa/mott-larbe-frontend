"use client";

import { Avatar } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { useAvatarUpload } from "../model/use-avatar-upload";

export interface AvatarUploadProps {
	currentSrc?: string;
	alt: string;
	initials: string;
	className?: string;
}

export const AvatarUpload = ({ currentSrc, alt, initials, className }: AvatarUploadProps) => {
	const { t } = useI18n();
	const { inputRef, isPending, displaySrc, hasAvatar, handleTrigger, handleKeyDown, handleFileChange, handleRemove } =
		useAvatarUpload(currentSrc);

	return (
		<div className="flex flex-col items-center gap-2">
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

			{/* Remove button — only shown when avatar exists */}
			<AnimatePresence>
				{hasAvatar && !isPending && (
					<motion.div
						initial={{ opacity: 0, y: -4 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -4 }}
						transition={{ duration: 0.15, ease: "easeOut" }}
					>
						<Button
							variant="bare"
							size={null}
							onClick={handleRemove}
							title={t("profile.avatar.removeLabel")}
							className="flex items-center gap-1 text-[11px] text-t-3 transition-colors hover:text-red"
						>
							<Trash2 className="size-3" />
							{t("profile.avatar.removeLabel")}
						</Button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
