import { cn } from "@/shared/lib/cn";

type Translator = (key: string, vars?: Record<string, string | number>) => string;

interface TextProgressCardProps {
	progressPercent: number;
	currentPage: number;
	totalPages: number;
	lastOpened: string | null;
	t: Translator;
}

const MAX_DOTS = 30;

export const TextProgressCard = ({
	progressPercent,
	currentPage,
	totalPages,
	lastOpened,
	t,
}: TextProgressCardProps) => {
	const donePages = currentPage > 0 ? currentPage - 1 : 0;
	const dotsCount = Math.min(totalPages, MAX_DOTS);

	const formatLastRead = (iso: string | null) => {
		if (!iso) return null;
		return new Date(iso).toLocaleDateString("ru-RU", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	const lastReadStr = formatLastRead(lastOpened);

	return (
		<div className="bg-surf border border-bd-1 rounded-card px-[17px] py-[15px]">
			<p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-t-3 mb-3">
				{t("library.textDetail.progress.label")}
			</p>
			<p className="font-display text-[30px] font-normal text-t-1 leading-none mb-0.5 max-sm:text-[26px]">
				{progressPercent}%
			</p>
			<p className="text-xs text-t-3 mb-2.5">
				{t("library.textDetail.progress.pagesRead", {
					done: donePages,
					total: totalPages,
				})}
			</p>

			<div className="h-[5px] bg-surf-3 rounded-full overflow-hidden mb-1.5">
				<div
					className="h-full bg-acc rounded-full transition-all duration-500"
					style={{ width: `${progressPercent}%` }}
				/>
			</div>

			{dotsCount > 0 && (
				<div className="flex gap-[3px] mb-1.5 flex-wrap">
					{Array.from({ length: dotsCount }).map((_, i) => {
						const isDone = i < donePages;
						const isCur = i === donePages && progressPercent > 0;
						return (
							<div
								key={i}
								className={cn(
									"flex-1 min-w-0 h-[3px] rounded-full",
									isDone ? "bg-acc" : isCur ? "bg-acc/40" : "bg-surf-3",
								)}
							/>
						);
					})}
				</div>
			)}

			{lastReadStr ? (
				<p className="text-[11px] text-t-3">
					{t("library.textDetail.progress.lastRead", { time: lastReadStr })}
				</p>
			) : (
				<p className="text-[11px] text-t-3">
					{t("library.textDetail.progress.notStarted")}
				</p>
			)}
		</div>
	);
};
