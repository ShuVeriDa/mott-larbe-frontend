"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";

const PROJECTS = [
	{
		key: "mottlarbe",
		url: "https://mottlarbe.com",
		tags: ["Next.js", "NestJS", "PostgreSQL", "NLP"],
		color: "bg-blue-500/10",
	},
	{
		key: "dosham",
		url: "https://dosham.ru",
		tags: ["Next.js", "NestJS", "PostgreSQL"],
		color: "bg-emerald-500/10",
	},
] as const;

export const DeveloperPageProjects = () => {
	const { t } = useI18n();

	return (
		<section className="border-t border-[0.5px] border-bd-1 py-14 max-[640px]:py-10">
			<div className="mx-auto w-full max-w-[760px] px-7 max-[640px]:px-[18px]">
				<Typography
					tag="h2"
					className="mb-6 text-[13px] font-bold uppercase tracking-[1px] text-t-3"
				>
					{t("landing.aboutPage.projects.title")}
				</Typography>

				<div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
					{PROJECTS.map(({ key, url, tags, color }) => (
						<Link
							key={key}
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							className="group flex flex-col gap-3 rounded-xl border-[0.5px] border-bd-2 bg-surf-2 p-5 transition-colors hover:border-acc/40 hover:bg-surf-3"
						>
							<div className={`w-fit rounded-lg px-2.5 py-1.5 ${color}`}>
								<Typography
									tag="span"
									className="text-[13px] font-semibold text-t-1"
								>
									{t(`landing.aboutPage.projects.${key}.name`)}
								</Typography>
							</div>
							<Typography className="text-[13px] leading-[1.55] text-t-2">
								{t(`landing.aboutPage.projects.${key}.desc`)}
							</Typography>
							<div className="flex flex-wrap gap-1.5">
								{tags.map((tag) => (
									<span
										key={tag}
										className="rounded-full bg-surf-3 px-2.5 py-0.5 text-[11px] text-t-3"
									>
										{tag}
									</span>
								))}
							</div>
							<Typography
								tag="span"
								className="mt-auto text-[12px] text-t-3 transition-colors group-hover:text-acc"
							>
								{url.replace("https://", "")} →
							</Typography>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
};
