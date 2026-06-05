"use client";

import { useState } from "react";

export const useNotificationBell = () => {
	const [isOpen, setIsOpen] = useState(false);

	const handleOpen = () => setIsOpen(true);
	const handleClose = () => setIsOpen(false);
	const handleToggle = () => setIsOpen((prev) => !prev);

	return { isOpen, handleOpen, handleClose, handleToggle };
};
