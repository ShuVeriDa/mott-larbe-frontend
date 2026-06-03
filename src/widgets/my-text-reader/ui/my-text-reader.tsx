"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { MyTextReaderInner } from "./my-text-reader-inner";
import { MyTextReaderSkeleton } from "./my-text-reader-skeleton";

interface MyTextReaderProps {
  id: string;
  lang: string;
}

export const MyTextReader = ({ id, lang }: MyTextReaderProps) => (
  <ErrorBoundary fallback={<MyTextReaderSkeleton />}>
    <Suspense fallback={<MyTextReaderSkeleton />}>
      <MyTextReaderInner id={id} lang={lang} />
    </Suspense>
  </ErrorBoundary>
);
