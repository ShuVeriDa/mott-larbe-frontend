"use client";

import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { X } from "lucide-react";
import { useTelegramFab } from "./model/use-telegram-fab";
import { TelegramIcon } from "./ui/telegram-icon";

const TG_HREF = "https://t.me/shuverida";

const labels = {
	ru:  { open: "Написать разработчику в Telegram", close: "Закрыть", cta: "Есть идея? Реализуем" },
	en:  { open: "Message the developer on Telegram", close: "Close", cta: "Have an idea? Let's build it" },
	che: { open: "Telegram чура яздан разработчике", close: "Дӏадаккха", cta: "Хьан ойла яьссачохь?" },
} as const;

export const TelegramFab = () => {
	const {
		isAdmin,
		isReader,
		isAppShell,
		lang,
		expanded,
		idle,
		handleMouseEnter,
		handleMouseLeave,
		handleIconClick,
		handleClose,
	} = useTelegramFab();

	const t = labels[lang as keyof typeof labels] ?? labels.ru;

	if (isAdmin) return null;

	return (
		<div
			className={cn(
				"fixed bottom-6 z-200",
				isAppShell && "md:hidden",
				isReader
					? "left-4 max-md:bottom-[calc(56px+env(safe-area-inset-bottom)+12px)]"
					: "right-6 max-md:bottom-[calc(56px+env(safe-area-inset-bottom)+12px)] max-md:right-4",
			)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{/* idle pulse ring */}
			<span
				aria-hidden="true"
				className={cn(
					"pointer-events-none absolute inset-0 rounded-full bg-[#229ED9]",
					idle && !expanded ? "animate-ping opacity-20" : "opacity-0",
				)}
			/>

			<div
				style={{
					boxShadow: expanded
						? "0 6px 24px rgba(34,158,217,0.55), 0 2px 6px rgba(34,158,217,0.2)"
						: "0 2px 12px rgba(34,158,217,0.4)",
					width: expanded ? "210px" : "36px",
					height: "36px",
					transitionProperty: "box-shadow, width",
					transitionDuration: expanded ? "0.55s, 0.6s" : "0.45s, 0.5s",
					transitionTimingFunction: expanded
						? "ease, cubic-bezier(0.34,1.56,0.64,1)"
						: "ease, cubic-bezier(0.25,0.46,0.45,0.94)",
				}}
				className="relative flex items-center justify-between overflow-hidden rounded-full bg-[#229ED9] text-white"
			>
				<div className="relative flex items-center">
					{/* на touch — кнопка раскрывает FAB; на desktop — декоративная обёртка для иконки */}
					<Button
						variant="bare"
						size="bare"
						onClick={handleIconClick}
						aria-label={t.open}
						aria-expanded={expanded}
						tabIndex={0}
						className="flex size-9 shrink-0 items-center justify-center focus-visible:ring-white/40 active:scale-95"
					>
						<TelegramIcon className="size-[16px]" />
					</Button>

					<a
						href={TG_HREF}
						target="_blank"
						rel="noopener noreferrer"
						tabIndex={expanded ? 0 : -1}
						aria-hidden={!expanded}
						style={{
							maxWidth: expanded ? "140px" : "0px",
							opacity: expanded ? 1 : 0,
							transition: expanded
								? "max-width 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.45s ease 0.1s"
								: "max-width 0.45s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.2s ease",
						}}
						className="overflow-hidden whitespace-nowrap text-[12.5px] font-semibold leading-none text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
					>
						{t.cta}
					</a>
				</div>

				<Button
					variant="bare"
					size="bare"
					onClick={handleClose}
					tabIndex={expanded ? 0 : -1}
					aria-label={t.close}
					aria-hidden={!expanded}
					style={{
						width: expanded ? "36px" : "0px",
						opacity: expanded ? 1 : 0,
						transition: expanded
							? "width 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease 0.15s"
							: "width 0.45s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.15s ease",
					}}
					className="flex shrink-0 items-center justify-center overflow-hidden text-white/70 hover:text-white focus-visible:ring-white/40 active:scale-95"
				>
					<X size={16} strokeWidth={2.5} aria-hidden="true" />
				</Button>
			</div>
		</div>
	);
};
