import { Skeleton } from "@/shared/ui/skeleton";

export const PhrasebookPageSkeleton = () => (
	<div className="flex flex-col flex-1 overflow-hidden">
		{/* topbar */}
		<div className="flex items-center justify-between px-[22px] py-3 border-b border-bd-1 bg-surf shrink-0">
			<Skeleton className="h-4 w-28 rounded" />
			<Skeleton className="h-7 w-[200px] rounded-lg" />
		</div>

		<div className="flex flex-col gap-3.5 p-[22px] flex-1 min-h-0 overflow-auto">
			{/* overview strip */}
			<div className="flex items-center gap-4 px-3.5 py-2.5 bg-surf border-[0.5px] border-bd-1 rounded-card shrink-0">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="flex items-center gap-1.5">
						<Skeleton className="w-8 h-5 rounded" />
						<Skeleton className="w-14 h-3 rounded" />
					</div>
				))}
			</div>

			{/* filters row */}
			<div className="flex gap-1.5 items-center">
				{Array.from({ length: 5 }).map((_, i) => (
					<Skeleton key={i} className="h-6 w-14 rounded-base" />
				))}
			</div>

			{/* body: sidebar + list */}
			<div className="flex gap-3.5 flex-1 min-h-0">
				{/* sidebar */}
				<div className="w-[200px] shrink-0 bg-surf border-[0.5px] border-bd-1 rounded-card overflow-hidden flex flex-col">
					<div className="px-3 py-2.5 border-b border-bd-1">
						<Skeleton className="h-2.5 w-20 rounded" />
					</div>
					<div className="flex flex-col gap-0.5 p-1">
						{Array.from({ length: 7 }).map((_, i) => (
							<div key={i} className="flex items-center gap-2 px-2 py-2">
								<Skeleton className="w-4 h-4 rounded" />
								<Skeleton className="flex-1 h-3 rounded" />
								<Skeleton className="w-5 h-2.5 rounded" />
							</div>
						))}
					</div>
				</div>

				{/* phrase list */}
				<div className="flex-1 flex flex-col gap-1.5">
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className="bg-surf border-[0.5px] border-bd-1 rounded-[10px] px-3.5 py-3 flex items-start gap-3"
						>
							<Skeleton className="w-1.5 h-1.5 rounded-full mt-[5px] shrink-0" />
							<div className="flex-1 min-w-0 flex flex-col gap-1.5">
								<Skeleton className="h-4 w-2/3 rounded" />
								<Skeleton className="h-3 w-1/2 rounded" />
								<Skeleton className="h-3 w-3/4 rounded" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	</div>
);
