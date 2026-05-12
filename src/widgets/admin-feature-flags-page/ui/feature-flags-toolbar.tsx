import { ComponentProps } from 'react';
import { SearchBox } from "@/shared/ui/search-box";
import type {
	FeatureFlagCategory,
	FeatureFlagEnvironment,
	FeatureFlagStatusFilter,
} from "@/entities/feature-flag";
import { Select } from "@/shared/ui/select";

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
		<SearchBox
			value={search}
			onChange={handleChange}
			placeholder={t("admin.featureFlags.toolbar.searchPlaceholder")}
			wrapperClassName="max-w-[280px] flex-1"
		/>

		<Select value={category} onChange={handleChange2} wrapperClassName="w-auto" className="bg-surf text-t-2 hover:border-bd-3">
			<option value="">{t("admin.featureFlags.toolbar.allCategories")}</option>
			{CATEGORIES.map(c => (
				<option key={c} value={c}>
					{t(`admin.featureFlags.category.${c}`)}
				</option>
			))}
		</Select>

		<Select value={environment} onChange={handleChange3} wrapperClassName="w-auto" className="bg-surf text-t-2 hover:border-bd-3">
			<option value="">{t("admin.featureFlags.toolbar.allEnvs")}</option>
			{ENVIRONMENTS.map(e => (
				<option key={e} value={e}>
					{t(`admin.featureFlags.env.${e}`)}
				</option>
			))}
		</Select>

		<Select value={status} onChange={handleChange4} wrapperClassName="w-auto" className="bg-surf text-t-2 hover:border-bd-3">
			<option value="">{t("admin.featureFlags.toolbar.allStatuses")}</option>
			{STATUSES.map(s => (
				<option key={s} value={s}>
					{t(`admin.featureFlags.status.${s}`)}
				</option>
			))}
		</Select>
	</div>
);
};
