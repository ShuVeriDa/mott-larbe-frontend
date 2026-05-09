"use client";

interface Props {
	headers: string[];
}

export const PaymentsTableSkeleton = ({ headers }: Props) => (
	<div className="overflow-x-auto [&::-webkit-scrollbar]:h-0">
		<table className="w-full border-collapse text-[12.5px]">
			<thead>
				<tr className="border-b border-bd-1">
					{headers.map((h, i) => (
						<th
							key={i}
							className="px-3 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3"
						>
							{h}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{Array.from({ length: 8 }).map((_, i) => (
					<tr key={i} className="border-b border-bd-1 last:border-b-0">
						{Array.from({ length: 8 }).map((_, j) => (
							<td key={j} className="px-3 py-2.5">
								<div className="h-4 animate-pulse rounded bg-surf-3" />
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	</div>
);
