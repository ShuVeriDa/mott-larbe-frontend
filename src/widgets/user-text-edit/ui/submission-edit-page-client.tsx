"use client";

import dynamic from "next/dynamic";

const SubmissionEditPageLazy = dynamic(
  () => import("./submission-edit-page").then((m) => m.SubmissionEditPage),
  { ssr: false },
);

export const SubmissionEditPageClient = ({ draftId, lang }: { draftId: string; lang: string }) => (
  <SubmissionEditPageLazy draftId={draftId} lang={lang} />
);
