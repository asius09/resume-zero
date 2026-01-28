"use client";

import { useEffect, useState } from "react";

export function useIsMac() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  return isMac;
}

export function getModifierKey(isMac: boolean) {
  return isMac ? "⌘" : "Ctrl";
}
