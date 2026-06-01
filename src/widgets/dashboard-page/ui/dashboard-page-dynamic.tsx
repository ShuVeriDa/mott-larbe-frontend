"use client";

import dynamic from "next/dynamic";
import { DashboardSkeleton } from "./dashboard-skeleton";

export const DashboardPageDynamic = dynamic(
	() => import("./dashboard-page").then(m => m.DashboardPage),
	{ ssr: false, loading: () => <DashboardSkeleton /> },
);
