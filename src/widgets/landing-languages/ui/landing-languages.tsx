"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface LanguageItem {
	name: string;
	native: string;
	tag: string;
	desc: string;
	s1v: string;
	s1l: string;
	s2v: string;
	s2l: string;
	s3v: string;
	s3l: string;
}

export const LandingLanguages = () => {
	const { t, dict } = useI18n();

	const items =
		(
			dict as unknown as {
				landing?: { languages?: { items?: LanguageItem[] } };
			}
		).landing?.languages?.items ?? [];

	return (
		<section
			id="languages"
			className="px-7 py-[88px] max-[900px]:px-[22px] max-[900px]:py-16 max-[640px]:px-[18px] max-[640px]:py-14"
			aria-labelledby="languages-title"
		>
			<div className="mx-auto w-full max-w-[1120px]">
				<header className="mb-12 text-center max-[640px]:mb-9">
					<Typography
						tag="span"
						className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-acc-bg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[1.2px] text-acc-t"
					>
						{t("landing.languages.eyebrow")}
					</Typography>
					<Typography
						tag="h2"
						id="languages-title"
						className="mx-auto max-w-[720px] font-display text-[38px] font-semibold leading-[1.15] tracking-[-0.7px] text-t-1 max-[900px]:text-[32px] max-[640px]:text-[26px] max-[640px]:tracking-[-0.5px]"
					>
						{t("landing.languages.title")}
					</Typography>
					<Typography className="mx-auto mt-3.5 max-w-[540px] text-base leading-[1.55] text-t-2 max-[640px]:text-[14.5px]">
						{t("landing.languages.sub")}
					</Typography>
				</header>

				<div className="grid grid-cols-2 gap-6 max-[640px]:grid-cols-1">
					{items.map(item => (
						<article
							key={item.tag}
							className="rounded-[16px] border-hairline border-bd-2 bg-surf p-7"
						>
							<div className="mb-4 flex items-start justify-between gap-3">
								<div>
									<Typography
										tag="h3"
										className="font-display text-[22px] font-semibold text-t-1"
									>
										{item.name}
									</Typography>
									<Typography className="text-[13.5px] text-t-3">
										{item.native}
									</Typography>
								</div>
								<Typography tag="span" className="rounded-base border-hairline border-bd-2 bg-surf-2 px-2.5 py-1 font-mono text-[12px] font-semibold text-t-2">
									{item.tag}
								</Typography>
							</div>
							<Typography className="mb-6 text-[14px] leading-[1.6] text-t-2">
								{item.desc}
							</Typography>
							<div className="grid grid-cols-3 gap-3">
								{(
									[
										[item.s1v, item.s1l],
										[item.s2v, item.s2l],
										[item.s3v, item.s3l],
									] as const
								).map(([val, label]) => (
									<div
										key={label}
										className="rounded-[10px] bg-bg px-3 py-3 text-center"
									>
										<div className="font-display text-[17px] font-semibold text-t-1">
											{val}
										</div>
										<div className="mt-0.5 text-[11.5px] text-t-3">{label}</div>
									</div>
								))}
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
};
