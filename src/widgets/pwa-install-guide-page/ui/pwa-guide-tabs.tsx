"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { TabBar, TabItem, Tabs } from "@/shared/ui/tabs";
import { variants } from "@/shared/lib/animation";

import { usePwaGuideTabs } from "../model/use-pwa-guide-tabs";
import type { PwaGuideTab, PwaGuideTabsText } from "../model/types";

interface PwaGuideTabsProps {
	labels: PwaGuideTabsText;
	content: Record<PwaGuideTab, ReactNode>;
}

export const PwaGuideTabs = ({ labels, content }: PwaGuideTabsProps) => {
	const { tab, handleTabChange } = usePwaGuideTabs();

	return (
		<Tabs value={tab} onValueChange={handleTabChange}>
			<TabBar className="mb-6 flex-wrap">
				<TabItem value="ios">{labels.ios}</TabItem>
				<TabItem value="android">{labels.android}</TabItem>
				<TabItem value="desktop">{labels.desktop}</TabItem>
			</TabBar>

			<AnimatePresence mode="wait">
				<motion.div
					key={tab}
					variants={variants.fadeIn}
					initial="hidden"
					animate="visible"
					exit="exit"
				>
					{content[tab]}
				</motion.div>
			</AnimatePresence>
		</Tabs>
	);
};
