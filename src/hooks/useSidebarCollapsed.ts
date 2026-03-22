import { useCallback, useEffect, useState } from "react";


export function useSidebarCollapsed(storageKey: string) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(storageKey) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, collapsed ? "1" : "0");
    } catch {
      // ignore quota / private mode
    }
  }, [collapsed, storageKey]);

  const toggle = useCallback(() => {
    setCollapsed((c) => !c);
  }, []);

  return { collapsed, setCollapsed, toggle };
}
