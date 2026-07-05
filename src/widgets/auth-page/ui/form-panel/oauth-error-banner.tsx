import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import { springs } from "@/shared/lib/animations";
import type { OAuthError } from "../../model/oauth-error";

interface OAuthErrorBannerProps {
	error?: OAuthError;
}

export const OAuthErrorBanner = ({ error }: OAuthErrorBannerProps) => {
	const { t } = useI18n();

	return (
		<AnimatePresence>
			{error ? (
				<motion.div
					role="alert"
					initial={{ opacity: 0, scale: 0.95, y: 8 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: 8 }}
					transition={springs.default}
					className="mb-4 flex items-start gap-2.5 rounded-[8px] border-[0.5px] border-amb/25 bg-amb-bg px-3 py-2.5 text-[12px] text-amb-t"
				>
					<AlertCircle size={14} className="mt-px shrink-0" strokeWidth={2} />
					<Typography tag="span">
						{t(
							error === "oauth_state_mismatch"
								? "auth.errors.oauthStateMismatch"
								: "auth.errors.oauthFailed",
						)}
					</Typography>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
};
