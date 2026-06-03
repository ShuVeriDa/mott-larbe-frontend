"use client";

import dynamic from "next/dynamic";

const UserTextCreatePageLazy = dynamic(
  () => import("./user-text-create-page").then((m) => m.UserTextCreatePage),
  { ssr: false },
);

interface Props { lang: string }

export const UserTextCreatePageClient = ({ lang }: Props) => (
  <UserTextCreatePageLazy lang={lang} />
);
