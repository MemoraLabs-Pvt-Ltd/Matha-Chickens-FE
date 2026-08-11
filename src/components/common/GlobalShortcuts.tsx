import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SHORTCUTS: Record<string, string> = {
  p: "/admin/stocks?new=1",
  s: "/store/billing",
};

export function GlobalShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey || event.ctrlKey || event.metaKey) return;

      const target = SHORTCUTS[event.key.toLowerCase()];
      if (!target) return;

      event.preventDefault();
      navigate(target);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return null;
}
