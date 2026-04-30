"use client";

import type { DetailSense } from "@/entities/dictionary";
import { useI18n } from "@/shared/lib/i18n";
import { CardSection } from "../card-section";

export interface SensesSectionProps {
	senses: DetailSense[];
}

export const SensesSection = ({ senses }: SensesSectionProps) => {
	const { t } = useI18n();

	return (
		<CardSection title={t("vocabulary.wordDetail.sections.senses")}>
			{senses.length === 0 ? (
				<p className="text-[12.5px] text-t-3">
					{t("vocabulary.wordDetail.senses.empty")}
				</p>
			) : (
				<ol className="flex flex-col">
					{senses.map((sense, idx) => (
						<li
							key={sense.id}
							className="border-b border-hairline border-bd-1 py-2.5 first:pt-0 last:border-b-0 last:pb-0"
						>
							<div className="mb-1 text-[10px] font-bold text-t-4">
								{idx + 1}
							</div>
							<div className="mb-1.5 text-[14px] font-medium text-t-1 max-md:text-[13px]">
								{sense.definition}
							</div>
							{sense.examples.length > 0 ? (
								<div className="flex flex-col gap-1.5">
									{sense.examples.map((ex) => (
										<div
											key={ex.id}
											className="rounded-[7px] border-l-2 border-bd-2 bg-surf-2 px-2.5 py-2"
										>
											<p className="mb-0.5 text-[13px] italic leading-[1.55] text-t-1 max-md:text-[12.5px]">
												«{ex.text}»
											</p>
											{ex.translation ? (
												<p className="text-[12px] leading-[1.45] text-t-3">
													{ex.translation}
												</p>
											) : null}
											{ex.origin ? (
												<p className="mt-[3px] text-[11px] text-t-4">
													{ex.origin}
												</p>
											) : null}
										</div>
									))}
								</div>
							) : null}
						</li>
					))}
				</ol>
			)}
		</CardSection>
	);
};
