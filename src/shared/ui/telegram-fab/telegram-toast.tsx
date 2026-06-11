"use client";

import { cn } from "@/shared/lib/cn";
import { useTelegramToast } from "./model/use-telegram-toast";
import { TelegramIcon } from "./ui/telegram-icon";

const TG_HREF = "https://t.me/shuverida";

const labels = {
	ru: {
		author: "Этот сайт создал ShuVeriDa",
		heading: "Ваша идея заслуживает хорошего кода",
		cta: "Написать в Telegram",
		close: "Закрыть",
	},
	en: {
		author: "This site was built by ShuVeriDa",
		heading: "Your idea deserves good code",
		cta: "Message on Telegram",
		close: "Close",
	},
	che: {
		author: "Хӏара сайт ShuVeriDa вина",
		heading: "Хьан ойлана дикачу кодан мехала",
		cta: "Telegram чура яза",
		close: "Дӏадаккха",
	},
} as const;

export const TelegramToast = () => {
	const { lang, visible, mounted, handleClose, handleLinkClick } = useTelegramToast();

	if (!mounted) return null;

	const t = labels[lang as keyof typeof labels] ?? labels.ru;

	return (
		<div
			role="dialog"
			aria-label={t.heading}
			aria-modal="false"
			style={{
				transform: visible ? "translateY(0)" : "translateY(calc(100% + 24px))",
				opacity: visible ? 1 : 0,
				transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease",
			}}
			className={cn(
				"fixed bottom-6 left-1/2 z-201 -translate-x-1/2",
				"max-md:bottom-[calc(56px+env(safe-area-inset-bottom)+12px)]",
				"w-[320px] max-w-[calc(100vw-32px)]",
				"rounded-2xl border-[0.5px] border-white/10 bg-[#1a1a1e]/[0.92] backdrop-blur-xl",
				"shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
			)}
		>
			<button
				onClick={handleClose}
				aria-label={t.close}
				className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full text-white/40 transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={2.5}
					strokeLinecap="round"
					className="size-[13px]"
					aria-hidden="true"
				>
					<path d="M18 6 6 18M6 6l12 12" />
				</svg>
			</button>

			<div className="p-4 pb-4 pr-12">
				<div className="mb-3 flex items-center gap-2.5">
					<span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#229ED9]/20">
						<TelegramIcon className="size-[15px] text-[#229ED9]" />
					</span>
					<p className="text-[11.5px] font-medium text-white/50">{t.author}</p>
				</div>

				<p className="mb-4 text-[15px] font-semibold leading-[1.4] text-white">
					{t.heading}
				</p>

				<a
					href={TG_HREF}
					target="_blank"
					rel="noopener noreferrer"
					onClick={handleLinkClick}
					className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#229ED9] text-[13px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#229ED9]/70"
				>
					<TelegramIcon className="size-[14px]" />
					{t.cta}
				</a>
			</div>
		</div>
	);
};
