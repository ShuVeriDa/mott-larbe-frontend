const MyTextReaderLoading = () => (
	<div className="flex h-screen flex-col overflow-hidden">
		<div className="h-[52px] shrink-0 animate-pulse border-b border-bd-1 bg-surf-2" />
		<div className="flex-1 bg-surf px-[42px] py-[22px]">
			<div className="mx-auto max-w-2xl space-y-4">
				<div className="h-7 w-2/3 animate-pulse rounded bg-surf-3" />
				{Array.from({ length: 10 }).map((_, i) => (
					<div
						key={i}
						className={`h-4 animate-pulse rounded bg-surf-3 ${i % 4 === 3 ? "w-1/2" : "w-full"}`}
					/>
				))}
			</div>
		</div>
	</div>
);

export default MyTextReaderLoading;
