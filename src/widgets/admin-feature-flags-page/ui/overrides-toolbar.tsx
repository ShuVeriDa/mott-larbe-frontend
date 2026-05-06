import type { FeatureFlagKeyItem } from "@/entities/feature-flag";

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
}: OverridesToolbarProps) => (
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
				onChange={(e) => onSearchChange(e.target.value)}
				placeholder={t("admin.featureFlags.overrides.searchPlaceholder")}
				className="h-[30px] w-full rounded-[7px] border border-bd-2 bg-surf pl-[30px] pr-2.5 text-[12.5px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
			/>
		</div>

		<select
			value={flagId}
			onChange={(e) => onFlagIdChange(e.target.value)}
			className="h-[30px] cursor-pointer rounded-[7px] border border-bd-2 bg-surf px-2 text-[12.5px] text-t-2 outline-none transition-colors hover:border-bd-3"
		>
			<option value="">{t("admin.featureFlags.overrides.allFlags")}</option>
			{flagKeys.map((f) => (
				<option key={f.id} value={f.id}>
					{f.key}
				</option>
			))}
		</select>

		<select
			value={isEnabled}
			onChange={(e) => onIsEnabledChange(e.target.value)}
			className="h-[30px] cursor-pointer rounded-[7px] border border-bd-2 bg-surf px-2 text-[12.5px] text-t-2 outline-none transition-colors hover:border-bd-3"
		>
			<option value="">{t("admin.featureFlags.overrides.anyValue")}</option>
			<option value="true">{t("admin.featureFlags.overrides.on")}</option>
			<option value="false">{t("admin.featureFlags.overrides.off")}</option>
		</select>

		<button
			type="button"
			onClick={onAddOverride}
			className="ml-auto flex h-[30px] cursor-pointer items-center gap-1.5 rounded-[7px] bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-[.88]"
		>
			<svg className="size-[11px]" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
				<path d="M7.5 2v11M2 7.5h11" />
			</svg>
			{t("admin.featureFlags.overrides.addOverride")}
		</button>
	</div>
);
