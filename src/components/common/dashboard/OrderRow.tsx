import { cn } from "@/lib/utils";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPhoneForDisplay } from "@/lib/display/phone";

interface OrderRowProps {
  id: string;
  customer: string;
  phone: string;
  store: string;
  amount: string;
  status: "received" | "dispatched" | "delivered";
  date: string;
}

const statusBadgeStyles = {
  received: "bg-[#dbeafe] text-[#1447e6] border-[#bedbff]",
  dispatched: "bg-[#fef3c6] text-[#bb4d00] border-[#fee685]",
  delivered: "bg-[#dcfce7] text-[#008236] border-[#b9f8cf]",
};

const statusLabels = {
  received: "Order Received",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

export function OrderRow({ id, customer, phone, store, amount, status, date }: OrderRowProps) {
  return (
    <TableRow className="border-[#f5f5f5]">
      <TableCell className="py-4 pl-6">
        <p className="text-base font-semibold text-[#171717]">{id}</p>
      </TableCell>
      <TableCell className="py-4">
        <p className="text-base text-[#171717]">{customer}</p>
        <p className="text-sm text-[#737373]">{formatPhoneForDisplay(phone)}</p>
      </TableCell>
      <TableCell className="py-4">
        <p className="text-base text-[#404040]">{store}</p>
      </TableCell>
      <TableCell className="py-4 pr-6 text-right">
        <p className="text-base font-bold text-[#171717]">{amount}</p>
      </TableCell>
      <TableCell className="py-4 text-center">
        <Badge
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium",
            statusBadgeStyles[status],
          )}
        >
          {statusLabels[status]}
        </Badge>
      </TableCell>
      <TableCell className="py-4 pr-6 text-right">
        <p className="text-sm text-[#525252]">{date}</p>
      </TableCell>
    </TableRow>
  );
}
