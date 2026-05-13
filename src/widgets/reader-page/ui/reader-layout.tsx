import type { TextPageResponse } from "@/entities/text";
import { cn } from "@/shared/lib/cn";
import { ReaderBody } from "@/widgets/reader-body";
import { ReaderRail } from "./reader-rail";

interface ReaderLayoutProps {
	textId: string;
	pageNumber: number;
	data: TextPageResponse;
	desktopRailExpanded: boolean;
	settingsOpen: boolean;
	notesOpen: boolean;
	tocOpen: boolean;
	bookmarksOpen: boolean;
	onCloseRail: () => void;
	onNavigate: (page: number) => void;
}

export const ReaderLayout = ({
	textId,
	pageNumber,
	data,
	desktopRailExpanded,
	settingsOpen,
	notesOpen,
	tocOpen,
	bookmarksOpen,
	onCloseRail,
	onNavigate,
}: ReaderLayoutProps) => (
	<div
		className={cn(
			"grid min-h-0 flex-1 overflow-hidden bg-surf transition-[grid-template-columns] duration-300 ease-out",
			"max-[767px]:grid-cols-1 max-[767px]:overflow-visible",
			desktopRailExpanded
				? "min-[768px]:grid-cols-[1fr_296px]"
				: "min-[768px]:grid-cols-[1fr_0px]",
		)}
	>
		<div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
			<ReaderBody data={data} currentPage={pageNumber} />
		</div>
		<ReaderRail
			textId={textId}
			pageNumber={pageNumber}
			desktopRailExpanded={desktopRailExpanded}
			settingsOpen={settingsOpen}
			notesOpen={notesOpen}
			tocOpen={tocOpen}
			bookmarksOpen={bookmarksOpen}
			onClose={onCloseRail}
			onNavigate={onNavigate}
		/>
	</div>
);
