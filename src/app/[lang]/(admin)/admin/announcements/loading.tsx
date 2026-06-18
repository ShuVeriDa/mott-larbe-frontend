const AnnouncementsLoadingPage = () => (
	<div className="flex min-h-0 flex-1 flex-col">
		<header className="flex items-center gap-3 border-b border-bd-1 bg-surf px-[18px] py-3">
			<div>
				<div className="h-4 w-32 animate-pulse rounded bg-surf-3" />
				<div className="mt-1.5 h-3 w-48 animate-pulse rounded bg-surf-3" />
			</div>
			<div className="ml-auto h-[30px] w-[120px] animate-pulse rounded-base bg-surf-3 max-sm:w-[30px]" />
		</header>

		<div className="overflow-y-auto px-[18px] py-4 pb-8 max-sm:px-3">
			<div className="rounded-xl border border-bd-1 bg-surf">
				<div className="border-b border-bd-1 px-4 py-3">
					<div className="h-3.5 w-28 animate-pulse rounded bg-surf-3" />
				</div>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse">
						<thead>
							<tr className="border-b border-bd-1 bg-surf-2">
								{["pl-3.5", "", "", ""].map((cls, i) => (
									<th key={i} className={`px-2.5 py-[10px] ${cls}`}>
										<div className="h-2.5 w-16 animate-pulse rounded bg-surf-3" />
									</th>
								))}
								<th className="px-2.5 py-[10px]" style={{ width: 52 }} />
							</tr>
						</thead>
						<tbody>
							{Array.from({ length: 5 }).map((_, i) => (
								<tr key={i} className="border-b border-bd-1 last:border-b-0">
									<td className="px-2.5 py-[10px] pl-3.5">
										<div className="h-4 w-40 animate-pulse rounded-[5px] bg-surf-3" />
									</td>
									<td className="px-2.5 py-[10px] max-sm:hidden">
										<div className="h-3 w-56 animate-pulse rounded bg-surf-3" />
									</td>
									<td className="px-2.5 py-[10px] max-sm:hidden">
										<div className="h-3 w-24 animate-pulse rounded bg-surf-3" />
									</td>
									<td className="px-2.5 py-[10px] max-sm:hidden">
										<div className="h-3 w-16 animate-pulse rounded bg-surf-3" />
									</td>
									<td style={{ width: 52 }} />
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
);

export default AnnouncementsLoadingPage;
