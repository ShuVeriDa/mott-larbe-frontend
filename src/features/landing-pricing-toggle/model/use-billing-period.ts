"use client";

import { useState } from "react";

export type BillingPeriod = "monthly" | "yearly";

export const useBillingPeriod = (initial: BillingPeriod = "monthly") => {
	const [period, setPeriod] = useState<BillingPeriod>(initial);
	return { period, setPeriod };
};
