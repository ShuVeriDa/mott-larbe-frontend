import { cn } from "@/shared/lib/cn";

type AvatarColor = "blue" | "purple" | "green" | "amber" | "rose" | "neutral";

const colorMap: Record<AvatarColor, string> = {
	blue: "bg-acc-bg text-acc-t",
	purple: "bg-pur-bg text-pur-t",
	green: "bg-grn-bg text-grn-t",
	amber: "bg-amb-bg text-amb-t",
	rose: "bg-ros-bg text-ros-t",
	neutral: "bg-surf-3 text-t-2",
};

const getInitials = (name: string, surname: string): string => {
	const n = name.trim()[0] ?? "";
	const s = surname.trim()[0] ?? "";
	return (n + s).toUpperCase();
};

const getColor = (name: string, surname: string): AvatarColor => {
	const colors: AvatarColor[] = [
		"blue",
		"purple",
		"green",
		"amber",
		"rose",
		"neutral",
	];
	const seed = (name.charCodeAt(0) ?? 0) + (surname.charCodeAt(0) ?? 0);
	return colors[seed % colors.length];
};

interface UserAvatarProps {
	name: string;
	surname: string;
	size?: "sm" | "md";
	faded?: boolean;
}

export const UserAvatar = ({
	name,
	surname,
	size = "sm",
	faded,
}: UserAvatarProps) => {
	const color = getColor(name, surname);
	const initials = getInitials(name, surname);

	return (
		<div
			className={cn(
				"flex shrink-0 items-center justify-center rounded-full font-bold uppercase",
				size === "sm" ? "size-7 text-[10px]" : "size-10 text-[13px]",
				colorMap[color],
				faded && "opacity-50",
			)}
		>
			{initials}
		</div>
	);
};
