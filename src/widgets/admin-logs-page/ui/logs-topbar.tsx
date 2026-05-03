"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";

interface LogsTopbarProps {
	isLive: boolean;
	onToggleLive: () => void;
	onExport: () => void;
}

export const LogsTopbar = ({ isLive, onToggleLive, onExport }: LogsTopbarProps) => {
	const { t } = useI18n();

	return (
		<div className="sticky top-0 z-10 flex items-center gap-2.5 border-b border-bd-1 bg-bg px-5 py-3.5 transition-colors">
			<div className="min-w-0 flex-1">
				<div className="font-display text-base font-medium text-t-1">
					{t("admin.logs.title")}
				</div>
				<div className="text-[11px] text-t-3">{t("admin.logs.subtitle")}</div>
			</div>

			<div className="ml-auto flex items-center gap-2">
				<span
					className={cn(
						"inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-semibold transition-opacity",
						"bg-grn-bg text-grn-t",
						!isLive && "opacity-40",
					)}
				>
					<span
						className={cn(
							"size-1.5 rounded-full bg-grn",
							isLive && "animate-[pulse_1.6s_ease-in-out_infinite]",
						)}
					/>
					<span>{t("admin.logs.live")}</span>
				</span>

				<button
					type="button"
					onClick={onToggleLive}
					className="flex h-[30px] items-center gap-1.5 rounded-[7px] border border-bd-2 bg-surf px-3 text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
				>
					<svg
						width="13"
						height="13"
						viewBox="0 0 16 16"
						fill="none"
						className="shrink-0"
					>
						{isLive ? (
							<>
								<rect x="4" y="3" width="3" height="10" rx="1" fill="currentColor" />
								<rect x="9" y="3" width="3" height="10" rx="1" fill="currentColor" />
							</>
						) : (
							<path
								d="M5 3.5l8 4.5-8 4.5V3.5z"
								fill="currentColor"
							/>
						)}
					</svg>
					{isLive ? t("admin.logs.pause") : t("admin.logs.resume")}
				</button>

				<button
					type="button"
					onClick={onExport}
					className="flex h-[30px] items-center gap-1.5 rounded-[7px] border border-bd-2 bg-surf px-3 text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
				>
					<svg
						width="13"
						height="13"
						viewBox="0 0 16 16"
						fill="none"
						className="shrink-0"
					>
						<path
							d="M3 10v2a1 1 0 001 1h8a1 1 0 001-1v-2M8 3v7M5 7l3 3 3-3"
							stroke="currentColor"
							strokeWidth="1.3"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					{t("admin.logs.export")}
				</button>
			</div>
		</div>
	);
};
