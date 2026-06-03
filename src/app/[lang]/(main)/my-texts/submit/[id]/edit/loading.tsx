const MyTextsSubmitEditLoading = () => (
	<div className="flex h-full flex-col overflow-hidden">
		<div className="h-[49px] shrink-0 animate-pulse border-b border-bd-1 bg-surf-2" />
		<div className="flex flex-1 overflow-hidden">
			<div className="w-[280px] shrink-0 border-r border-bd-1 bg-surf p-4">
				<div className="space-y-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="h-8 animate-pulse rounded bg-surf-3" />
					))}
				</div>
			</div>
			<div className="flex-1 bg-surf" />
		</div>
	</div>
);

export default MyTextsSubmitEditLoading;
