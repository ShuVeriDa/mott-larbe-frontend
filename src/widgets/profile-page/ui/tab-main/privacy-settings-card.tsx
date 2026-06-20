"use client";

import { usePrivacySettings, useUpdatePrivacy, type PrivacyField } from "@/entities/user-privacy";
import { useI18n } from "@/shared/lib/i18n";
import { Switch } from "@/shared/ui/switch";
import { Typography } from "@/shared/ui/typography";
import { ProfileCard } from "../profile-card";

interface PrivacyRowProps {
	label: string;
	description: string;
	field: PrivacyField;
	checked: boolean;
	disabled: boolean;
	onToggle: (field: PrivacyField, value: boolean) => void;
}

const PrivacyRow = ({
	label,
	description,
	field,
	checked,
	disabled,
	onToggle,
}: PrivacyRowProps) => {
	const id = `privacy-${field}`;

	const handleCheckedChange = (value: boolean) => onToggle(field, value);

	return (
		<div className="flex items-center justify-between gap-3 py-2.5 border-b border-bd-1/50 last:border-0">
			<div className="flex flex-col gap-0.5 min-w-0">
				<label
					htmlFor={id}
					className="text-[12.5px] font-medium text-t-1 cursor-pointer select-none"
				>
					{label}
				</label>
				<Typography tag="p" className="text-[11.5px] text-t-3 leading-snug">
					{description}
				</Typography>
			</div>
			<Switch
				id={id}
				size="sm"
				checked={checked}
				onCheckedChange={handleCheckedChange}
				disabled={disabled}
				aria-label={label}
			/>
		</div>
	);
};

interface PrivacyGroupProps {
	label: string;
}

const PrivacyGroup = ({ label }: PrivacyGroupProps) => (
	<div className="pt-3 pb-1 first:pt-0">
		<Typography tag="p" className="text-[11px] font-semibold uppercase tracking-wide text-t-3/70">
			{label}
		</Typography>
	</div>
);

const PrivacySkeleton = () => (
	<div className="space-y-3 py-1">
		{[1, 2, 3, 4, 5].map((i) => (
			<div key={i} className="flex items-center justify-between gap-3 py-1">
				<div className="space-y-1.5 flex-1">
					<div className="h-3 w-36 rounded-md bg-bd-1 animate-pulse" />
					<div className="h-2.5 w-48 rounded-md bg-bd-1 animate-pulse" />
				</div>
				<div className="h-4 w-7 rounded-full bg-bd-1 animate-pulse shrink-0" />
			</div>
		))}
	</div>
);

type PrivacyRowConfig = { field: PrivacyField; labelKey: string; descKey: string };

type PrivacyGroupConfig = {
	groupKey: string;
	rows: PrivacyRowConfig[];
};

const PRIVACY_GROUPS: PrivacyGroupConfig[] = [
	{
		groupKey: "privacy.group_personal",
		rows: [
			{
				field: "showPhone",
				labelKey: "privacy.phone_visibility",
				descKey: "privacy.phone_visibility_desc",
			},
			{
				field: "showHeritage",
				labelKey: "privacy.heritage_visibility",
				descKey: "privacy.heritage_visibility_desc",
			},
			{
				field: "showLocation",
				labelKey: "privacy.location_visibility",
				descKey: "privacy.location_visibility_desc",
			},
		],
	},
	{
		groupKey: "privacy.group_activity",
		rows: [
			{
				field: "showActivity",
				labelKey: "privacy.stats_visibility",
				descKey: "privacy.stats_visibility_desc",
			},
			{
				field: "showJoinDate",
				labelKey: "privacy.join_date_visibility",
				descKey: "privacy.join_date_visibility_desc",
			},
		],
	},
];

export const PrivacySettingsCard = () => {
	const { t } = useI18n();
	const { data: settings, isPending } = usePrivacySettings();
	const { mutate, isPending: isMutating } = useUpdatePrivacy();

	const handleToggle = (field: PrivacyField, value: boolean) => {
		mutate({ [field]: value });
	};

	return (
		<ProfileCard title={t("privacy.title")}>
			{isPending ? (
				<PrivacySkeleton />
			) : settings ? (
				<div className="flex flex-col">
					{PRIVACY_GROUPS.map(({ groupKey, rows }, groupIndex) => (
						<div key={groupKey}>
							<PrivacyGroup label={t(groupKey)} />
							<div className={groupIndex < PRIVACY_GROUPS.length - 1 ? "mb-1" : ""}>
								{rows.map(({ field, labelKey, descKey }) => (
									<PrivacyRow
										key={field}
										field={field}
										label={t(labelKey)}
										description={t(descKey)}
										checked={settings[field]}
										disabled={isMutating}
										onToggle={handleToggle}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			) : null}
		</ProfileCard>
	);
};
