import * as React from "react";

import watermarkImage from "@/assets/watermark.png";
import { cn } from "@/lib/utils";

interface WatermarkProps extends React.HTMLAttributes<HTMLDivElement> {
  imageSrc?: string;
}

function Watermark({
  className,
  imageSrc = watermarkImage,
  ...props
}: WatermarkProps) {
  return (
    <div
      data-slot="watermark"
      data-node-id="175:4"
      className={cn(
        "pointer-events-none fixed left-[50vw] select-none top-[50vh] -translate-x-1/2 -translate-y-1/2 rotate-30 z-20",
        className,
      )}
      aria-hidden="true"
      style={{
        width: "864px",
        height: "351px",
        opacity: 0.03,
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      {...props}
    />
  );
}

export { Watermark };
