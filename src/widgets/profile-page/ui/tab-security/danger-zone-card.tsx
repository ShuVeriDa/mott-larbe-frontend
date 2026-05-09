"use client";
import { ComponentProps, useState } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { DeleteAccountModal } from "@/features/delete-account";
import { ProfileCard as SettingCard } from "../profile-card";

export const DangerZoneCard = () => {
	const { t } = useI18n();
	const [deleteOpen, setDeleteOpen] = useState(false);

		const handleClick: NonNullable<ComponentProps<typeof Button>["onClick"]> = () => setDeleteOpen(true);
	const handleClose: NonNullable<ComponentProps<typeof DeleteAccountModal>["onClose"]> = () => setDeleteOpen(false);
return (
		<>
			<SettingCard
				title={t("settings.data.dangerZone")}
				noBody
				className="border-red/20"
			>
				<div className="px-4 py-3.5">
					<div className="flex items-center gap-3">
						<div className="flex-1">
							<Typography tag="p" className="text-[12.5px] font-medium text-t-1 mb-0.5">
								{t("settings.data.deleteAccount")}
							</Typography>
							<Typography tag="p" className="text-[11px] text-t-3">
								{t("settings.data.deleteAccountDesc")}
							</Typography>
						</div>
						<Button
							variant="danger"
							className="h-7 px-2.5 text-[11.5px] shrink-0"
							onClick={handleClick}
						>
							{t("settings.data.deleteButton")}
						</Button>
					</div>
				</div>
			</SettingCard>

			<DeleteAccountModal
				open={deleteOpen}
				onClose={handleClose}
			/>
		</>
	);
};
