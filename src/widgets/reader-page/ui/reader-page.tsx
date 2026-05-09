"use client";
import { ComponentProps, useEffect, useState } from 'react';
import { useTextPage } from "@/entities/text";
import { useWordLookupStore } from "@/features/word-lookup";
import { ReaderBody } from "@/widgets/reader-body";
import { ReaderFooter } from "@/widgets/reader-footer";
import { ReaderSettingsSheet } from "@/widgets/reader-settings-sheet";
import { ReaderTopbar } from "@/widgets/reader-topbar";
import { WordBottomSheet } from "@/widgets/word-bottom-sheet";
import { WordPanel } from "@/widgets/word-panel";
import { WordPopup } from "@/widgets/word-popup";
import { useI18n } from "@/shared/lib/i18n";

export interface ReaderPageProps {
	textId: string;
	pageNumber: number;
}

export const ReaderPage = ({ textId, pageNumber }: ReaderPageProps) => {
	const { t, lang } = useI18n();
	const { data, isLoading, isError } = useTextPage(textId, pageNumber);
	const clear = useWordLookupStore((s) => s.clear);
	const [settingsOpen, setSettingsOpen] = useState(false);

	useEffect(() => {
		clear();
	}, [textId, pageNumber, clear]);

	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center p-10 text-sm text-t-3">
				{t("reader.states.loading")}
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="flex flex-1 items-center justify-center p-10 text-sm text-red">
				{t("reader.states.error")}
			</div>
		);
	}

		const handleOpenSettings: NonNullable<ComponentProps<typeof ReaderTopbar>["onOpenSettings"]> = () => setSettingsOpen(true);
	const handleClose: NonNullable<ComponentProps<typeof ReaderSettingsSheet>["onClose"]> = () => setSettingsOpen(false);
return (
		<>
			<ReaderTopbar
				textId={textId}
				lang={lang}
				currentPage={pageNumber}
				data={data}
				onOpenSettings={handleOpenSettings}
			/>
			<div className="flex flex-1 overflow-hidden max-md:overflow-visible">
				<ReaderBody data={data} currentPage={pageNumber} />
				<WordPanel textId={textId} />
			</div>
			<ReaderFooter />
			<WordPopup />
			<WordBottomSheet textId={textId} />
			<ReaderSettingsSheet
				open={settingsOpen}
				onClose={handleClose}
			/>
		</>
	);
};
