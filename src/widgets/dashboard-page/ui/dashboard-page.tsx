"use client";

import { useDashboard } from "@/entities/dashboard";
import { useCurrentUser } from "@/entities/user";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { SearchBox } from "@/shared/ui/search-box";
import { Typography } from "@/shared/ui/typography";
import { useRouter } from "next/navigation";
import { ComponentProps, type SyntheticEvent, useState } from "react";
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

	const handleSearchSubmit = (
		e: SyntheticEvent<HTMLFormElement, SubmitEvent>,
	) => {
		e.preventDefault();
		const q = searchQuery.trim();
		if (q) {
			router.push(`/${lang}/texts?search=${encodeURIComponent(q)}`);
		} else {
			router.push(`/${lang}/texts`);
		}
	};

	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		setSearchQuery(e.currentTarget.value);
	const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		refetch();
	return (
		<>
			<header className="flex justify-between shrink-0 items-center gap-3 border-hairline border-b border-bd-1 bg-surf px-[22px] py-3 transition-colors max-md:px-4 max-sm:px-3.5 max-sm:py-2.5">
				<Typography tag="h2" className="text-[13.5px] font-semibold text-t-1">
					{t("dashboard.pageTitle")}
				</Typography>

				<form
					onSubmit={handleSearchSubmit}
					className=" flex max-w-[260px] max-sm:max-w-none"
				>
					<SearchBox
						value={searchQuery}
						onChange={handleChange}
						placeholder={t("dashboard.searchPlaceholder")}
						wrapperClassName="sm:flex w-[200px] focus-within:w-[240px] transition-[width] duration-150"
						className="text-xs"
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
					<Button
						onClick={handleClick}
						className="rounded-md bg-acc px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
					>
						{t("dashboard.retry")}
					</Button>
				</div>
			) : (
				<div className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-[22px] pb-7 pt-4 max-md:px-4 max-sm:px-3.5 max-sm:pb-5 max-sm:pt-3.5">
					<GreetingSection user={user} stats={data.stats} lang={lang} />

					<StatsGrid stats={data.stats} />

					<ReviewBanner dueToday={data.stats.dueToday} lang={lang} />

					{data.continueReading.length > 0 ? (
						<ContinueReading items={data.continueReading} lang={lang} />
					) : null}

					<LibraryPreview lang={lang} />
				</div>
			)}
		</>
	);
};
