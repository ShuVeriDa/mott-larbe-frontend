"use client";

import dynamic from "next/dynamic";

const SubmissionCreatePageLazy = dynamic(
  () => import("./submission-create-page").then((m) => m.SubmissionCreatePage),
  { ssr: false },
);

export const SubmissionCreatePageClient = ({ lang }: { lang: string }) => (
  <SubmissionCreatePageLazy lang={lang} />
);
