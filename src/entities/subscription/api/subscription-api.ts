import { http } from "@/shared/api";
import type {
	PaymentsQuery,
	PaymentsResponse,
	PlansResponse,
	RedeemPromoResult,
	SubscribeRequest,
	SubscribeResult,
	Subscription,
	UsageResponse,
} from "./types";

export const subscriptionApi = {
	getPlans: async (): Promise<PlansResponse> => {
		const { data } = await http.get<PlansResponse>("/plans");
		return data;
	},

	getMySubscription: async (): Promise<Subscription | null> => {
		const { data } = await http.get<Subscription | null>("/subscription/me");
		return data;
	},

	getMyPayments: async (
		query: PaymentsQuery = {},
	): Promise<PaymentsResponse> => {
		const { data } = await http.get<PaymentsResponse>(
			"/subscription/payments",
			{
				params: {
					...(query.limit ? { limit: query.limit } : {}),
					...(query.cursor ? { cursor: query.cursor } : {}),
				},
			},
		);
		return data;
	},

	getUsage: async (): Promise<UsageResponse> => {
		const { data } = await http.get<UsageResponse>("/subscription/usage");
		return data;
	},

	subscribe: async (body: SubscribeRequest): Promise<SubscribeResult> => {
		const { data } = await http.post<SubscribeResult>(
			"/subscription/subscribe",
			body,
		);
		return data;
	},

	startTrial: async (body: SubscribeRequest): Promise<Subscription> => {
		const { data } = await http.post<Subscription>("/subscription/trial", body);
		return data;
	},

	cancel: async (): Promise<Subscription> => {
		const { data } = await http.delete<Subscription>("/subscription");
		return data;
	},

	redeemPromo: async (code: string): Promise<RedeemPromoResult> => {
		const { data } = await http.post<RedeemPromoResult>("/subscription/promo", {
			code,
		});
		return data;
	},
};
