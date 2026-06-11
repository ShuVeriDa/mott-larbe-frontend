"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

const STACK_ITEMS = [
	{ label: "Next.js 16", category: "frontend" },
	{ label: "React 19", category: "frontend" },
	{ label: "TypeScript", category: "frontend" },
	{ label: "Tailwind CSS v4", category: "frontend" },
	{ label: "TanStack Query v5", category: "frontend" },
	{ label: "Zustand v5", category: "frontend" },
	{ label: "shadcn/ui", category: "frontend" },
	{ label: "Node.js", category: "backend" },
	{ label: "NestJS", category: "backend" },
	{ label: "PostgreSQL", category: "backend" },
	{ label: "Prisma", category: "backend" },
	{ label: "Redis", category: "backend" },
	{ label: "Docker", category: "infra" },
] as const;

const CATEGORY_COLORS: Record<string, string> = {
	frontend: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
	backend: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
	infra: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

export const DeveloperPageStack = () => {
	const { t } = useI18n();

	return (
		<section className="border-t border-[0.5px] border-bd-1 py-14 max-[640px]:py-10">
			<div className="mx-auto w-full max-w-[760px] px-7 max-[640px]:px-[18px]">
				<Typography
					tag="h2"
					className="mb-6 text-[13px] font-bold uppercase tracking-[1px] text-t-3"
				>
					{t("landing.aboutPage.stack.title")}
				</Typography>

				<div className="flex flex-wrap gap-2">
					{STACK_ITEMS.map(({ label, category }) => (
						<span
							key={label}
							className={`rounded-full px-3 py-1 text-[12.5px] font-medium ${CATEGORY_COLORS[category]}`}
						>
							{label}
						</span>
					))}
				</div>
			</div>
		</section>
	);
};
