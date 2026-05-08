"use client";

import { useAdminUsersPage } from "../model/use-admin-users-page";
import { AdminUsersTopbar } from "./admin-users-topbar";
import { UsersStatsRow } from "./users-stats-row";
import { UsersTabs } from "./users-tabs";
import { UsersToolbar } from "./users-toolbar";
import { UsersBulkBar } from "./users-bulk-bar";
import { UsersTable } from "./users-table";
import { UsersMobileList } from "./users-mobile-list";
import { UsersPagination } from "./users-pagination";

export const AdminUsersPage = () => {
	const state = useAdminUsersPage();

	const {
		tab,
		search,
		role,
		plan,
		sort,
		page,
		selectedIds,
		allSelected,
		someSelected,
		data,
		stats,
		isLoading,
		statsLoading,
		mutations,
		handleTabChange,
		handleSearchChange,
		handleRoleChange,
		handlePlanChange,
		handleSortChange,
		toggleSelectId,
		toggleSelectAll,
		clearSelection,
		setPage,
		handleExport,
	} = state;

	const selectedArray = Array.from(selectedIds);
	const bulkPending =
		mutations.bulkFreeze.isPending ||
		mutations.bulkBlock.isPending ||
		mutations.bulkResetRoles.isPending;

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<AdminUsersTopbar onExport={handleExport} />

			<div className="overflow-y-auto px-[18px] py-4 pb-8 max-sm:px-3 max-sm:pb-6">
				<UsersStatsRow stats={stats} isLoading={statsLoading} />

				<UsersTabs
					active={tab}
					counts={data?.tabs}
					onChange={handleTabChange}
				/>

				<UsersToolbar
					search={search}
					role={role}
					plan={plan}
					sort={sort}
					onSearchChange={handleSearchChange}
					onRoleChange={handleRoleChange}
					onPlanChange={handlePlanChange}
					onSortChange={handleSortChange}
				/>

				{/* Table card */}
				<div className="overflow-hidden rounded-[11px] border border-bd-1 bg-surf">
					<UsersBulkBar
						selectedCount={selectedIds.size}
						onFreeze={() => mutations.bulkFreeze.mutate(selectedArray, { onSuccess: clearSelection })}
						onResetRoles={() => mutations.bulkResetRoles.mutate(selectedArray, { onSuccess: clearSelection })}
						onBlock={() => mutations.bulkBlock.mutate(selectedArray, { onSuccess: clearSelection })}
						isPending={bulkPending}
					/>

					<UsersTable
						users={data?.users ?? []}
						selectedIds={selectedIds}
						allSelected={allSelected}
						onToggleAll={toggleSelectAll}
						onToggleRow={toggleSelectId}
						mutations={mutations}
						isLoading={isLoading}
					/>

					<UsersMobileList
						users={data?.users ?? []}
						mutations={mutations}
						isLoading={isLoading}
					/>

					{!isLoading && data && (
						<UsersPagination
							page={page}
							limit={data.limit}
							total={data.total}
							onPageChange={setPage}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
