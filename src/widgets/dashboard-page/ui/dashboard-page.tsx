"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/entities/dashboard";
import { useCurrentUser } from "@/entities/user";
import { useLibraryTexts } from "@/entities/library-text";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { ContinueReading } from "./continue-reading";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { GreetingSection } from "./greeting-section";
import { LibraryPreview } from "./library-preview";
import { ReviewBanner } from "./review-banner";
import { StatsGrid } from "./stats-grid";

export const DashboardPage = () => {
	const { t, lang } = useI18n();
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");

	const { data, isLoading, isError, refetch } = useDashboard();
	const { data: user } = useCurrentUser();
	const { data: library } = useLibraryTexts({ orderBy: "newest", limit: 6 });

	const handleSearchSubmit = (e: FormEvent) => {
		e.preventDefault();
		const q = searchQuery.trim();
		if (q) {
			router.push(`/${lang}/texts?search=${encodeURIComponent(q)}`);
		} else {
			router.push(`/${lang}/texts`);
		}
	};

	return (
		<>
			<header className="flex shrink-0 items-center gap-3 border-hairline border-b border-bd-1 bg-surf px-[22px] py-3 transition-colors max-md:px-4 max-sm:px-3.5 max-sm:py-2.5">
				<Typography tag="h2" className="text-[13.5px] font-semibold text-t-1 max-sm:hidden">
					{t("dashboard.pageTitle")}
				</Typography>

				<form
					onSubmit={handleSearchSubmit}
					className="ml-auto flex h-[30px] max-w-[260px] flex-1 items-center gap-[7px] rounded-base border-hairline border border-bd-2 bg-surf-2 px-2.5 transition-colors focus-within:border-acc max-sm:max-w-none"
				>
					<svg
						viewBox="0 0 16 16"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						className="size-3 shrink-0 text-t-3"
						aria-hidden="true"
					>
						<circle cx="6.5" cy="6.5" r="4.5" />
						<path d="M10 10l3.5 3.5" strokeLinecap="round" />
					</svg>
					<input
						type="search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder={t("dashboard.searchPlaceholder")}
						className="flex-1 border-none bg-transparent text-[12.5px] text-t-1 outline-none placeholder:text-t-3"
					/>
				</form>
			</header>

			{isLoading ? (
				<DashboardSkeleton />
			) : isError || !data ? (
				<div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
					<Typography tag="p" className="text-sm text-red">
						{t("dashboard.error")}
					</Typography>
					<button
						type="button"
						onClick={() => refetch()}
						className="rounded-md bg-acc px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
					>
						{t("dashboard.retry")}
					</button>
				</div>
			) : (
				<div className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-[22px] pb-7 pt-4 max-md:px-4 max-sm:px-3.5 max-sm:pb-5 max-sm:pt-3.5">
					<GreetingSection
						user={user}
						stats={data.stats}
						lang={lang}
					/>

					<StatsGrid stats={data.stats} />

					<ReviewBanner dueToday={data.stats.dueToday} lang={lang} />

					{data.continueReading.length > 0 ? (
						<ContinueReading items={data.continueReading} lang={lang} />
					) : null}

					{library?.items && library.items.length > 0 ? (
						<LibraryPreview items={library.items} lang={lang} />
					) : null}
				</div>
			)}
		</>
	);
};
