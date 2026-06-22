import { create } from "zustand";

interface TelegramToastStore {
	pendingSmartTrigger: boolean;
	triggerSmartMoment: () => void;
	consumeSmartTrigger: () => void;
}

export const useTelegramToastStore = create<TelegramToastStore>(set => ({
	pendingSmartTrigger: false,
	triggerSmartMoment: () => set({ pendingSmartTrigger: true }),
	consumeSmartTrigger: () => set({ pendingSmartTrigger: false }),
}));
