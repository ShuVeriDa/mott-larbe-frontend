"use client";

import { useState } from "react";
import { Settings2Icon } from "lucide-react";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/shared/ui/popover";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/ui/sheet";
import { DeckSettingsForm } from "./deck-settings-form";

export const DeckSettingsPanel = () => {
	const { t } = useI18n();
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [sheetOpen, setSheetOpen] = useState(false);

	const handlePopoverSaved = () => setPopoverOpen(false);
	const handleSheetSaved = () => setSheetOpen(false);

	const trigger = (
		<Button variant="outline" className="h-7 gap-1.5 border-bd-3 bg-surf-2 px-2.5 text-[12px] text-t-1 hover:bg-surf-3 hover:text-t-1">
			<Settings2Icon className="size-3.5 text-t-2" />
			{t("review.deck.intro.settings.title")}
		</Button>
	);

	return (
		<>
			{/* Desktop: Popover */}
			<div className="md:block hidden">
				<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
					<PopoverTrigger asChild>{trigger}</PopoverTrigger>
					<PopoverContent
						align="start"
						className="w-72"
						sideOffset={8}
					>
						<DeckSettingsForm onSaved={handlePopoverSaved} />
					</PopoverContent>
				</Popover>
			</div>

			{/* Mobile: Sheet from bottom */}
			<div className="md:hidden block">
				<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
					<SheetTrigger asChild>{trigger}</SheetTrigger>
					<SheetContent side="bottom" className="rounded-t-xl px-5 pb-[calc(56px+1.5rem+env(safe-area-inset-bottom))] pt-0">
						<SheetHeader className="px-0 pb-4 pt-5">
							<SheetTitle className="text-[15px]">
								{t("review.deck.intro.settings.title")}
							</SheetTitle>
						</SheetHeader>
						<DeckSettingsForm onSaved={handleSheetSaved} />
					</SheetContent>
				</Sheet>
			</div>
		</>
	);
};
