"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getServerSnapshot = () => false;
const getClientSnapshot = () => true;

export const useMounted = () =>
	useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
