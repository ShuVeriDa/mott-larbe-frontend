"use client";

import { Button } from "@/shared/ui/button";
import { ComponentProps } from "react";

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
				<svg
					className="size-3 shrink-0 text-t-3"
					viewBox="0 0 12 12"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.3"
				>
					<path
						d="M8.5 1.5l2 2-6 6H2.5v-2l6-6z"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				{labels.edit}
			</Button>

			<Button
				onClick={handleCopy}
				className="flex h-[29px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[11.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
			>
				<svg
					className="size-3 shrink-0 text-t-3"
					viewBox="0 0 12 12"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.3"
				>
					<rect x="4" y="1" width="7" height="7" rx="1.2" />
					<path d="M1 4v6a1 1 0 001 1h6" strokeLinecap="round" />
				</svg>
				{labels.copyCode}
			</Button>

			{(coupon.computedStatus === "active" ||
				coupon.computedStatus === "disabled") && (
				<Button
					disabled={toggling}
					onClick={handleToggle}
					className="flex h-[29px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[11.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1 disabled:opacity-50"
				>
					<svg
						className="size-3 shrink-0 text-t-3"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.3"
					>
						<circle cx="6" cy="6" r="5" />
						<path d="M4 6h4M6 4v4" strokeLinecap="round" />
					</svg>
					{coupon.computedStatus === "disabled"
						? labels.activate
						: labels.deactivate}
				</Button>
			)}

			<Button
				onClick={handleDelete}
				className="flex h-[29px] w-full items-center gap-1.5 rounded-base border border-[rgba(220,38,38,0.2)] bg-transparent px-2.5 text-[11.5px] text-red-t transition-colors hover:border-transparent hover:bg-red-bg"
			>
				<svg
					className="size-3 shrink-0 text-red-t"
					viewBox="0 0 12 12"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.3"
				>
					<path
						d="M2 3h8M4 3V2h4v1M5 5.5v3M7 5.5v3M3 3l.6 7h4.8L9 3"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				{labels.delete}
			</Button>
		</div>
	);
};
