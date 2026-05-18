"use client";

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/ui/table";

interface Props {
	headers: string[];
}

export const PaymentsTableSkeleton = ({ headers }: Props) => (
	<div className="overflow-x-auto [&::-webkit-scrollbar]:h-0">
		<Table className="border-collapse text-[12.5px]" aria-busy="true" aria-label="Loading payments">
			<TableHeader>
				<TableRow className="border-b border-bd-1">
					{headers.map((h, i) => (
						<TableHead
							key={i}
							className="px-3 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3"
						>
							{h}
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array.from({ length: 8 }).map((_, i) => (
					<TableRow key={i} className="border-b border-bd-1 last:border-b-0">
						{Array.from({ length: 8 }).map((_, j) => (
							<TableCell key={j} className="px-3 py-2.5">
								<div className="h-4 animate-pulse rounded bg-surf-3" />
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	</div>
);
