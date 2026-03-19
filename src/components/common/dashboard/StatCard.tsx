import { FaChartLine } from "react-icons/fa";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  iconBg: string;
  icon: IconType;
  iconColor: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  iconBg,
  icon: Icon,
  iconColor,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "border rounded-2xl p-6 flex items-center justify-between shadow-sm",
        iconBg,
      )}
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium leading-5">{title}</p>
        <p className="text-[30px] font-bold leading-9 tracking-wide">{value}</p>
        {(subtitle || trend) && (
          <div className="flex items-center gap-1">
            {trend && <FaChartLine className="size-4 text-admin" />}
            <p className="text-sm font-medium leading-5 text-admin">
              {trend}
            </p>
            {subtitle && (
              <p className="text-sm font-normal leading-5">{subtitle}</p>
            )}
          </div>
        )}
      </div>
      <div
        className={cn(
          "rounded-2xl size-12 flex items-center justify-center shadow-sm",
          iconColor,
        )}
      >
        <Icon className="size-6 text-white" />
      </div>
    </div>
  );
}
