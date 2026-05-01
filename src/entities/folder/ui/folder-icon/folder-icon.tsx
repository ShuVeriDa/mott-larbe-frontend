import {
	BookOpen,
	Compass,
	Flame,
	Globe,
	Leaf,
	Sparkles,
	Star,
	Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { isFolderIconKey, type FolderIconKey } from "../../lib/folder-presets";

const ICON_MAP: Record<FolderIconKey, LucideIcon> = {
	book: BookOpen,
	leaf: Leaf,
	users: Users,
	star: Star,
	globe: Globe,
	sparkles: Sparkles,
	compass: Compass,
	flame: Flame,
};

export interface FolderIconProps {
	icon: string | null | undefined;
	className?: string;
}

export const FolderIcon = ({ icon, className }: FolderIconProps) => {
	const key: FolderIconKey = isFolderIconKey(icon) ? icon : "book";
	const Icon = ICON_MAP[key];
	return <Icon className={cn("size-4", className)} strokeWidth={1.6} />;
};
