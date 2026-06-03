"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";

interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

// Error boundary for the my-texts route segment.
// Shows localized message + reset button so user can recover without full reload.
const MyTextsError = ({ reset }: ErrorProps) => (
	<div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
		<Typography tag="p" className="text-[13px] text-t-2">
			Что-то пошло не так
		</Typography>
		<Button type="button" variant="outline" onClick={reset}>
			Попробовать снова
		</Button>
	</div>
);

export default MyTextsError;
