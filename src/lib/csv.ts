export function formatCreatedAt(value: string): { date: string; time: string } {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { date: "-", time: "-" };
  }

  return {
    date: date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export function exportReceiptsToCSV(
  receipts: Array<{
    receipt_code: string;
    created_at: string;
    supplier_id: number;
    item_id: number;
    quantity: number;
    unit: string;
    price_per_unit: number;
    notes: string | null;
  }>,
  supplierNameById: Map<number, string>,
  itemNameById: Map<number, string>,
) {
  const headers = [
    "Receipt Code",
    "Date",
    "Time",
    "Supplier",
    "Item",
    "Quantity",
    "Unit",
    "Price/Unit (₹)",
    "Total (₹)",
    "Notes",
  ];

  const rows = receipts.map((receipt) => {
    const createdAt = formatCreatedAt(receipt.created_at);
    return [
      receipt.receipt_code,
      createdAt.date,
      createdAt.time,
      supplierNameById.get(receipt.supplier_id) ?? `Supplier #${receipt.supplier_id}`,
      itemNameById.get(receipt.item_id) ?? `Item #${receipt.item_id}`,
      String(receipt.quantity),
      receipt.unit,
      String(receipt.price_per_unit),
      String(Math.round(receipt.quantity * receipt.price_per_unit)),
      receipt.notes ?? "",
    ];
  });

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => {
          const escaped = String(cell).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `stock-receipts-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
