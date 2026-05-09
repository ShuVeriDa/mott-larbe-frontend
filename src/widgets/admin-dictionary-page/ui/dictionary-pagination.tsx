import { cn } from "@/shared/lib/cn";

interface DictionaryPaginationProps {
	page: number;
	totalPages: number;
	total: number;
	limit: number;
	onChange: (page: number) => void;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

export const DictionaryPagination = ({
	page,
	totalPages,
	total,
	limit,
	onChange,
	t,
}: DictionaryPaginationProps) => {
	const from = (page - 1) * limit + 1;
	const to = Math.min(page * limit, total);

	const btn =
		"flex size-7 cursor-pointer items-center justify-center rounded-[6px] border border-bd-2 bg-surf text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:text-t-1 disabled:cursor-not-allowed disabled:opacity-40";

		const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onChange(page - 1);
	const handleClick2: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onChange(page + 1);
return (
		<div className="flex items-center justify-between border-t border-bd-1 px-3.5 py-3">
			<span className="text-[12px] text-t-3">
				{t("admin.dictionary.pagination.showing", { from, to, total })}
			</span>
			<div className="flex items-center gap-1">
				<button
					type="button"
					className={btn}
					onClick={handleClick}
					disabled={page <= 1}
				>
					<svg className="size-3" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
						<path d="M9 11L5 7.5 9 4" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>

				{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
					const pg =
						totalPages <= 5
							? i + 1
							: page <= 3
								? i + 1
								: page >= totalPages - 2
									? totalPages - 4 + i
									: page - 2 + i;
										const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onChange(pg);
return (
						<button
							key={pg}
							type="button"
							onClick={handleClick}
							className={cn(
								"flex size-7 cursor-pointer items-center justify-center rounded-[6px] border text-[12px] transition-colors",
								pg === page
									? "border-acc bg-acc text-white"
									: "border-bd-2 bg-surf text-t-2 hover:border-bd-3 hover:text-t-1",
							)}
						>
							{pg}
						</button>
					);
				})}

				<button
					type="button"
					className={btn}
					onClick={handleClick2}
					disabled={page >= totalPages}
				>
					<svg className="size-3" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
						<path d="M6 4l4 3.5L6 11" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>
			</div>
		</div>
	);
};
