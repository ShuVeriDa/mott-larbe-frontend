import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { CefrBadge } from "@/entities/dictionary";
import type { AdminDictListItem } from "@/entities/dictionary";
import { PosBadge } from "./pos-badge";

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

const SkeletonCard = () => (
	<div className="border-b border-bd-1 px-3.5 py-3">
		<div className="mb-2 flex items-center gap-2">
			<div className="h-4 w-24 animate-pulse rounded bg-surf-3" />
			<div className="ml-auto h-4 w-8 animate-pulse rounded bg-surf-3" />
		</div>
		<div className="h-3 w-32 animate-pulse rounded bg-surf-3" />
	</div>
);

interface DictionaryMobileListProps {
	items: AdminDictListItem[];
	isLoading: boolean;
	lang: string;
	onDelete: (entry: AdminDictListItem) => void;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

export const DictionaryMobileList = ({
	items,
	isLoading,
	lang,
	onDelete,
	t,
}: DictionaryMobileListProps) => (
	<div className="hidden max-sm:block">
		{isLoading
			? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
			: items.map((item) => {
			  const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onDelete(item);
			  return (
				<div
					key={item.id}
					className="flex items-start gap-2.5 border-b border-bd-1 px-3.5 py-3 last:border-b-0"
				>
					<div className="min-w-0 flex-1">
						<div className="mb-1 flex flex-wrap items-center gap-1.5">
							<Link
								href={`/${lang}/admin/dictionary/${item.id}`}
								className="font-medium text-[14px] text-t-1 hover:text-acc transition-colors"
							>
								{item.baseForm}
							</Link>
							{item.level && (
								<CefrBadge level={item.level as import("@/shared/types").CefrLevel} />
							)}
							<PosBadge
								pos={item.partOfSpeech}
								label={item.partOfSpeech ?? undefined}
							/>
						</div>
						{item.translation && (
							<p className="mb-1 text-[12px] text-t-3 line-clamp-1">{item.translation}</p>
						)}
						<div className="flex items-center gap-3 text-[11px] text-t-3">
							<span>
								{t("admin.dictionary.table.meanings")}: <span className={cn("font-medium", item.sensesCount === 0 && "text-red-t")}>{item.sensesCount}</span>
							</span>
							<span>
								{t("admin.dictionary.table.forms")}: <span className="font-medium text-t-2">{item.formsCount}</span>
							</span>
							<span>{formatDate(item.createdAt ?? "")}</span>
						</div>
					</div>
					<button
						type="button"
						onClick={handleClick}
						className="shrink-0 mt-0.5 flex size-[30px] cursor-pointer items-center justify-center rounded-base border-none bg-transparent text-t-3 transition-colors hover:bg-red-bg hover:text-red-t"
					>
						<svg className="size-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
							<path d="M3 5h10M5 5V4a1 1 0 011-1h4a1 1 0 011 1v1M6 8v4M10 8v4" strokeLinecap="round" />
							<path d="M4 5l.7 7.5A1 1 0 005.7 13h4.6a1 1 0 001-.95L12 5" strokeLinecap="round" />
						</svg>
					</button>
				</div>
			);
			})}
	</div>
);
