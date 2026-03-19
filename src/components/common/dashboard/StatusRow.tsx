import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";

interface StatusRowProps {
  label: string;
  value: number;
  icon: IconType;
  bgColor: string;
}

export function StatusRow({ label, value, icon: Icon, bgColor }: StatusRowProps) {
  return (
    <div className="flex items-center justify-between h-10">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "size-10 rounded-xl flex items-center justify-center",
            bgColor,
          )}
        >
          <Icon className="size-5" />
        </div>
        <p className="text-base text-[#404040]">{label}</p>
      </div>
      <p className="text-xl font-bold text-[#171717]">{value}</p>
    </div>
  );
}
