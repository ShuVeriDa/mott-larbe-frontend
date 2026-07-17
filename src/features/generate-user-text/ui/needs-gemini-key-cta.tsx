"use client";

import Link from "next/link";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";

interface NeedsGeminiKeyCtaProps {
	open: boolean;
	onClose: () => void;
}

export const NeedsGeminiKeyCta = ({ open, onClose }: NeedsGeminiKeyCtaProps) => {
	const { t, lang } = useI18n();

	return (
		<Modal open={open} onClose={onClose} title={t("myTexts.generate.needsGeminiKey.title")}>
			<Typography tag="p" size="sm" className="text-t-2">
				{t("myTexts.generate.needsGeminiKey.body")}
			</Typography>
			<ModalActions>
				<Button variant="ghost" onClick={onClose}>
					{t("myTexts.generate.needsGeminiKey.cancel")}
				</Button>
				<Button variant="action" asChild>
					<Link href={`/${lang}/settings?section=ai`}>{t("myTexts.generate.needsGeminiKey.cta")}</Link>
				</Button>
			</ModalActions>
		</Modal>
	);
};
