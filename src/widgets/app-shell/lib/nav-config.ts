import {
	BookOpen,
	ChartNoAxesCombined,
	House,
	RefreshCw,
	WholeWord,
} from "lucide-react";

interface NavItem {
	href: (lang: string) => string;
	icon: React.ComponentType<{ className?: string }>;
	labelKey: string;
}

interface NavSection {
	titleKey: string;
	items: NavItem[];
}

export const buildNavSections = (lang: string): NavSection[] => [
	{
		titleKey: "nav.learning",
		items: [
			{
				href: () => `/${lang}/dashboard`,
				icon: House,
				labelKey: "nav.home",
			},
			{
				href: () => `/${lang}/vocabulary`,
				icon: WholeWord,
				labelKey: "nav.vocabulary",
			},
			{
				href: () => `/${lang}/phrasebook`,
				icon: BookOpen,
				labelKey: "nav.phrasebook",
			},
			{
				href: () => `/${lang}/review`,
				icon: RefreshCw,
				labelKey: "nav.review",
			},
			{
				href: () => `/${lang}/progress`,
				icon: ChartNoAxesCombined,
				labelKey: "nav.progress",
			},
		],
	},
	// {
	// 	titleKey: "nav.language",
	// 	items: [
	// 		{
	// 			href: () => `/${lang}/language/chechen`,
	// 			icon: ChechenIcon,
	// 			labelKey: "nav.chechen",
	// 		},
	// 		{
	// 			href: () => `/${lang}/language/grammar`,
	// 			icon: GrammarIcon,
	// 			labelKey: "nav.grammar",
	// 		},
	// 	],
	// },
];
