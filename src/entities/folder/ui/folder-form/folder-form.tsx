"use client";

import { Button } from "@/shared/ui/button";
import { useFolderForm } from "../../model";
import { Input, InputLabel } from "@/shared/ui/input";
import { cn } from "@/shared/lib/cn";
import {
	DEFAULT_FOLDER_COLOR,
	DEFAULT_FOLDER_ICON,
	FOLDER_COLORS,
	FOLDER_ICON_KEYS,
	type FolderColor,
	type FolderIconKey,
} from "../../lib/folder-presets";
import { FolderIcon } from "../folder-icon";

export interface FolderFormValue {
	name: string;
	description: string;
	color: FolderColor | string;
	icon: FolderIconKey;
}

export interface FolderFormLabels {
	nameLabel: string;
	namePlaceholder: string;
	descriptionLabel: string;
	descriptionPlaceholder: string;
	colorLabel: string;
	iconLabel: string;
}

export interface FolderFormProps {
	value: FolderFormValue;
	onChange: (next: FolderFormValue) => void;
	labels: FolderFormLabels;
	autoFocusName?: boolean;
}

export const buildInitialFolderForm = (
	overrides?: Partial<FolderFormValue>,
): FolderFormValue => ({
	name: "",
	description: "",
	color: DEFAULT_FOLDER_COLOR,
	icon: DEFAULT_FOLDER_ICON,
	...overrides,
});

export const FolderForm = ({
	value,
	onChange,
	labels,
	autoFocusName,
}: FolderFormProps) => {
	const {
		internal,
		handleNameChange,
		handleDescriptionChange,
		handleIconClick,
		handleColorClick,
	} = useFolderForm({ value, onChange });

	return (
		<div className="flex flex-col gap-3">
			<div>
				<InputLabel htmlFor="folder-form-name">{labels.nameLabel}</InputLabel>
				<Input
					id="folder-form-name"
					autoFocus={autoFocusName}
					value={internal.name}
					onChange={handleNameChange}
					placeholder={labels.namePlaceholder}
					maxLength={64}
					required
				/>
			</div>

			<div>
				<InputLabel htmlFor="folder-form-desc">
					{labels.descriptionLabel}
				</InputLabel>
				<textarea
					id="folder-form-desc"
					value={internal.description}
					onChange={handleDescriptionChange}
					placeholder={labels.descriptionPlaceholder}
					maxLength={256}
					rows={3}
					className={cn(
						"min-h-[68px] w-full resize-none rounded-base px-[10px] py-2",
						"border-hairline border-bd-2 bg-surf-2",
						"text-[13px] text-t-1 font-[inherit] outline-none",
						"transition-colors duration-100",
						"placeholder:text-t-3 focus:border-acc",
					)}
				/>
			</div>

			<div>
				<div className="mb-[5px] text-[11.5px] font-medium text-t-2">
					{labels.iconLabel}
				</div>
				<div className="flex flex-wrap gap-1.5">
					{FOLDER_ICON_KEYS.map((iconKey) => {
					  return (
						<Button
							key={iconKey}
							data-icon={iconKey}
							onClick={handleIconClick}
							aria-pressed={internal.icon === iconKey}
							className={cn(
								"flex size-9 items-center justify-center rounded-[8px]",
								"border-hairline transition-[background-color,border-color]",
								internal.icon === iconKey
									? "border-acc bg-acc-bg text-acc"
									: "border-bd-1 bg-surf-2 text-t-2 hover:border-bd-2 hover:text-t-1",
							)}
						>
							<FolderIcon icon={iconKey} className="size-[15px]" />
						</Button>
					);
					})}
				</div>
			</div>

			<div>
				<div className="mb-[5px] text-[11.5px] font-medium text-t-2">
					{labels.colorLabel}
				</div>
				<div className="flex flex-wrap gap-[7px]">
					{FOLDER_COLORS.map((c) => {
						const selected = internal.color === c;
return (
							<Button
								key={c}
								data-color={c}
								onClick={handleColorClick}
								aria-label={c}
								aria-pressed={selected}
								className={cn(
									"size-[26px] rounded-base transition-transform duration-75",
									"border-2",
									"hover:scale-110",
									selected ? "border-t-1" : "border-transparent",
								)}
								style={{ background: c }}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};
