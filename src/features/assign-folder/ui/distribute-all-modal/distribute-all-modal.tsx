"use client";
import { ComponentProps, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { dictionaryApi, dictionaryKeys } from "@/entities/dictionary";
import { FolderIcon, type Folder } from "@/entities/folder";
import { useAssignEntriesToFolder } from "../../model";

export interface DistributeAllModalProps {
	open: boolean;
	onClose: () => void;
	folders: Folder[];
	uncatCount: number;
}

export const DistributeAllModal = ({
	open,
	onClose,
	folders,
	uncatCount,
}: DistributeAllModalProps) => {
	const { t } = useI18n();
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const { data: uncatData, isLoading: loadingEntries } = useQuery({
		queryKey: dictionaryKeys.list({ noFolder: true, limit: 500 }),
		queryFn: () => dictionaryApi.list({ noFolder: true, limit: 500 }),
		enabled: open,
	});

	const { mutate: assign, isPending } = useAssignEntriesToFolder();

	const handleClose = () => {
		setSelectedId(null);
		onClose();
	};

	const handleConfirm = () => {
		if (!selectedId || !uncatData) return;
		assign(
			{
				assignments: uncatData.items.map((e) => ({
					id: e.id,
					folderId: selectedId,
				})),
			},
			{ onSuccess: handleClose },
		);
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			title={t("vocabulary.foldersPage.distributeAllModal.title")}
		>
			<p className="mb-4 text-[13px] text-t-3">
				{t("vocabulary.foldersPage.distributeAllModal.description", {
					count: uncatCount,
				})}
			</p>

			<ul className="mb-4 max-h-[240px] overflow-y-auto rounded-card border-hairline border-bd-1">
				{folders.map((f) => {
				  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setSelectedId(f.id);
				  return (
					<li key={f.id}>
						<button
							type="button"
							onClick={handleClick}
							className={cn(
								"flex w-full items-center gap-2.5 px-3 py-2.5 text-left",
								"text-[13px] transition-colors",
								selectedId === f.id
									? "bg-acc-bg text-acc"
									: "text-t-2 hover:bg-surf-2 hover:text-t-1",
							)}
						>
							<span
								className="flex size-5 shrink-0 items-center justify-center rounded-[5px]"
								style={{
									background: `${f.color ?? "#2254d3"}1F`,
									color: f.color ?? "#2254d3",
								}}
							>
								<FolderIcon icon={f.icon} className="size-3" />
							</span>
							<span className="truncate">{f.name}</span>
							{selectedId === f.id && (
								<span className="ml-auto shrink-0 text-[11px]">✓</span>
							)}
						</button>
					</li>
				);
				})}
			</ul>

			<ModalActions>
				<Button
					variant="ghost"
					size="lg"
					className="flex-1"
					onClick={handleClose}
				>
					{t("vocabulary.foldersPage.distributeAllModal.cancel")}
				</Button>
				<Button
					variant="action"
					size="lg"
					className="flex-1"
					disabled={!selectedId || isPending || loadingEntries}
					onClick={handleConfirm}
				>
					{t("vocabulary.foldersPage.distributeAllModal.confirm")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
