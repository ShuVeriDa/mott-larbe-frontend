"use client";

import { ChevronLeft } from "lucide-react";
import { TabBar, TabContent, TabItem, Tabs } from "@/shared/ui/tabs";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";
import { useScriptGuidePage } from "../model/use-script-guide-page";
import { ArabicConsonantsSection } from "./arabic-consonants-section";
import { ArabicExamplesSection } from "./arabic-examples-section";
import { ArabicRulesSection } from "./arabic-rules-section";
import { ArabicVowelsSection } from "./arabic-vowels-section";
import { ArabicWhySection } from "./arabic-why-section";
import { GuideToc } from "./guide-toc";
import { LatinAlphabetSection } from "./latin-alphabet-section";
import { LatinExamplesSection } from "./latin-examples-section";
import { LatinRulesSection } from "./latin-rules-section";

export const ScriptGuidePage = () => {
	const { t, lang, tab, handleTabChange, arabicToc, latinToc } = useScriptGuidePage();

	return (
		<main className="h-full overflow-y-auto bg-panel">
			<div className="mx-auto max-w-5xl px-4 py-8 pb-20 sm:px-6 lg:px-8">
				<Link
					href={`/${lang}/texts`}
					className="mb-6 inline-flex items-center gap-1.5 rounded-base px-2 py-1 -ml-2 text-sm text-t-3 transition-colors duration-100 hover:bg-surf-2 hover:text-t-1"
				>
					<ChevronLeft className="size-3.5" aria-hidden="true" />
					{t("scriptGuide.backToTexts")}
				</Link>

				<Typography tag="h1" size="2xl" className="mb-1 font-bold text-t-1">
					{t("scriptGuide.pageTitle")}
				</Typography>
				<Typography tag="p" size="sm" className="mb-6 text-t-3">
					{t("scriptGuide.pageSubtitle")}
				</Typography>

				<Tabs value={tab} onValueChange={handleTabChange}>
					<TabBar className="mb-8 flex-wrap">
						<TabItem value="arabic">
							{t("reader.settings.script.arabic")} —{" "}
							{t("scriptGuide.arabic.shortTitle")}
						</TabItem>
						<TabItem value="latin">
							{t("reader.settings.script.latin")} —{" "}
							{t("scriptGuide.latin.shortTitle")}
						</TabItem>
					</TabBar>

					<TabContent value="arabic">
						<div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-10">
							<aside className="hidden lg:block">
								<GuideToc items={arabicToc} variant="sidebar" />
							</aside>
							<div>
								<div className="mb-6 lg:hidden">
									<GuideToc items={arabicToc} variant="pills" />
								</div>
								<ArabicWhySection />
								<ArabicRulesSection />
								<ArabicConsonantsSection />
								<ArabicVowelsSection />
								<ArabicExamplesSection />
							</div>
						</div>
					</TabContent>

					<TabContent value="latin">
						<div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-10">
							<aside className="hidden lg:block">
								<GuideToc items={latinToc} variant="sidebar" />
							</aside>
							<div>
								<div className="mb-6 lg:hidden">
									<GuideToc items={latinToc} variant="pills" />
								</div>
								<LatinRulesSection />
								<LatinAlphabetSection />
								<LatinExamplesSection />
							</div>
						</div>
					</TabContent>
				</Tabs>
			</div>
		</main>
	);
};
