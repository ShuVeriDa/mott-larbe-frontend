import { MyTextReaderSkeleton } from "@/widgets/my-text-reader";

const MyTextReaderLoading = () => (
	<div className="flex h-full flex-col overflow-hidden">
		<div className="h-[49px] shrink-0 border-b border-bd-1 bg-surf" />
		<MyTextReaderSkeleton />
	</div>
);

export default MyTextReaderLoading;
