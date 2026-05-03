interface OverridesToolbarProps {
	search: string;
	onSearchChange: (v: string) => void;
	t: (key: string) => string;
}

export const OverridesToolbar = ({ search, onSearchChange, t }: OverridesToolbarProps) => (
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
	</div>
);
