"use client";

import {
	notificationKeys,
	type Notification,
	type UnreadCountResponse,
} from "@/entities/notification";
import { WS_URL } from "@/shared/config";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const MAX_TRANSPORT_ATTEMPTS = 10;
const MAX_AUTH_RETRIES = 3;

export const useNotificationSocket = (isAuthenticated: boolean) => {
	const queryClient = useQueryClient();
	const wsRef = useRef<WebSocket | null>(null);
	const transportAttempt = useRef(0);
	const authRetries = useRef(0);
	const isMounted = useRef(true);

	useEffect(() => {
		isMounted.current = true;

		if (!isAuthenticated) return;

		const connect = () => {
			if (!isMounted.current) return;

			const ws = new WebSocket(`${WS_URL}/ws/notifications`);
			wsRef.current = ws;

			ws.onmessage = (event: MessageEvent<string>) => {
				let notification: Notification;
				try {
					notification = JSON.parse(event.data) as Notification;
				} catch {
					return;
				}

				queryClient.setQueryData<Notification[]>(
					notificationKeys.list(),
					(old) => {
						if (!old) return [notification];
						// Deduplicate: skip if already in cache (e.g. after invalidateQueries refetch)
						if (old.some((n) => n.id === notification.id)) return old;
						return [notification, ...old];
					},
				);

				// Invalidate unreadCount so it's fetched fresh from the server —
				// avoids double-counting if the cache was already stale or empty.
				void queryClient.invalidateQueries({
					queryKey: notificationKeys.unreadCount(),
				});
			};

			ws.onopen = () => {
				transportAttempt.current = 0;
				authRetries.current = 0;
			};

			ws.onclose = (event: CloseEvent) => {
				if (!isMounted.current) return;

				if (event.code === 4001) {
					authRetries.current += 1;
					if (authRetries.current > MAX_AUTH_RETRIES) return;
					// Wait for next successful REST request to refresh cookie, then retry slowly
					const delay = 5000 * authRetries.current;
					setTimeout(connect, delay);
				} else {
					transportAttempt.current += 1;
					if (transportAttempt.current > MAX_TRANSPORT_ATTEMPTS) return;
					const delay = Math.min(1000 * 2 ** transportAttempt.current, 30_000);
					setTimeout(connect, delay);
				}
			};
		};

		connect();

		return () => {
			isMounted.current = false;
			wsRef.current?.close();
			wsRef.current = null;
		};
	}, [isAuthenticated, queryClient]);
};
