export interface ReaderBookmarksPanelProps {
	textId: string;
	onNavigate: (page: number) => void;
	open: boolean;
	onClose: () => void;
}
