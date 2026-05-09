"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { ComponentProps } from "react";
import type { AdminSubscriptionDetail } from "@/entities/admin-subscription";

const LEARNER_ROLE = "learner";

const SectionTitle = ({ label }: { label: string }) => (
	<div className="mb-[7px] text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
		{label}
	</div>
);

interface Props {
	sub: AdminSubscriptionDetail;
	sectionTitle: string;
	isRevokePending: boolean;
	onRevokeRole: (roleId: string) => void;
}

export const SubscriptionRolesSection = ({ sub, sectionTitle, isRevokePending, onRevokeRole }: Props) => {
	if (sub.user.roles.length === 0) return null;

	return (
		<div className="border-b border-bd-1 px-[15px] py-2.5">
			<SectionTitle label={sectionTitle} />
			<div className="flex flex-wrap gap-1">
				{sub.user.roles.map((r) => {
					const isLearner = r.role.name === LEARNER_ROLE;
					const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onRevokeRole(r.id);
					return (
						<Typography tag="span"
							key={r.id}
							className="flex items-center gap-1 rounded-[5px] border border-bd-2 bg-surf-2 px-1.5 py-0.5 text-[11px] text-t-2"
						>
							{r.role.name}
							{!isLearner && (
								<Button
									onClick={handleClick}
									disabled={isRevokePending}
									className="ml-0.5 text-[10px] text-t-3 transition-colors hover:text-red-t disabled:opacity-40"
									aria-label={`Remove ${r.role.name}`}
								>
									×
								</Button>
							)}
						</Typography>
					);
				})}
			</div>
		</div>
	);
};
