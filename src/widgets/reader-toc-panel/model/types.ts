export interface ReaderTocPanelProps {
	textId: string;
	currentPage: number;
	onNavigate: (page: number) => void;
	open: boolean;
	onClose: () => void;
}
