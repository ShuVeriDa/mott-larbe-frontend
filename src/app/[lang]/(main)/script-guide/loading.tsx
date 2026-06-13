import { Skeleton } from "@/shared/ui/skeleton";

const ScriptGuideLoading = () => (
	<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-4">
		<Skeleton className="h-6 w-24" />
		<Skeleton className="h-8 w-64" />
		<Skeleton className="h-4 w-80" />
		<Skeleton className="h-10 w-64" />
		<Skeleton className="h-96 w-full" />
	</div>
);

export default ScriptGuideLoading;
