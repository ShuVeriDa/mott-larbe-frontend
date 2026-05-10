import { Button } from "@/shared/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Typography } from "@/shared/ui/typography";
import { Keyboard } from "lucide-react";
import type { AdminTextEditorShortcut } from "./model/get-admin-text-editor-shortcuts";

interface AdminTextEditorShortcutsMenuProps {
	shortcuts: AdminTextEditorShortcut[];
	buttonLabel: string;
	title: string;
	iconOnly?: boolean;
}

export const AdminTextEditorShortcutsMenu = ({
	shortcuts,
	buttonLabel,
	title,
	iconOnly = false,
}: AdminTextEditorShortcutsMenuProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="default"
					className={
						iconOnly
							? "h-7 w-7 px-0 text-[11px] data-[state=open]:bg-surf-2"
							: "h-7 gap-1.5 px-2 text-[11px] data-[state=open]:bg-surf-2"
					}
					title={buttonLabel}
					aria-label={buttonLabel}
				>
					<Keyboard className="size-3.5" />
					{iconOnly ? null : buttonLabel}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-auto min-w-[320px] max-w-[min(92vw,420px)] overflow-hidden rounded-[10px] border border-bd-2 bg-surf py-1 shadow-lg ring-0"
			>
				<Typography
					tag="p"
					className="px-1 pb-2 text-[11px] font-medium uppercase tracking-[0.04em] text-t-3"
				>
					{title}
				</Typography>
				<div className="flex flex-col gap-0.5">
					{shortcuts.map(shortcut => (
						<div
							key={`${shortcut.combo}-${shortcut.label}`}
							className="flex items-center gap-2.5 rounded-[6px] px-1 py-1"
						>
							<kbd className="inline-flex shrink-0 items-center rounded-[4px] border border-bd-2 bg-surf px-[5px] py-px font-[inherit] text-[10px] font-medium text-t-2 shadow-[0_1px_0_0] shadow-bd-2">
								{shortcut.combo}
							</kbd>
							<Typography tag="span" className="text-[12px] text-t-2">
								{shortcut.label}
							</Typography>
						</div>
					))}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
