import { Typography } from "@/shared/ui/typography";
type Translator = (key: string) => string;

export const FeedbackEmptyState = ({ t }: { t: Translator }) => (
	<div className="flex flex-1 flex-col items-center justify-center gap-2 max-sm:hidden">
		<div className="flex size-12 items-center justify-center rounded-xl bg-surf-2">
			<svg
				viewBox="0 0 20 20"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.3"
				className="size-6 text-t-3"
			>
				<path
					d="M16.5 13H10.5l-4 3.5V13H4a1.5 1.5 0 01-1.5-1.5V4.5A1.5 1.5 0 014 3h12a1.5 1.5 0 011.5 1.5v8A1.5 1.5 0 0116.5 13z"
					strokeLinejoin="round"
				/>
			</svg>
		</div>
		<Typography tag="p" className="text-[13px] text-t-3">{t("admin.feedback.selectTicket")}</Typography>
	</div>
);
