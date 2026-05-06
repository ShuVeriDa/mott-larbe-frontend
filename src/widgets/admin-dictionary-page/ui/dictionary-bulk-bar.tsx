interface DictionaryBulkBarProps {
	count: number;
	isDeleting: boolean;
	onDelete: () => void;
	onExport: () => void;
	onClear: () => void;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

export const DictionaryBulkBar = ({
	count,
	isDeleting,
	onDelete,
	onExport,
	onClear,
	t,
}: DictionaryBulkBarProps) => (
	<div className="mb-3.5 flex items-center gap-2 rounded-[9px] border border-acc/30 bg-acc-bg px-3.5 py-2.5">
		<span className="text-[12.5px] font-medium text-acc-t">
			{t("admin.dictionary.bulk.selected", { count })}
		</span>
		<div className="ml-auto flex items-center gap-1.5">
			<button
				type="button"
				onClick={onExport}
				className="flex h-[26px] cursor-pointer items-center gap-1 rounded-[6px] border border-bd-2 bg-surf px-2.5 text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
			>
				<svg className="size-[11px]" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
					<path d="M7.5 1v9M4 7l3.5 3.5L11 7" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M2 12h11" strokeLinecap="round" />
				</svg>
				{t("admin.dictionary.bulk.export")}
			</button>
			<button
				type="button"
				onClick={onDelete}
				disabled={isDeleting}
				className="flex h-[26px] cursor-pointer items-center gap-1 rounded-[6px] bg-red-500 px-2.5 text-[12px] font-medium text-white transition-opacity hover:opacity-[.88] disabled:opacity-50"
			>
				<svg className="size-[11px]" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
					<path d="M2 4h11M5 4V3a1 1 0 011-1h3a1 1 0 011 1v1M6 7v4M9 7v4" strokeLinecap="round" />
					<path d="M3 4l.7 7.5A1 1 0 004.7 12.5h5.6a1 1 0 001-.95L12 4" strokeLinecap="round" />
				</svg>
				{t("admin.dictionary.bulk.delete")}
			</button>
			<button
				type="button"
				onClick={onClear}
				className="flex size-[26px] cursor-pointer items-center justify-center rounded-[6px] border border-bd-2 bg-surf text-t-3 transition-colors hover:border-bd-3 hover:text-t-1"
			>
				<svg className="size-3" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
					<path d="M11.5 3.5l-8 8M3.5 3.5l8 8" strokeLinecap="round" />
				</svg>
			</button>
		</div>
	</div>
);
