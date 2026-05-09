"use client";

import { type ComponentProps, useState } from "react";
import type {
	AdminCouponDetail,
	CouponType,
	CreateCouponDto,
	UpdateCouponDto,
	useCouponMutations,
} from "@/entities/admin-coupon";
import { useI18n } from "@/shared/lib/i18n";

const PLANS = ["BASIC", "PRO", "PREMIUM", "LIFETIME"] as const;

const generateCode = () => {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	return Array.from(
		{ length: 8 },
		() => chars[Math.floor(Math.random() * chars.length)],
	).join("");
};

interface FormState {
	code: string;
	name: string;
	type: CouponType;
	amount: string;
	maxRedemptions: string;
	maxPerUser: string;
	applicablePlans: string[];
	validFrom: string;
	validUntil: string;
	newUsersOnly: boolean;
	isStackable: boolean;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const defaultForm = (): FormState => ({
	code: "",
	name: "",
	type: "PERCENT",
	amount: "",
	maxRedemptions: "",
	maxPerUser: "1",
	applicablePlans: [],
	validFrom: "",
	validUntil: "",
	newUsersOnly: false,
	isStackable: false,
});

const fromCoupon = (coupon: AdminCouponDetail): FormState => ({
	code: coupon.code,
	name: coupon.name ?? "",
	type: coupon.type,
	amount: String(coupon.amount),
	maxRedemptions: coupon.maxRedemptions != null ? String(coupon.maxRedemptions) : "",
	maxPerUser: coupon.maxPerUser != null ? String(coupon.maxPerUser) : "1",
	applicablePlans: [...coupon.applicablePlans],
	validFrom: coupon.validFrom ? coupon.validFrom.slice(0, 10) : "",
	validUntil: coupon.validUntil ? coupon.validUntil.slice(0, 10) : "",
	newUsersOnly: coupon.newUsersOnly,
	isStackable: coupon.isStackable,
});

interface UseCreateCouponModalParams {
	editing?: AdminCouponDetail | null;
	mutations: ReturnType<typeof useCouponMutations>;
	onClose: () => void;
}

export const useCreateCouponModal = ({
	editing,
	mutations,
	onClose,
}: UseCreateCouponModalParams) => {
	const { t } = useI18n();
	const [form, setForm] = useState<FormState>(editing ? fromCoupon(editing) : defaultForm);
	const [errors, setErrors] = useState<FormErrors>({});

	const isEdit = Boolean(editing);
	const isPending = mutations.create.isPending || mutations.update.isPending;

	const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const togglePlan = (plan: string) => {
		setField(
			"applicablePlans",
			form.applicablePlans.includes(plan)
				? form.applicablePlans.filter((current) => current !== plan)
				: [...form.applicablePlans, plan],
		);
	};

	const validate = () => {
		const nextErrors: FormErrors = {};
		if (!form.code.trim()) {
			nextErrors.code = t("admin.coupons.modal.errorCodeRequired");
		}
		if (!form.amount || Number.isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
			nextErrors.amount = t("admin.coupons.modal.errorAmountRequired");
		}
		if (form.type === "PERCENT" && Number(form.amount) > 100) {
			nextErrors.amount = t("admin.coupons.modal.errorAmountMax");
		}
		if (form.validFrom && form.validUntil && form.validFrom > form.validUntil) {
			nextErrors.validUntil = t("admin.coupons.modal.errorDateRange");
		}
		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validate()) return;

		const payload: CreateCouponDto = {
			code: form.code.trim().toUpperCase(),
			...(form.name.trim() ? { name: form.name.trim() } : {}),
			type: form.type,
			amount: Number(form.amount),
			...(form.maxRedemptions ? { maxRedemptions: Number(form.maxRedemptions) } : {}),
			...(form.maxPerUser ? { maxPerUser: Number(form.maxPerUser) } : {}),
			applicablePlans: form.applicablePlans,
			...(form.validFrom
				? { validFrom: new Date(form.validFrom).toISOString() }
				: {}),
			...(form.validUntil
				? { validUntil: new Date(`${form.validUntil}T23:59:59`).toISOString() }
				: {}),
			newUsersOnly: form.newUsersOnly,
			isStackable: form.isStackable,
			isActive: true,
		};

		if (isEdit && editing) {
			const updatePayload: UpdateCouponDto = payload;
			await mutations.update.mutateAsync({ id: editing.id, dto: updatePayload });
		} else {
			await mutations.create.mutateAsync(payload);
		}
		onClose();
	};

	const handleCodeChange: NonNullable<ComponentProps<"input">["onChange"]> = (
		event,
	) => setField("code", event.currentTarget.value.toUpperCase());
	const handleGenerateCodeClick: NonNullable<
		ComponentProps<"button">["onClick"]
	> = () => setField("code", generateCode());
	const handleNameChange: NonNullable<ComponentProps<"input">["onChange"]> = (
		event,
	) => setField("name", event.currentTarget.value);
	const handleAmountChange: NonNullable<ComponentProps<"input">["onChange"]> = (
		event,
	) => setField("amount", event.currentTarget.value);
	const handleMaxRedemptionsChange: NonNullable<
		ComponentProps<"input">["onChange"]
	> = (event) => setField("maxRedemptions", event.currentTarget.value);
	const handleMaxPerUserChange: NonNullable<
		ComponentProps<"input">["onChange"]
	> = (event) => setField("maxPerUser", event.currentTarget.value);
	const handleAllPlansClick: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		setField("applicablePlans", []);
	const handleValidFromChange: NonNullable<ComponentProps<"input">["onChange"]> = (
		event,
	) => setField("validFrom", event.currentTarget.value);
	const handleValidUntilChange: NonNullable<ComponentProps<"input">["onChange"]> = (
		event,
	) => setField("validUntil", event.currentTarget.value);
	const handleNewUsersOnlyChange: NonNullable<
		ComponentProps<"input">["onChange"]
	> = (event) => setField("newUsersOnly", event.currentTarget.checked);
	const handleIsStackableChange: NonNullable<
		ComponentProps<"input">["onChange"]
	> = (event) => setField("isStackable", event.currentTarget.checked);
	const handleTypeClick: NonNullable<ComponentProps<"button">["onClick"]> = (
		event,
	) => {
		const type = event.currentTarget.dataset.type as CouponType | undefined;
		if (!type) return;
		setField("type", type);
	};
	const handlePlanClick: NonNullable<ComponentProps<"button">["onClick"]> = (
		event,
	) => {
		const plan = event.currentTarget.dataset.plan;
		if (!plan) return;
		togglePlan(plan);
	};

	return {
		t,
		plans: PLANS,
		isEdit,
		isPending,
		form,
		errors,
		handleSubmit,
		handleCodeChange,
		handleGenerateCodeClick,
		handleNameChange,
		handleAmountChange,
		handleMaxRedemptionsChange,
		handleMaxPerUserChange,
		handleAllPlansClick,
		handleValidFromChange,
		handleValidUntilChange,
		handleNewUsersOnlyChange,
		handleIsStackableChange,
		handleTypeClick,
		handlePlanClick,
	};
};
