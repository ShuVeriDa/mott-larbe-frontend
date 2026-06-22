"use client";

import { Send } from "lucide-react";
import { motion } from "framer-motion";

const TG_HREF = "https://t.me/shuverida";

const services = ["Сайты", "Приложения", "SaaS", "Боты"] as const;

export const DeveloperCard = () => (
	<motion.a
		href={TG_HREF}
		target="_blank"
		rel="noopener noreferrer"
		whileHover={{ y: -2 }}
		whileTap={{ scale: 0.985 }}
		transition={{ type: "spring", stiffness: 400, damping: 30 }}
		className="group relative mt-8 block overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#229ED9]/60 focus-visible:ring-offset-2"
		aria-label="Связаться с разработчиком в Telegram"
	>
		{/* gradient background */}
		<div
			className="absolute inset-0 bg-gradient-to-br from-[#229ED9]/10 via-[#229ED9]/5 to-transparent transition-opacity duration-300 ease-out group-hover:opacity-150"
			aria-hidden="true"
		/>

		{/* border */}
		<div
			className="absolute inset-0 rounded-2xl border-[0.5px] border-[#229ED9]/20 transition-colors duration-300 ease-out group-hover:border-[#229ED9]/40"
			aria-hidden="true"
		/>

		<div className="relative flex flex-col gap-4 p-5 max-sm:p-4">
			{/* header row */}
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-center gap-3">
					<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#229ED9]/15 transition-colors duration-200 ease-out group-hover:bg-[#229ED9]/25">
						<svg
							viewBox="0 0 24 24"
							fill="currentColor"
							className="size-[18px] text-[#229ED9]"
							aria-hidden="true"
						>
							<path d="M21.94 4.4l-3.04 14.36c-.23 1.02-.83 1.27-1.68.79l-4.65-3.43-2.24 2.16c-.25.25-.46.46-.94.46l.34-4.74L18.4 6.2c.38-.34-.08-.53-.59-.19L7.07 12.7l-4.69-1.47c-1.02-.32-1.04-1.02.21-1.51L20.65 3.13c.85-.32 1.6.2 1.29 1.27z" />
						</svg>
					</span>
					<div>
						<p className="text-[11px] font-medium text-t-3">Этот сайт создал</p>
						<p className="text-[14px] font-semibold text-t-1">ShuVeriDa</p>
					</div>
				</div>

				<span className="flex items-center gap-1.5 rounded-full bg-[#229ED9]/10 px-2.5 py-1 text-[10.5px] font-semibold text-[#229ED9] transition-colors duration-200 ease-out group-hover:bg-[#229ED9]/18">
					<span className="size-1.5 rounded-full bg-[#229ED9]" aria-hidden="true" />
					Открыт к заказам
				</span>
			</div>

			{/* pitch */}
			<div>
				<p className="text-[14.5px] font-semibold leading-snug text-t-1 max-sm:text-[13.5px]">
					Ваша идея заслуживает хорошего кода
				</p>
				<p className="mt-1 text-[12.5px] leading-relaxed text-t-3 max-sm:text-[12px]">
					Разрабатываю с нуля — от идеи до готового продукта. Без шаблонов, только чистый код.
				</p>
			</div>

			{/* service tags */}
			<div className="flex flex-wrap gap-1.5" role="list" aria-label="Направления">
				{services.map(s => (
					<span
						key={s}
						role="listitem"
						className="rounded-lg bg-surf-3 px-2.5 py-1 text-[11px] font-medium text-t-2 transition-colors duration-200 ease-out group-hover:bg-[#229ED9]/8 group-hover:text-[#229ED9]"
					>
						{s}
					</span>
				))}
			</div>

			{/* cta */}
			<div className="flex items-center gap-2 text-[13px] font-semibold text-[#229ED9] transition-colors duration-200 ease-out group-hover:text-[#1a8cbf]">
				<Send size={13} aria-hidden="true" />
				Написать в Telegram →
			</div>
		</div>
	</motion.a>
);
