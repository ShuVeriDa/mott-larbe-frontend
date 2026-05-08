import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";
import { ArrowRight, BookIcon, Check, Sparkles, X, Zap } from "lucide-react";
import Link from "next/link";

export type PlanKey = "free" | "premium" | "pro";

interface PlanCardProps {
	planKey: PlanKey;
	name: string;
	tagline: string;
	price: string;
	priceOld?: string;
	periodSuffix: string;
	foreverLabel: string;
	popularBadge?: string;
	features: string[];
	disabledFeatures?: string[];
	ctaLabel: string;
	ctaHref: string;
}

const ICON_BY_PLAN: Record<PlanKey, React.ReactNode> = {
	free: <BookIcon size={14} strokeWidth={1.6} />,
	premium: <Sparkles size={14} strokeWidth={1.6} />,
	pro: <Zap size={14} strokeWidth={1.6} />,
};

const ICON_BG_BY_PLAN: Record<PlanKey, string> = {
	free: "bg-surf-3 text-t-1",
	premium: "bg-acc-bg text-acc-t",
	pro: "bg-pur-bg text-pur-t",
};

const CTA_BY_PLAN: Record<PlanKey, string> = {
	free: "bg-surf-2 border-hairline border-bd-2 text-t-1 hover:bg-surf-3",
	premium:
		"bg-acc text-white shadow-[0_2px_6px_rgba(34,84,211,0.25)] hover:opacity-[0.92]",
	pro: "bg-pur text-white shadow-[0_2px_6px_rgba(109,78,212,0.3)] hover:opacity-[0.92]",
};

export const PlanCard = ({
	planKey,
	name,
	tagline,
	price,
	priceOld,
	periodSuffix,
	foreverLabel,
	popularBadge,
	features,
	disabledFeatures = [],
	ctaLabel,
	ctaHref,
}: PlanCardProps) => {
	const isFree = planKey === "free";
	const featured = Boolean(popularBadge);

	return (
		<article
			className={cn(
				"relative flex flex-col rounded-[14px] border-hairline bg-surf p-7 max-[640px]:p-[22px]",
				featured
					? "border-acc shadow-lg [box-shadow:0_0_0_4px_rgba(34,84,211,0.12)]"
					: "border-bd-2",
			)}
		>
			{popularBadge ? (
				<Typography
					tag="span"
					className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-acc px-[11px] py-1 text-[10.5px] font-bold uppercase tracking-[0.8px] text-white shadow-[0_2px_6px_rgba(34,84,211,0.3)]"
				>
					{popularBadge}
				</Typography>
			) : null}

			<header className="mb-3.5 flex items-center gap-2.5">
				<Typography
					tag="span"
					className={cn(
						"flex h-7 w-7 items-center justify-center rounded-base",
						ICON_BG_BY_PLAN[planKey],
					)}
					aria-hidden="true"
				>
					{ICON_BY_PLAN[planKey]}
				</Typography>
				<Typography
					tag="h3"
					className="font-display text-[19px] font-semibold text-t-1"
				>
					{name}
				</Typography>
			</header>

			<div className="h-4 text-[13px] text-t-3 line-through">
				{priceOld ?? ""}
			</div>

			<div className="mb-1 mt-1 font-display text-[38px] font-semibold leading-none tracking-[-1px] text-t-1 max-[640px]:text-[32px]">
				{price}{" "}
				<Typography
					tag="span"
					className="font-sans text-[14px] font-normal tracking-normal text-t-3"
				>
					{isFree ? foreverLabel : periodSuffix}
				</Typography>
			</div>

			<Typography className="mb-[22px] mt-1 text-[12.5px] text-t-2">
				{tagline}
			</Typography>

			<ul className="mb-[22px] flex flex-col gap-2.5">
				{features.map(feat => (
					<Typography
						tag="li"
						key={feat}
						className="flex items-start gap-2.5 text-[13px] leading-[1.45] text-t-2"
					>
						<Check
							size={14}
							strokeWidth={2}
							className="mt-0.5 shrink-0 text-grn"
						/>
						{feat}
					</Typography>
				))}
				{disabledFeatures.map(feat => (
					<Typography
						tag="li"
						key={feat}
						className="flex items-start gap-2.5 text-[13px] leading-[1.45] text-t-3"
					>
						<X size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-t-3" />
						{feat}
					</Typography>
				))}
			</ul>

			<Link
				href={ctaHref}
				className={cn(
					"mt-auto inline-flex h-[42px] w-full items-center justify-center gap-1.5 rounded-[9px] border-0 text-[13.5px] font-semibold transition-[opacity,background-color]",
					CTA_BY_PLAN[planKey],
				)}
			>
				{ctaLabel}
				{featured ? <ArrowRight size={13} strokeWidth={2} /> : null}
			</Link>
		</article>
	);
};
