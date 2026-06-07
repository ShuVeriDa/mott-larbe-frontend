import { cn } from "@/shared/lib/cn";

interface KbdShortcutProps {
	keys: string[];
	className?: string;
}

export const KbdShortcut = ({ keys, className }: KbdShortcutProps) => (
	<span className={cn("inline-flex items-center gap-0.5", className)}>
		{keys.map((key, i) => (
			<kbd
				key={i}
				data-slot="kbd"
				className="inline-flex h-4 min-w-[14px] items-center justify-center rounded-[3px] border border-white/20 bg-white/10 px-1 text-[10px] font-medium leading-none text-background/80"
			>
				{key}
			</kbd>
		))}
	</span>
);
