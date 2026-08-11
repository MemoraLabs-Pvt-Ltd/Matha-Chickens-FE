import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Keyed by KeyboardEvent.code (physical key), not .key: on Mac, holding
// Option remaps .key to an accented/special character (e.g. Option+P -> "π"),
// while .code stays "KeyP" regardless of platform or modifier.
const SHORTCUTS: Record<string, string> = {
  KeyP: "/admin/stocks",
  KeyS: "/admin/sales",
  KeyE: "/admin/expenses",
};

export function GlobalShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey || event.ctrlKey || event.metaKey) return;

      const target = SHORTCUTS[event.code];
      if (!target) return;

      event.preventDefault();
      navigate(target);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return null;
}
