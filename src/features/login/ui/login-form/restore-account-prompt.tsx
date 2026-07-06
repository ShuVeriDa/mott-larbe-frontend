import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import { springs } from "@/shared/lib/animations";

interface RestoreAccountPromptProps {
	deletedAt: string;
	isRestoring: boolean;
	hasError: boolean;
	onConfirm: () => void;
	onDismiss: () => void;
}

export const RestoreAccountPrompt = ({
	deletedAt,
	isRestoring,
	hasError,
	onConfirm,
	onDismiss,
}: RestoreAccountPromptProps) => {
	const { t, lang } = useI18n();

	const deletedAtLabel = deletedAt
		? new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", year: "numeric" }).format(
				new Date(deletedAt),
			)
		: "";

	return (
		<AnimatePresence>
			<motion.div
				role="alert"
				initial={{ opacity: 0, scale: 0.95, y: 8 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.95, y: 8 }}
				transition={springs.default}
				className="mb-4 rounded-[8px] border-[0.5px] border-amb/25 bg-amb-bg px-3 py-3 text-[12px] text-amb-t"
			>
				<div className="flex items-start gap-2.5">
					<AlertTriangle size={14} className="mt-px shrink-0" strokeWidth={2} />
					<div className="flex-1">
						<Typography tag="p" className="font-medium">
							{deletedAtLabel
								? t("auth.restore.title", { date: deletedAtLabel })
								: t("auth.restore.titleNoDate")}
						</Typography>
						<Typography tag="p" className="mt-1 text-[11.5px] opacity-90">
							{t("auth.restore.description")}
						</Typography>
						{hasError ? (
							<Typography tag="p" className="mt-1.5 text-[11.5px] text-red">
								{t("auth.restore.error")}
							</Typography>
						) : null}
					</div>
				</div>
				<div className="mt-2.5 flex justify-end gap-2">
					<Button
						type="button"
						variant="bare"
						disabled={isRestoring}
						onClick={onDismiss}
						className="h-7 px-2.5 text-[11.5px]"
					>
						{t("auth.restore.dismiss")}
					</Button>
					<Button
						type="button"
						variant="outline"
						disabled={isRestoring}
						onClick={onConfirm}
						className="h-7 px-2.5 text-[11.5px]"
					>
						{isRestoring ? t("auth.restore.restoring") : t("auth.restore.confirm")}
					</Button>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};
