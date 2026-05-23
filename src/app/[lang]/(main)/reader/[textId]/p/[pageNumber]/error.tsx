"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";

interface ReaderErrorPageProps {
	error: Error & { digest?: string };
	reset: () => void;
}

const ReaderErrorPage = ({ reset }: ReaderErrorPageProps) => {
	const { t } = useI18n();
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-4 p-10">
			<p className="text-sm text-t-2">{t("reader.states.error")}</p>
			<Button variant="outline" onClick={reset}>
				{t("shared.retry")}
			</Button>
		</div>
	);
};

export default ReaderErrorPage;
