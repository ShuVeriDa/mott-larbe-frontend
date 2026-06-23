interface SwipeHintProps {
	visible: boolean;
}

export const SwipeHint = ({ visible }: SwipeHintProps) => {
	if (!visible) return null;
	return (
		<p className="mt-2 text-center text-[11px] opacity-50 text-t-2 pointer-events-none select-none">
			← Hard · Easy →
		</p>
	);
};
