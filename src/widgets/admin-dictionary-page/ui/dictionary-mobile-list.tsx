import { ComponentProps } from 'react';
import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { CefrBadge } from "@/entities/dictionary";
import type { AdminDictListItem } from "@/entities/dictionary";
import { PosBadge } from "./pos-badge";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Trash2 } from "lucide-react";
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
			  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onDelete(item);
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
							<Typography tag="p" className="mb-1 text-[12px] text-t-3 line-clamp-1">{item.translation}</Typography>
						)}
						<div className="flex items-center gap-3 text-[11px] text-t-3">
							<Typography tag="span">
								{t("admin.dictionary.table.meanings")}: <Typography tag="span" className={cn("font-medium", item.sensesCount === 0 && "text-red-t")}>{item.sensesCount}</Typography>
							</Typography>
							<Typography tag="span">
								{t("admin.dictionary.table.forms")}: <Typography tag="span" className="font-medium text-t-2">{item.formsCount}</Typography>
							</Typography>
							<Typography tag="span">{formatDate(item.createdAt ?? "")}</Typography>
						</div>
					</div>
					<Button
						onClick={handleClick}
						className="shrink-0 mt-0.5 flex size-[30px] cursor-pointer items-center justify-center rounded-base border-none bg-transparent text-t-3 transition-colors hover:bg-red-bg hover:text-red-t"
					>
						<Trash2 className="size-3.5" />
					</Button>
				</div>
			);
			})}
	</div>
);
