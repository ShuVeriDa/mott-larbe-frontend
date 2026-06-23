import { Bookmark } from "lucide-react";

interface BookmarkMenuIconProps {
	filled: boolean;
}

export const BookmarkMenuIcon = ({ filled }: BookmarkMenuIconProps) => (
	<Bookmark
		className="size-[13px]"
		fill={filled ? "currentColor" : "none"}
	/>
);
