import { Outlet, useLocation } from "react-router-dom";

import { Watermark } from "@/components/ui/watermark";

export default function RootLayout() {
  const { pathname } = useLocation();
  const showWatermark = pathname !== "/";

  return (
    <div className="bg-linear-to-b from-background to-background-secondary min-h-screen relative w-full overflow-x-hidden isolate">
      {showWatermark ? <Watermark /> : null}
      <div className="relative z-10 min-h-screen w-full">
        <Outlet />
      </div>
    </div>
  );
}
