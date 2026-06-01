"use client";

import { useI18n } from "@/shared/lib/i18n";
import { LibraryPage, LibraryPageTopbar, useLibraryPage } from "@/widgets/library-page";
import { Suspense } from "react";
import { TextsCatalogSkeleton } from "./texts-catalog-skeleton";

const TextsCatalogInner = () => {
	const { t } = useI18n();
	const state = useLibraryPage();

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<LibraryPageTopbar title={t("library.title")} state={state} />
			<LibraryPage hideTopbar state={state} />
		</div>
	);
};

export const TextsCatalogPage = () => (
	<Suspense fallback={<TextsCatalogSkeleton />}>
		<TextsCatalogInner />
	</Suspense>
);
