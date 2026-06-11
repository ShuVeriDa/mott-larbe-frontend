"use client";

const TG_HREF = "https://t.me/shuverida";

export const DeveloperCard = () => (
	<a
		href={TG_HREF}
		target="_blank"
		rel="noopener noreferrer"
		className="group mt-8 flex items-center gap-3.5 rounded-2xl border-[0.5px] border-bd-1 bg-surf-2 p-4 transition-colors hover:border-[#229ED9]/40 hover:bg-surf-3"
	>
		<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#229ED9]/12 transition-colors group-hover:bg-[#229ED9]/22">
			<svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px] text-[#229ED9]" aria-hidden="true">
				<path d="M21.94 4.4l-3.04 14.36c-.23 1.02-.83 1.27-1.68.79l-4.65-3.43-2.24 2.16c-.25.25-.46.46-.94.46l.34-4.74L18.4 6.2c.38-.34-.08-.53-.59-.19L7.07 12.7l-4.69-1.47c-1.02-.32-1.04-1.02.21-1.51L20.65 3.13c.85-.32 1.6.2 1.29 1.27z" />
			</svg>
		</span>

		<div className="min-w-0 flex-1">
			<p className="text-[11px] font-medium text-t-3">
				Этот сайт создал ShuVeriDa
			</p>
			<p className="text-[13px] font-semibold text-t-1">
				Ваша идея заслуживает хорошего кода
			</p>
			<p className="mt-0.5 text-[11.5px] text-[#229ED9]/80 transition-colors group-hover:text-[#229ED9]">
				Есть идея? Реализуем →
			</p>
		</div>
	</a>
);
