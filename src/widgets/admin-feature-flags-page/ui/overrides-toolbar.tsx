import { ComponentProps } from 'react';
import type { FeatureFlagKeyItem } from "@/entities/feature-flag";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { SearchBox } from "@/shared/ui/search-box";
import { Select } from "@/shared/ui/select";

interface OverridesToolbarProps {
	search: string;
	flagId: string;
	isEnabled: string;
	flagKeys: FeatureFlagKeyItem[];
	onSearchChange: (v: string) => void;
	onFlagIdChange: (v: string) => void;
	onIsEnabledChange: (v: string) => void;
	onAddOverride: () => void;
	t: (key: string) => string;
}

export const OverridesToolbar = ({
	search,
	flagId,
	isEnabled,
	flagKeys,
	onSearchChange,
	onFlagIdChange,
	onIsEnabledChange,
	onAddOverride,
	t,
}: OverridesToolbarProps) => {
  const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e => onSearchChange(e.currentTarget.value);
  const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = e => onFlagIdChange(e.currentTarget.value);
  const handleChange3: NonNullable<ComponentProps<"select">["onChange"]> = e => onIsEnabledChange(e.currentTarget.value);
  return (
	<div className="mb-3.5 flex flex-wrap items-center gap-2">
		<SearchBox
			value={search}
			onChange={handleChange}
			placeholder={t("admin.featureFlags.overrides.searchPlaceholder")}
			wrapperClassName="max-w-[280px] flex-1"
		/>

		<Select value={flagId} onChange={handleChange2} wrapperClassName="w-auto" className="bg-surf text-t-2 hover:border-bd-3">
			<option value="">{t("admin.featureFlags.overrides.allFlags")}</option>
			{flagKeys.map(f => (
				<option key={f.id} value={f.id}>
					{f.key}
				</option>
			))}
		</Select>

		<Select value={isEnabled} onChange={handleChange3} wrapperClassName="w-auto" className="bg-surf text-t-2 hover:border-bd-3">
			<option value="">{t("admin.featureFlags.overrides.anyValue")}</option>
			<option value="true">{t("admin.featureFlags.overrides.on")}</option>
			<option value="false">{t("admin.featureFlags.overrides.off")}</option>
		</Select>

		<Button
			onClick={onAddOverride}
			className="ml-auto flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-[.88]"
		>
			<Plus className="size-[11px]" />
			{t("admin.featureFlags.overrides.addOverride")}
		</Button>
	</div>
);
};
