import { ComponentProps } from 'react';
import type { FeatureFlagOverrideItem } from "@/entities/feature-flag";
import { cn } from "@/shared/lib/cn";
import { formatDate } from "@/shared/lib/format-date";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/ui/table";
import { Trash2 } from "lucide-react";

const AV_COLORS = [
	"bg-pur-bg text-pur-t",
	"bg-grn-bg text-grn-t",
	"bg-amb-bg text-amb-t",
	"bg-acc-bg text-acc-t",
	"bg-surf-3 text-t-2",
];
const getAvColor = (id: string) => AV_COLORS[id.charCodeAt(0) % AV_COLORS.length];

interface OverridesTableProps {
	items: FeatureFlagOverrideItem[];
	isLoading: boolean;
	onDelete: (overrideId: string) => void;
	t: (key: string, params?: Record<string, string | number>) => string;
}

const SkeletonRow = () => (
	<TableRow>
		{Array.from({ length: 6 }).map((_, i) => (
			<TableCell key={i} className="px-3.5 py-3">
				<div className="h-3 animate-pulse rounded bg-surf-3" />
			</TableCell>
		))}
	</TableRow>
);

export const OverridesTable = ({ items, isLoading, onDelete, t }: OverridesTableProps) => (
	<div className="overflow-x-auto">
		<Table className="border-collapse text-[12.5px]" aria-label={t("admin.featureFlags.overrides.user")}>
			<TableHeader>
				<TableRow>
					<TableHead className="border-b border-bd-1 pb-2 pl-3.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("admin.featureFlags.overrides.user")}
					</TableHead>
					<TableHead className="border-b border-bd-1 pb-2 pl-3.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("admin.featureFlags.overrides.flag")}
					</TableHead>
					<TableHead className="w-[80px] border-b border-bd-1 pb-2 pl-3.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("admin.featureFlags.overrides.value")}
					</TableHead>
					<TableHead className="w-[150px] border-b border-bd-1 pb-2 pl-3.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("admin.featureFlags.overrides.global")}
					</TableHead>
					<TableHead className="w-[140px] border-b border-bd-1 pb-2 pl-3.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("admin.featureFlags.overrides.setBy")}
					</TableHead>
					<TableHead className="w-[90px] border-b border-bd-1 pb-2 pl-3.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("admin.featureFlags.overrides.date")}
					</TableHead>
					<TableHead className="w-12 border-b border-bd-1 pb-2 pr-3.5" />
				</TableRow>
			</TableHeader>
			<TableBody>
				{isLoading
					? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
					: items.map((item) => {
							const initials = (
								(item.user.name?.[0] ?? "") + (item.user.surname?.[0] ?? "")
							).toUpperCase() || item.user.email[0].toUpperCase();
														const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onDelete(item.id);
return (
								<TableRow
									key={item.id}
									className="border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2"
								>
									<TableCell className="py-3 pl-3.5">
										<div className="flex items-center gap-2">
											<div
												className={cn(
													"flex size-6 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold",
													getAvColor(item.user.id),
												)}
											>
												{initials}
											</div>
											<div>
												<Typography tag="p" className="text-[12.5px] text-t-1">
													{item.user.name} {item.user.surname}
												</Typography>
												<Typography tag="p" className="text-[11px] text-t-3">{item.user.email}</Typography>
											</div>
										</div>
									</TableCell>
									<TableCell className="py-3 pl-3.5">
										<Typography tag="span" className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap rounded-[5px] border border-bd-1 bg-surf-2 px-1.5 py-0.5 font-mono text-[11px] text-t-2 block">
											{item.featureFlag.key}
										</Typography>
									</TableCell>
									<TableCell className="py-3 pl-3.5">
										{item.isEnabled ? (
											<Typography tag="span" className="rounded px-1.5 py-[2px] text-[11px] font-semibold bg-grn-bg text-grn-t">
												{t("admin.featureFlags.overrides.on")}
											</Typography>
										) : (
											<Typography tag="span" className="rounded px-1.5 py-[2px] text-[11px] font-semibold bg-red-bg text-red-t">
												{t("admin.featureFlags.overrides.off")}
											</Typography>
										)}
									</TableCell>
									<TableCell className="py-3 pl-3.5">
										{item.featureFlag.isEnabled === false ? (
											<Typography tag="span" className="rounded px-1.5 py-[2px] text-[10.5px] font-medium bg-red-bg text-red-t">
												{t("admin.featureFlags.overrides.globalOff")}
											</Typography>
										) : item.featureFlag.rolloutPercent === 100 ? (
											<Typography tag="span" className="rounded px-1.5 py-[2px] text-[10.5px] font-medium bg-grn-bg text-grn-t">
												{t("admin.featureFlags.overrides.globalOn", { pct: item.featureFlag.rolloutPercent })}
											</Typography>
										) : (
											<Typography tag="span" className="rounded px-1.5 py-[2px] text-[10.5px] font-medium bg-amb-bg text-amb-t">
												{t("admin.featureFlags.overrides.globalOn", { pct: item.featureFlag.rolloutPercent })}
											</Typography>
										)}
									</TableCell>
									<TableCell className="py-3 pl-3.5 text-[11.5px] text-t-3">
										{item.setBy
											? `${item.setBy.name} ${item.setBy.surname}`
											: "—"}
									</TableCell>
									<TableCell className="py-3 pl-3.5 text-[11.5px] text-t-3">
										{formatDate(item.updatedAt)}
									</TableCell>
									<TableCell className="py-3 pr-3.5">
										<Button
											onClick={handleClick}
											className="flex size-[26px] cursor-pointer items-center justify-center rounded-[6px] border-none bg-transparent text-t-3 transition-colors hover:bg-red-bg hover:text-red-t"
											title={t("admin.featureFlags.overrides.remove")}
										>
											<Trash2 className="size-3.5" />
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
			</TableBody>
		</Table>
	</div>
);
