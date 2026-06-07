export const AVATAR_COLORS = [
	"bg-acc-bg text-acc-t",
	"bg-grn-bg text-grn-t",
	"bg-pur-bg text-pur-t",
	"bg-amb-bg text-amb-t",
	"bg-ros-bg text-ros-t",
] as const;

export const getAvColor = (id: string): string =>
	AVATAR_COLORS[id.charCodeAt(0) % AVATAR_COLORS.length];
