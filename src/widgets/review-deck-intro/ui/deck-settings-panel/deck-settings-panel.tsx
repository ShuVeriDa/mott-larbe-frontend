"use client";

import { useState } from "react";
import { Settings2Icon } from "lucide-react";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "@/shared/ui/drawer";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/shared/ui/popover";
import { DeckSettingsForm } from "./deck-settings-form";

export const DeckSettingsPanel = () => {
	const { t } = useI18n();
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const handlePopoverSaved = () => setPopoverOpen(false);
	const handleDrawerSaved = () => setDrawerOpen(false);
	const handleDrawerOpenChange = (open: boolean) => setDrawerOpen(open);

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

			{/* Mobile: Drawer from bottom */}
			<div className="md:hidden block">
				<Button
					variant="outline"
					className="h-7 gap-1.5 border-bd-3 bg-surf-2 px-2.5 text-[12px] text-t-1 hover:bg-surf-3 hover:text-t-1"
					onClick={() => setDrawerOpen(true)}
				>
					<Settings2Icon className="size-3.5 text-t-2" />
					{t("review.deck.intro.settings.title")}
				</Button>
				<Drawer open={drawerOpen} onOpenChange={handleDrawerOpenChange}>
					<DrawerContent aria-describedby={undefined}>
						<DrawerTitle className="sr-only">
							{t("review.deck.intro.settings.title")}
						</DrawerTitle>
						<DrawerHeader className="not-sr-only border-b-0 pb-0">
							<span className="text-[15px] font-semibold text-t-1">
								{t("review.deck.intro.settings.title")}
							</span>
						</DrawerHeader>
						<div className="overflow-y-auto px-5 pb-[calc(56px+1.5rem+env(safe-area-inset-bottom))] pt-4">
							<DeckSettingsForm onSaved={handleDrawerSaved} />
						</div>
					</DrawerContent>
				</Drawer>
			</div>
		</>
	);
};
