"use client";

import { userTextReaderContextApi } from "@/entities/reader-context/api/user-text-reader-context-api";
import { useI18n } from "@/shared/lib/i18n";
import { ReaderPage } from "./reader-page";
import { ReaderPageSkeleton } from "./reader-page-skeleton";
import { ReaderError } from "./reader-error";
import { useUserTextReaderContext } from "@/entities/reader-context/model/use-user-text-reader-context";

interface UserTextReaderPageProps {
	userTextId: string;
	pageNumber: number;
}

export const UserTextReaderPage = ({ userTextId, pageNumber }: UserTextReaderPageProps) => {
	const { lang, t } = useI18n();

	const { isPending, isError } = useUserTextReaderContext(userTextId, pageNumber);

	if (isPending) return <ReaderPageSkeleton />;
	if (isError) return <ReaderError />;

	return (
		<ReaderPage
			textId={userTextId}
			pageNumber={pageNumber}
			routeBase="my-texts"
			apiFn={userTextReaderContextApi.getContext}
			backHref={`/${lang}/my-texts`}
			backLabel={t("myTexts.title")}
		/>
	);
};
