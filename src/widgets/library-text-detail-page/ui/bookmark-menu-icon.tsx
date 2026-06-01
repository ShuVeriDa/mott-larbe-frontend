interface BookmarkMenuIconProps {
	filled: boolean;
}

export const BookmarkMenuIcon = ({ filled }: BookmarkMenuIconProps) => (
	<svg
		width="13"
		height="13"
		viewBox="0 0 16 16"
		fill={filled ? "currentColor" : "none"}
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M4 2h8a1 1 0 0 1 1 1v11l-5-3-5 3V3a1 1 0 0 1 1-1z" />
	</svg>
);
