"use client";

// This hook is kept for navigation helpers used by other parts of the widget.
// Data fetching (useSuspenseQuery) lives in MyTextsTabsContent, not here.

import { useRouter } from "next/navigation";

export const useMyTextsNavigation = (lang: string) => {
  const router = useRouter();

  const handleNavigateToNew = () => router.push(`/${lang}/my-texts/new`);
  const handleNavigateToNewSubmission = () => router.push(`/${lang}/my-texts/submit/new`);
  const handleNavigateToRead = (id: string) => router.push(`/${lang}/my-texts/${id}`);
  const handleNavigateToEdit = (id: string) => router.push(`/${lang}/my-texts/${id}/edit`);

  return {
    handleNavigateToNew,
    handleNavigateToNewSubmission,
    handleNavigateToRead,
    handleNavigateToEdit,
  };
};
