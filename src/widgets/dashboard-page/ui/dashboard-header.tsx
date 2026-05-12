"use client";

import { SearchBox } from "@/shared/ui/search-box";
import { Typography } from "@/shared/ui/typography";
import { type ComponentProps, type SyntheticEvent } from "react";
import { useI18n } from "@/shared/lib/i18n";

interface DashboardHeaderProps {
	searchQuery: string;
	onSearchChange: NonNullable<ComponentProps<"input">["onChange"]>;
	onSearchSubmit: (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => void;
}

export const DashboardHeader = ({
	searchQuery,
	onSearchChange,
	onSearchSubmit,
}: DashboardHeaderProps) => {
	const { t } = useI18n();

	return (
		<header className="flex justify-between shrink-0 items-center gap-3 border-hairline border-b border-bd-1 bg-surf px-[22px] py-3 transition-colors max-md:px-4 max-sm:px-3.5 max-sm:py-2.5">
			<Typography tag="h2" className="text-[13.5px] font-semibold text-t-1">
				{t("dashboard.pageTitle")}
			</Typography>

			<form
				onSubmit={onSearchSubmit}
				className=" flex max-w-[260px] max-sm:max-w-none"
			>
				<SearchBox
					value={searchQuery}
					onChange={onSearchChange}
					placeholder={t("dashboard.searchPlaceholder")}
					wrapperClassName="sm:flex w-[200px] focus-within:w-[240px] transition-[width] duration-150"
					className="text-xs"
				/>
			</form>
		</header>
	);
};
