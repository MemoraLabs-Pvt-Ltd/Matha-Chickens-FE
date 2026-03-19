interface StoreStatRowProps {
  label: string;
  value: string | number;
  valueColor?: string;
}

export function StoreStatRow({ label, value, valueColor }: StoreStatRowProps) {
  return (
    <div className="flex items-center justify-between h-7">
      <p className="text-base text-[#404040]">{label}</p>
      <p
        className="text-xl font-bold"
        style={{ color: valueColor || "#171717" }}
      >
        {value}
      </p>
    </div>
  );
}
