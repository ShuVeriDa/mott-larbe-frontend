"use client";

import dynamic from "next/dynamic";

const UserTextEditPageLazy = dynamic(
  () => import("./user-text-edit-page").then((m) => m.UserTextEditPage),
  { ssr: false },
);

interface Props { id: string; lang: string }

export const UserTextEditPageClient = ({ id, lang }: Props) => (
  <UserTextEditPageLazy id={id} lang={lang} />
);
