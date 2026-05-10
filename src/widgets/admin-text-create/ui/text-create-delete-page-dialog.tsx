"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";

interface TextCreateDeletePageDialogProps {
	pageIndex: number;
	onConfirm: () => void;
	onCancel: () => void;
	t: ReturnType<typeof useI18n>["t"];
}

export const TextCreateDeletePageDialog = ({
	pageIndex,
	onConfirm,
	onCancel,
	t,
}: TextCreateDeletePageDialogProps) => {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
			<div className="mx-4 w-full max-w-sm rounded-xl border border-bd-1 bg-surf p-6 shadow-xl">
				<Typography tag="h2" className="text-base font-semibold text-t-1">
					{t("admin.texts.createPage.deletePageTitle")}
				</Typography>
				<Typography tag="p" className="mt-2 text-sm text-t-3">
					{t("admin.texts.createPage.deletePageBody", { n: pageIndex + 1 })}
				</Typography>
				<div className="mt-5 flex justify-end gap-2">
					<Button
						onClick={onCancel}
						className="rounded-lg border border-bd-1 px-4 py-1.5 text-sm text-t-2 transition-colors hover:bg-surf-2"
					>
						{t("admin.texts.createPage.deletePageCancel")}
					</Button>
					<Button
						onClick={onConfirm}
						className="rounded-lg bg-red px-4 py-1.5 text-sm text-white transition-opacity hover:opacity-80"
					>
						{t("admin.texts.createPage.deletePageConfirm")}
					</Button>
				</div>
			</div>
		</div>
	);
};
