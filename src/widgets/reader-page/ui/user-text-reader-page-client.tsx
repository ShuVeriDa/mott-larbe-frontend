"use client";

import dynamic from "next/dynamic";

// TipTap/ProseMirror requires client-only rendering
const UserTextReaderPageLazy = dynamic(
	() => import("./user-text-reader-page").then((m) => m.UserTextReaderPage),
	{ ssr: false },
);

interface Props {
	userTextId: string;
	pageNumber: number;
}

export const UserTextReaderPageClient = ({ userTextId, pageNumber }: Props) => (
	<UserTextReaderPageLazy userTextId={userTextId} pageNumber={pageNumber} />
);
