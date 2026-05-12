import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";
import { Minimize2 } from "lucide-react";

interface ReaderFocusExitButtonProps {
	onExit: () => void;
}

export const ReaderFocusExitButton = ({ onExit }: ReaderFocusExitButtonProps) => {
	const { t } = useI18n();
	return (
		<Button
			onClick={onExit}
			variant="bare"
			size="bare"
			aria-label={t("reader.topbar.focusMode")}
			className="fixed right-4 z-[95] inline-flex size-9 items-center justify-center rounded-full bg-surf shadow-md text-t-3 transition-colors hover:text-t-1 bottom-4 max-md:bottom-[calc(56px+env(safe-area-inset-bottom)+12px)]"
		>
			<Minimize2 className="size-[15px]" strokeWidth={1.4} />
		</Button>
	);
};
