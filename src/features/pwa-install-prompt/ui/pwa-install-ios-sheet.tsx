"use client";

import { Check, PlusSquare, Share } from "lucide-react";

import { PwaInstallStep } from "@/entities/pwa-install";
import { useI18n } from "@/shared/lib/i18n";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/ui/sheet";

interface PwaInstallIosSheetProps {
	isOpen: boolean;
	onClose: () => void;
}

export const PwaInstallIosSheet = ({ isOpen, onClose }: PwaInstallIosSheetProps) => {
	const { t } = useI18n();

	return (
		<Sheet open={isOpen} onOpenChange={onClose}>
			<SheetContent side="bottom" open={isOpen} onInteractOutside={onClose}>
				<SheetHeader>
					<SheetTitle>{t("pwaInstall.ios.cta")}</SheetTitle>
				</SheetHeader>
				<div className="flex flex-col gap-4 px-4 pb-6">
					<PwaInstallStep step={1} icon={Share} text={t("pwaInstall.ios.step1")} />
					<PwaInstallStep step={2} icon={PlusSquare} text={t("pwaInstall.ios.step2")} />
					<PwaInstallStep step={3} icon={Check} text={t("pwaInstall.ios.step3")} />
				</div>
			</SheetContent>
		</Sheet>
	);
};
