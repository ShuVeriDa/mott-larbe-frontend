"use client";

import dynamic from "next/dynamic";

const SubmissionCreatePageLazy = dynamic(
  () => import("./submission-create-page").then((m) => m.SubmissionCreatePage),
  { ssr: false },
);

interface SubmissionCreatePageClientProps {
  lang: string;
  fromUserTextId?: string;
}

export const SubmissionCreatePageClient = ({ lang, fromUserTextId }: SubmissionCreatePageClientProps) => (
  <SubmissionCreatePageLazy lang={lang} fromUserTextId={fromUserTextId} />
);
