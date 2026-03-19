import { Outlet } from "react-router-dom";

import { Watermark } from "@/components/ui/watermark";

export default function RootLayout() {
  return (
    <div className="bg-linear-to-b from-background to-background-secondary min-h-screen relative w-full overflow-hidden isolate">
      <Watermark />
      <div className="relative z-10 min-h-screen w-full">
        <Outlet />
      </div>
    </div>
  );
}
