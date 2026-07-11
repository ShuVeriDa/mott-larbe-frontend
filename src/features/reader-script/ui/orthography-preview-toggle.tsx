"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import { ArticleRich } from "@/entities/text";
import type { TextToken } from "@/entities/text";
import { useI18n } from "@/shared/lib/i18n/use-i18n";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/shared/ui/sheet";
import { convertDocToOld } from "@/shared/lib/chechen-ortho";
import type { TipTapDoc } from "@/shared/ui/notion-editor";
import type { Editor } from "@/shared/ui/notion-editor";

const EMPTY_TOKENS: readonly TextToken[] = [];

const noop = () => {};

interface OrthographyPreviewToggleProps {
	language: string;
	editorRef: { current: Editor | null };
}

export const OrthographyPreviewToggle = ({
	language,
	editorRef,
}: OrthographyPreviewToggleProps) => {
	const { t } = useI18n();
	const [isOpen, setIsOpen] = useState(false);
	const [previewDoc, setPreviewDoc] = useState<TipTapDoc | null>(null);

	if (language !== "CHE") return null;

	const handleOpen = () => {
		const doc = editorRef.current?.getJSON() as TipTapDoc | undefined;
		if (!doc) return;
		setPreviewDoc(convertDocToOld(doc));
		setIsOpen(true);
	};

	const handleClose = () => setIsOpen(false);

	const handleSelectToken = (_token: TextToken, _event: MouseEvent<HTMLSpanElement>) => {};

	return (
		<>
			<Button
				variant="ghost"
				size="default"
				onClick={handleOpen}
				aria-label={t("reader.settings.script.orthographyToggle")}
				className={cn(
					"h-7 whitespace-nowrap rounded-md px-2 text-[11px] font-medium text-t-2",
					"transition-colors duration-150 ease-out hover:bg-surf-3 hover:text-t-1",
				)}
			>
				{t("reader.settings.script.orthographyOld")}
			</Button>

			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetContent side="right" open={isOpen} onInteractOutside={handleClose}>
					<SheetHeader>
						<SheetTitle>{t("reader.settings.script.orthographyOld")}</SheetTitle>
					</SheetHeader>
					<div className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
						{previewDoc && (
							<ArticleRich
								contentRich={previewDoc}
								tokens={EMPTY_TOKENS}
								activeTokenId={null}
								onSelectToken={handleSelectToken}
								displayOnly
							/>
						)}
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
};
