import { ComponentProps } from 'react';
import type {
	FeatureFlagCategory,
	FeatureFlagEnvironment,
	FeatureFlagStatusFilter,
} from "@/entities/feature-flag";

interface FeatureFlagsToolbarProps {
	search: string;
	category: string;
	environment: string;
	status: string;
	onSearchChange: (v: string) => void;
	onCategoryChange: (v: string) => void;
	onEnvironmentChange: (v: string) => void;
	onStatusChange: (v: string) => void;
	t: (key: string) => string;
}

const CATEGORIES: FeatureFlagCategory[] = [
	"FUNCTIONAL",
	"EXPERIMENTS",
	"TECHNICAL",
	"MONETIZATION",
];
const ENVIRONMENTS: FeatureFlagEnvironment[] = ["PROD", "STAGE", "DEV"];
const STATUSES: FeatureFlagStatusFilter[] = ["enabled", "disabled"];

export const FeatureFlagsToolbar = ({
	search,
	category,
	environment,
	status,
	onSearchChange,
	onCategoryChange,
	onEnvironmentChange,
	onStatusChange,
	t,
}: FeatureFlagsToolbarProps) => {
  const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e => onSearchChange(e.currentTarget.value);
  const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = e => onCategoryChange(e.currentTarget.value);
  const handleChange3: NonNullable<ComponentProps<"select">["onChange"]> = e => onEnvironmentChange(e.currentTarget.value);
  const handleChange4: NonNullable<ComponentProps<"select">["onChange"]> = e => onStatusChange(e.currentTarget.value);
  return (
	<div className="mb-3.5 flex flex-wrap items-center gap-2">
		<div className="relative max-w-[280px] flex-1">
			<svg
				className="pointer-events-none absolute left-2.5 top-1/2 size-[13px] -translate-y-1/2 text-t-3"
				viewBox="0 0 15 15"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.4"
			>
				<circle cx="6.5" cy="6.5" r="4" />
				<path d="M10 10l2.5 2.5" strokeLinecap="round" />
			</svg>
			<input
				type="text"
				value={search}
				onChange={handleChange}
				placeholder={t("admin.featureFlags.toolbar.searchPlaceholder")}
				className="h-[30px] w-full rounded-base border border-bd-2 bg-surf pl-[30px] pr-2.5 text-[12.5px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
			/>
		</div>

		<select
			value={category}
			onChange={handleChange2}
			className="h-[30px] cursor-pointer rounded-base border border-bd-2 bg-surf px-2 text-[12.5px] text-t-2 outline-none transition-colors hover:border-bd-3"
		>
			<option value="">{t("admin.featureFlags.toolbar.allCategories")}</option>
			{CATEGORIES.map(c => (
				<option key={c} value={c}>
					{t(`admin.featureFlags.category.${c}`)}
				</option>
			))}
		</select>

		<select
			value={environment}
			onChange={handleChange3}
			className="h-[30px] cursor-pointer rounded-base border border-bd-2 bg-surf px-2 text-[12.5px] text-t-2 outline-none transition-colors hover:border-bd-3"
		>
			<option value="">{t("admin.featureFlags.toolbar.allEnvs")}</option>
			{ENVIRONMENTS.map(e => (
				<option key={e} value={e}>
					{t(`admin.featureFlags.env.${e}`)}
				</option>
			))}
		</select>

		<select
			value={status}
			onChange={handleChange4}
			className="h-[30px] cursor-pointer rounded-base border border-bd-2 bg-surf px-2 text-[12.5px] text-t-2 outline-none transition-colors hover:border-bd-3"
		>
			<option value="">{t("admin.featureFlags.toolbar.allStatuses")}</option>
			{STATUSES.map(s => (
				<option key={s} value={s}>
					{t(`admin.featureFlags.status.${s}`)}
				</option>
			))}
		</select>
	</div>
);
};
