import { ComponentProps } from 'react';
import type {
	FeatureFlagActor,
	FeatureFlagHistoryEventType,
} from "@/entities/feature-flag";

const EVENT_TYPES: FeatureFlagHistoryEventType[] = [
	"FLAG_CREATED",
	"FLAG_UPDATED",
	"FLAG_DELETED",
	"GLOBAL_ENABLED",
	"GLOBAL_DISABLED",
	"ROLLOUT_CHANGED",
	"ENVIRONMENTS_CHANGED",
	"OVERRIDE_ADDED",
	"OVERRIDE_UPDATED",
	"OVERRIDE_REMOVED",
	"FLAG_DUPLICATED",
	"FLAGS_IMPORTED",
];

interface HistoryToolbarProps {
	search: string;
	eventType: string;
	actorId: string;
	actors: FeatureFlagActor[];
	onSearchChange: (v: string) => void;
	onEventTypeChange: (v: string) => void;
	onActorIdChange: (v: string) => void;
	t: (key: string) => string;
}

export const HistoryToolbar = ({
	search,
	eventType,
	actorId,
	actors,
	onSearchChange,
	onEventTypeChange,
	onActorIdChange,
	t,
}: HistoryToolbarProps) => {
  const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e => onSearchChange(e.currentTarget.value);
  const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = e => onEventTypeChange(e.currentTarget.value);
  const handleChange3: NonNullable<ComponentProps<"select">["onChange"]> = e => onActorIdChange(e.currentTarget.value);
  return (
	<div className="mb-3.5 flex flex-wrap items-center gap-2">
		<div className="relative max-w-[280px] flex-1">
			<svg
				className="pointer-events-none absolute left-2.5 top-1/2 size-[13px] -translate-y-1/2 text-t-3"
				viewBox="0 0 15 15"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.4"
			>
				<circle cx="6.5" cy="6.5" r="4" />
				<path d="M10 10l2.5 2.5" strokeLinecap="round" />
			</svg>
			<input
				type="text"
				value={search}
				onChange={handleChange}
				placeholder={t("admin.featureFlags.history.searchPlaceholder")}
				className="h-[30px] w-full rounded-base border border-bd-2 bg-surf pl-[30px] pr-2.5 text-[12.5px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
			/>
		</div>

		<select
			value={eventType}
			onChange={handleChange2}
			className="h-[30px] cursor-pointer rounded-base border border-bd-2 bg-surf px-2 text-[12.5px] text-t-2 outline-none transition-colors hover:border-bd-3"
		>
			<option value="">{t("admin.featureFlags.history.allTypes")}</option>
			{EVENT_TYPES.map(et => (
				<option key={et} value={et}>
					{t(`admin.featureFlags.history.eventType.${et}`)}
				</option>
			))}
		</select>

		<select
			value={actorId}
			onChange={handleChange3}
			className="h-[30px] cursor-pointer rounded-base border border-bd-2 bg-surf px-2 text-[12.5px] text-t-2 outline-none transition-colors hover:border-bd-3"
		>
			<option value="">{t("admin.featureFlags.history.allActors")}</option>
			{actors.map(a => (
				<option key={a.id} value={a.id}>
					{a.name} {a.surname}
				</option>
			))}
		</select>
	</div>
);
};
