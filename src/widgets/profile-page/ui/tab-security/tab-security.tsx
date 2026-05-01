import type { UserProfile } from "@/entities/user";
import { ActiveSessionsCard } from "./active-sessions-card";
import { DangerZoneCard } from "./danger-zone-card";
import { SecurityCard } from "./security-card";

export interface TabSecurityProps {
	profile: UserProfile;
}

export const TabSecurity = ({ profile }: TabSecurityProps) => (
	<div className="grid grid-cols-[1fr_300px] gap-3.5 items-start max-lg:grid-cols-1">
		<div className="flex flex-col gap-3.5">
			<SecurityCard profile={profile} />
			<DangerZoneCard />
		</div>
		<div>
			<ActiveSessionsCard />
		</div>
	</div>
);
