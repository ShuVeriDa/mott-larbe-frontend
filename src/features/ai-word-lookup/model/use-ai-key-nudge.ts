"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "ai_key_nudge_dismissed";

export const useAiKeyNudge = () => {
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    setIsDismissed(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setIsDismissed(true);
  };

  return { showNudge: !isDismissed, dismiss };
};
