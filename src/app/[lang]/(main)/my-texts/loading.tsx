import { UserTextListSkeleton } from "@/widgets/my-texts-page";

// Automatic Suspense boundary for the route segment (Next.js App Router)
// Skeleton dimensions match UserTextCard height to prevent CLS
const MyTextsLoading = () => (
	<div className="flex h-full flex-col overflow-hidden">
		<div className="h-[49px] shrink-0 border-b border-bd-1 bg-surf" />
		<UserTextListSkeleton />
	</div>
);

export default MyTextsLoading;
