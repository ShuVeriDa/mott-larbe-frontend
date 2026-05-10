"use client";

import { Button } from "@/shared/ui/button";
import { ComponentProps } from "react";
import { Pencil, Copy, CirclePlus, Trash2 } from "lucide-react";

interface Props {
	coupon: {
		id: string;
		computedStatus: "active" | "expired" | "exhausted" | "disabled";
	};
	toggling: boolean;
	labels: {
		edit: string;
		copyCode: string;
		activate: string;
		deactivate: string;
		delete: string;
	};
	onEdit: (id: string) => void;
	onCopy: () => void;
	onToggle: () => void;
	onDelete: (id: string) => void;
}

export const CouponActionsSection = ({
	coupon,
	toggling,
	labels,
	onEdit,
	onCopy,
	onToggle,
	onDelete,
}: Props) => {
	const handleEdit: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onEdit(coupon.id);
	const handleCopy: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onCopy();
	const handleToggle: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onToggle();
	const handleDelete: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onDelete(coupon.id);

	return (
		<div className="flex flex-col gap-1.5 px-[15px] py-2.5">
			<Button
				onClick={handleEdit}
				className="flex h-[29px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[11.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
			>
				<Pencil className="size-3 shrink-0 text-t-3" />
				{labels.edit}
			</Button>

			<Button
				onClick={handleCopy}
				className="flex h-[29px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[11.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
			>
				<Copy className="size-3 shrink-0 text-t-3" />
				{labels.copyCode}
			</Button>

			{(coupon.computedStatus === "active" ||
				coupon.computedStatus === "disabled") && (
				<Button
					disabled={toggling}
					onClick={handleToggle}
					className="flex h-[29px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[11.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1 disabled:opacity-50"
				>
					<CirclePlus className="size-3 shrink-0 text-t-3" />
					{coupon.computedStatus === "disabled"
						? labels.activate
						: labels.deactivate}
				</Button>
			)}

			<Button
				onClick={handleDelete}
				className="flex h-[29px] w-full items-center gap-1.5 rounded-base border border-[rgba(220,38,38,0.2)] bg-transparent px-2.5 text-[11.5px] text-red-t transition-colors hover:border-transparent hover:bg-red-bg"
			>
				<Trash2 className="size-3 shrink-0 text-red-t" />
				{labels.delete}
			</Button>
		</div>
	);
};
