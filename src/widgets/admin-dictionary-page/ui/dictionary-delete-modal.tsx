import { ComponentProps } from 'react';
import type { AdminDictListItem } from "@/entities/dictionary";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
interface DictionaryDeleteModalProps {
	entry: AdminDictListItem | null;
	isDeleting: boolean;
	onConfirm: () => void;
	onClose: () => void;
	t: (key: string) => string;
}

export const DictionaryDeleteModal = ({
	entry,
	isDeleting,
	onConfirm,
	onClose,
	t,
}: DictionaryDeleteModalProps) => {
	if (!entry) return null;

		const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = e => {
				if (/* intentional: backdrop-only click */ e.target === e.currentTarget) onClose();
			};
return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-[3px] max-sm:items-end"
			onClick={handleClick}
		>
			<div className="w-[440px] rounded-[14px] border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-sm:w-full max-sm:rounded-b-none max-sm:rounded-t-[18px] max-sm:px-4.5 max-sm:pb-8">
				<Typography tag="h2" className="font-display text-[16px] text-t-1 mb-1">
					{t("admin.dictionary.deleteModal.title")}
				</Typography>
				<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
					{t("admin.dictionary.deleteModal.subtitle")}
				</Typography>

				<div className="mb-4 rounded-[8px] border border-bd-1 bg-bg px-3 py-2.5">
					<Typography tag="p" className="font-display text-[15px] font-medium text-t-1">
						{entry.baseForm}
					</Typography>
					{entry.translation && (
						<Typography tag="p" className="mt-0.5 text-[12px] text-t-3">{entry.translation}</Typography>
					)}
				</div>

				<div className="flex justify-end gap-2 max-sm:flex-col-reverse">
					<Button
						onClick={onClose}
						disabled={isDeleting}
						className="h-8 cursor-pointer rounded-base border border-bd-2 bg-transparent px-3.5 text-[12.5px] text-t-2 transition-all hover:border-bd-3 hover:bg-surf-2 disabled:opacity-50 max-sm:h-10 max-sm:rounded-[9px] max-sm:text-[14px]"
					>
						{t("admin.dictionary.deleteModal.cancel")}
					</Button>
					<Button
						onClick={onConfirm}
						disabled={isDeleting}
						className="h-8 cursor-pointer rounded-base bg-red-500 px-3.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-[.88] disabled:opacity-50 max-sm:h-10 max-sm:rounded-[9px] max-sm:text-[14px]"
					>
						{isDeleting
							? t("admin.dictionary.deleteModal.deleting")
							: t("admin.dictionary.deleteModal.confirm")}
					</Button>
				</div>
			</div>
		</div>
	);
};
