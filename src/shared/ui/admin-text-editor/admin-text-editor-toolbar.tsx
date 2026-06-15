"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import type { Editor } from "@/shared/ui/notion-editor";
import { Typography } from "@/shared/ui/typography";
import { ChevronDown, Search } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useAdminTextEditorToolbar } from "./model/use-admin-text-editor-toolbar";
import { TbBtn } from "./tb-btn";
import { TbDivider } from "./tb-divider";

interface EditorToolbarProps {
	editor: Editor | null;
	t: ReturnType<typeof useI18n>["t"];
	extraItems?: ReactNode;
	onFindReplace?: () => void;
	findReplaceOpen?: boolean;
}

export const EditorToolbar = ({
	editor,
	t,
	extraItems,
	onFindReplace,
	findReplaceOpen,
}: EditorToolbarProps) => {
	const {
		blockTypeAnchor,
		blockTypeOpen,
		blockTypeOptions,
		currentBlockType,
		currentBlockTypeLabel,
		getHandleBlockTypeItemMouseDown,
		handleBlockTypeBackdropMouseDown,
		handleBlockTypeMouseDown,
		toolbarActionSections,
	} = useAdminTextEditorToolbar({
		editor,
		t,
	});

	return (
		<div className="sticky top-[52px] z-10 w-full overflow-x-auto border-b border-bd-1 bg-surf px-2 py-[5px] transition-colors [scrollbar-width:none]">
			<div className="flex min-w-max items-center gap-px">
				<div className="relative shrink-0">
					<Button
						onMouseDown={handleBlockTypeMouseDown}
						title={currentBlockTypeLabel}
						className="flex h-7 items-center gap-1 rounded-[6px] px-2 text-[12px] font-medium text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1 select-none"
					>
						{currentBlockTypeLabel}
						<ChevronDown className="size-[12px] opacity-50" />
					</Button>
					{blockTypeOpen &&
						blockTypeAnchor &&
						createPortal(
							<>
								<div
									className="fixed inset-0 z-9998"
									onMouseDown={handleBlockTypeBackdropMouseDown}
								/>
								<div
									className="fixed z-9999 min-w-[220px] overflow-hidden rounded-[10px] border border-bd-2 bg-surf py-1 shadow-lg flex flex-col gap-1"
									style={{
										top: blockTypeAnchor.bottom + 6,
										left: blockTypeAnchor.left,
									}}
								>
									{blockTypeOptions.map(option => {
										return (
											<Button
												key={option.value}
												onMouseDown={getHandleBlockTypeItemMouseDown(
													option.value,
												)}
												title={option.label}
												className={`flex w-[calc(100%-8px)] items-center gap-2 mx-1 rounded-[6px] px-2 py-[5px] text-left transition-colors ${
													currentBlockType === option.value
														? "bg-surf-2"
														: "hover:bg-surf-2"
												}`}
											>
												<Typography tag="span" className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-t-2">
													<Typography
														tag="span"
														className="text-[11px] font-medium text-t-2"
													>
														{option.iconLabel}
													</Typography>
												</Typography>
												<Typography tag="span" className="flex-1 text-[13.5px] text-t-1">
													{option.label}
												</Typography>
												{option.hint && (
													<Typography tag="span" className="text-[11px] text-t-4">
														{option.hint}
													</Typography>
												)}
											</Button>
										);
									})}
								</div>
							</>,
							document.body,
						)}
				</div>

				<TbDivider />

				{toolbarActionSections.map((section, sectionIndex) => (
					<Fragment key={`toolbar-section-${sectionIndex}`}>
						{section.map(({ id, title, active, onExec, Icon }) => (
							<TbBtn key={id} title={title} active={active} onExec={onExec}>
								<Icon className="size-[13px]" />
							</TbBtn>
						))}
						{sectionIndex < toolbarActionSections.length - 1 && <TbDivider />}
					</Fragment>
				))}

				{onFindReplace && (
					<>
						<TbDivider />
						<TbBtn
							title={t("admin.texts.createPage.shortcuts.findReplace")}
							active={findReplaceOpen}
							onExec={onFindReplace}
						>
							<Search className="size-[13px]" />
						</TbBtn>
					</>
				)}

				{extraItems && (
					<>
						<TbDivider />
						{extraItems}
					</>
				)}
			</div>
		</div>
	);
};
