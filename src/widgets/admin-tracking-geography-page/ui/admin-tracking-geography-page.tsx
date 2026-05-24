"use client";

import {
	useAdminAnalyticsTopCountries,
	useAdminAnalyticsTopCities,
	useAdminAnalyticsGeoIpStatus,
	useAnalyticsRange,
	useInvalidateAdminAnalytics,
} from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/locales";
import { AnalyticsTabs } from "@/widgets/admin-tracking-overview-page";
import { AnalyticsToolbar } from "@/widgets/admin-tracking-overview-page";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/ui/table";
import { Info, CheckCircle2 } from "lucide-react";

type TrackingDict = Dictionary["admin"]["tracking"];

interface AdminTrackingGeographyPageProps {
	lang: Locale;
	dict: TrackingDict;
}

const formatBytes = (bytes: number): string => {
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const AdminTrackingGeographyPage = ({ lang, dict }: AdminTrackingGeographyPageProps) => {
	const rangeState = useAnalyticsRange();
	const { range } = rangeState;
	const invalidate = useInvalidateAdminAnalytics();

	const geoIpStatus = useAdminAnalyticsGeoIpStatus();
	const countries = useAdminAnalyticsTopCountries({ from: range.from, to: range.to, limit: 50 });
	const cities = useAdminAnalyticsTopCities({ from: range.from, to: range.to, limit: 50 });

	const status = geoIpStatus.data;
	const geoReady = status?.configured && status?.databaseExists;

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<header className="flex shrink-0 items-center gap-2.5 border-b border-bd-1 bg-surf px-5 py-3.5 transition-colors max-sm:px-3 max-sm:py-2.5">
				<div className="min-w-0 flex-1">
					<h1 className="font-display text-base font-medium text-t-1">{dict.geography.title}</h1>
				</div>
			</header>

			<div className="overflow-y-auto px-5 py-5 pb-10 max-sm:px-3 max-sm:py-3 max-sm:pb-24">
				<AnalyticsTabs lang={lang} active="geography" dict={dict.tabs} />

				<div className="mt-4 mb-4">
					<AnalyticsToolbar rangeState={rangeState} dict={dict.toolbar} onRefresh={invalidate} />
				</div>

				{status && !geoReady && (
					<div className="mb-4 rounded-card border border-amb/20 bg-amb-bg p-4">
						<div className="mb-2.5 flex items-center gap-2">
							<Info className="size-[15px] shrink-0 text-amb" aria-hidden="true" />
							<p className="text-[13px] font-semibold text-amb-t">{dict.geography.setupTitle}</p>
						</div>
						<ol className="ml-5 list-decimal space-y-1">
							{([
								dict.geography.setupStep1,
								dict.geography.setupStep2,
								dict.geography.setupStep3,
								dict.geography.setupStep4,
							] as string[]).map((step, i) => (
								<li key={i} className="text-[12.5px] leading-relaxed text-amb-t">
									{step}
								</li>
							))}
						</ol>
					</div>
				)}

				{status && geoReady && (
					<div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 rounded-card border border-grn/20 bg-grn/5 px-4 py-2.5">
						<div className="flex items-center gap-1.5">
							<CheckCircle2 className="size-[13px] text-grn" aria-hidden="true" />
							<span className="text-[12px] font-medium text-grn">{status.databaseType}</span>
						</div>
						{status.fileSize != null && (
							<span className="text-[11.5px] text-t-3">
								{dict.geography.dbSize}: {formatBytes(status.fileSize)}
							</span>
						)}
						{status.loadedAt && (
							<span className="text-[11.5px] text-t-3">
								{dict.geography.loadedAt}: {new Date(status.loadedAt).toLocaleDateString()}
							</span>
						)}
						{status.recent && (
							<span className="ml-auto text-[11.5px] text-t-3">
								{dict.geography.coverageLabel}:{" "}
								<span className="font-medium text-t-2">
									{(status.recent.coverage * 100).toFixed(1)}%
								</span>
								{" "}({status.recent.eventsWithCountry.toLocaleString()} / {status.recent.totalEvents.toLocaleString()})
							</span>
						)}
					</div>
				)}

				<div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
					<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
						<div className="border-b border-bd-1 px-4 py-3">
							<p className="text-[13px] font-semibold text-t-1">{dict.geography.countries}</p>
						</div>
						<Table aria-label={dict.geography.countries}>
							<TableHeader>
								<TableRow className="border-b border-bd-1">
									<TableHead className="bg-surf-2 px-3.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
										{dict.geography.country}
									</TableHead>
									<TableHead className="bg-surf-2 px-3.5 py-[10px] text-right text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
										{dict.geography.events}
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{countries.isLoading
									? Array.from({ length: 8 }).map((_, i) => (
											<TableRow key={i} className="border-b border-bd-1">
												<TableCell className="px-3.5 py-[10px]">
													<div className="h-3 w-32 animate-pulse rounded bg-surf-3" />
												</TableCell>
												<TableCell className="px-3.5 py-[10px] text-right">
													<div className="ml-auto h-3 w-16 animate-pulse rounded bg-surf-3" />
												</TableCell>
											</TableRow>
										))
									: (countries.data ?? []).map((item) => (
											<TableRow
												key={item.key}
												className="border-b border-bd-1 transition-colors last:border-0 hover:bg-surf-2"
											>
												<TableCell className="px-3.5 py-[10px] text-[12.5px] text-t-1">
													{item.key}
												</TableCell>
												<TableCell className="px-3.5 py-[10px] text-right font-mono text-[12px] text-t-3">
													{item.count.toLocaleString()}
												</TableCell>
											</TableRow>
										))}
								{!countries.isLoading && !countries.data?.length && (
									<TableRow>
										<TableCell colSpan={2} className="px-4 py-10 text-center text-[12px] text-t-3">
											{dict.geography.noData}
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>

					<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
						<div className="border-b border-bd-1 px-4 py-3">
							<p className="text-[13px] font-semibold text-t-1">{dict.geography.cities}</p>
						</div>
						<Table aria-label={dict.geography.cities}>
							<TableHeader>
								<TableRow className="border-b border-bd-1">
									<TableHead className="bg-surf-2 px-3.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
										{dict.geography.city}
									</TableHead>
									<TableHead className="bg-surf-2 px-3.5 py-[10px] text-right text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
										{dict.geography.events}
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{cities.isLoading
									? Array.from({ length: 8 }).map((_, i) => (
											<TableRow key={i} className="border-b border-bd-1">
												<TableCell className="px-3.5 py-[10px]">
													<div className="h-3 w-32 animate-pulse rounded bg-surf-3" />
												</TableCell>
												<TableCell className="px-3.5 py-[10px] text-right">
													<div className="ml-auto h-3 w-16 animate-pulse rounded bg-surf-3" />
												</TableCell>
											</TableRow>
										))
									: (cities.data ?? []).map((item) => (
											<TableRow
												key={item.key}
												className="border-b border-bd-1 transition-colors last:border-0 hover:bg-surf-2"
											>
												<TableCell className="px-3.5 py-[10px] text-[12.5px] text-t-1">
													{item.key}
													{item.country && (
														<span className="ml-1.5 text-[11px] text-t-3">
															{item.country}
														</span>
													)}
												</TableCell>
												<TableCell className="px-3.5 py-[10px] text-right font-mono text-[12px] text-t-3">
													{item.count.toLocaleString()}
												</TableCell>
											</TableRow>
										))}
								{!cities.isLoading && !cities.data?.length && (
									<TableRow>
										<TableCell colSpan={2} className="px-4 py-10 text-center text-[12px] text-t-3">
											{dict.geography.noData}
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
};
