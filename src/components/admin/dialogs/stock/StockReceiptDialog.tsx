import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateStockReceipt,
  useUpdateStockReceipt,
} from "@/hooks/useStockReceipts";
import { UNIT_OPTIONS, type Item } from "@/lib/api/items";
import type { Supplier } from "@/lib/api/suppliers";
import type {
  CreateStockReceiptInput,
  StockReceipt,
} from "@/lib/api/stockReceipts";

interface StockReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  receipt?: StockReceipt | null;
  suppliers: Supplier[];
  items: Item[];
}

interface StockReceiptDialogBodyProps {
  mode: "add" | "edit";
  receipt?: StockReceipt | null;
  suppliers: Supplier[];
  items: Item[];
  onOpenChange: (open: boolean) => void;
}

function sanitizeNonNegativeNumberInput(value: string): string {
  if (!value.trim()) return "";
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "";
  return parsed < 0 ? "0" : value;
}

export function StockReceiptDialog({
  open,
  onOpenChange,
  mode,
  receipt,
  suppliers,
  items,
}: StockReceiptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <StockReceiptDialogBody
        key={`${mode}-${receipt?.id ?? "new"}-${open ? "open" : "closed"}`}
        mode={mode}
        receipt={receipt}
        suppliers={suppliers}
        items={items}
        onOpenChange={onOpenChange}
      />
    </Dialog>
  );
}

function StockReceiptDialogBody({
  mode,
  receipt,
  suppliers,
  items,
  onOpenChange,
}: StockReceiptDialogBodyProps) {
  const createStockReceipt = useCreateStockReceipt();
  const updateStockReceipt = useUpdateStockReceipt();

  const [receiptCode, setReceiptCode] = useState(
    mode === "edit" && receipt ? receipt.receipt_code : "",
  );
  const [supplierId, setSupplierId] = useState(
    mode === "edit" && receipt ? String(receipt.supplier_id) : "",
  );
  const [itemId, setItemId] = useState(
    mode === "edit" && receipt ? String(receipt.item_id) : "",
  );
  const [quantity, setQuantity] = useState(
    mode === "edit" && receipt ? String(receipt.quantity) : "",
  );
  const [unit, setUnit] = useState(
    mode === "edit" && receipt ? receipt.unit : "kg",
  );
  const [pricePerUnit, setPricePerUnit] = useState(
    mode === "edit" && receipt ? String(receipt.price_per_unit) : "",
  );
  const [notes, setNotes] = useState(
    mode === "edit" && receipt ? (receipt.notes ?? "") : "",
  );

  const parsedSupplierId = Number(supplierId);
  const parsedItemId = Number(itemId);
  const parsedQuantity = Number(quantity);
  const parsedPricePerUnit = Number(pricePerUnit);

  const total =
    Number.isFinite(parsedQuantity) && Number.isFinite(parsedPricePerUnit)
      ? parsedQuantity * parsedPricePerUnit
      : 0;

  const canSubmit =
    receiptCode.trim().length > 0 &&
    Number.isFinite(parsedSupplierId) &&
    parsedSupplierId > 0 &&
    Number.isFinite(parsedItemId) &&
    parsedItemId > 0 &&
    Number.isFinite(parsedQuantity) &&
    parsedQuantity > 0 &&
    unit.trim().length > 0 &&
    Number.isFinite(parsedPricePerUnit) &&
    parsedPricePerUnit >= 0;

  const isPending =
    mode === "add" ? createStockReceipt.isPending : updateStockReceipt.isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const payload: CreateStockReceiptInput = {
      receipt_code: receiptCode.trim(),
      supplier_id: parsedSupplierId,
      item_id: parsedItemId,
      quantity: parsedQuantity,
      unit: unit.trim(),
      price_per_unit: parsedPricePerUnit,
      notes: notes.trim() || undefined,
    };

    if (mode === "add") {
      createStockReceipt.mutate(payload, { onSuccess: () => onOpenChange(false) });
      return;
    }

    if (!receipt) return;

    updateStockReceipt.mutate(
      { id: receipt.id, data: payload },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <DialogContent className="bg-card rounded-xl border border-border p-0 max-w-[512px]!">
      <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
        <DialogTitle>{mode === "add" ? "Add Stock Receipt" : "Edit Stock Receipt"}</DialogTitle>
        <DialogDescription>
          {mode === "add"
            ? "Add new stock received from supplier"
            : "Update stock receipt details"}
        </DialogDescription>
      </DialogHeader>

      <div className="px-6 py-4 space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="receiptCode"
            className="text-sm font-medium text-foreground"
          >
            Receipt Code *
          </Label>
          <Input
            id="receiptCode"
            placeholder="e.g. REC-2026-001"
            value={receiptCode}
            onChange={(e) => setReceiptCode(e.target.value)}
            className="bg-input border-transparent rounded-lg h-9 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="supplier"
            className="text-sm font-medium text-foreground"
          >
            Supplier *
          </Label>
          <Select value={supplierId} onValueChange={setSupplierId}>
            <SelectTrigger className="w-full bg-input border-transparent rounded-lg h-9 text-sm text-foreground">
              <SelectValue placeholder="Select Supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={String(supplier.id)}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="item"
            className="text-sm font-medium text-foreground"
          >
            Item *
          </Label>
          <Select value={itemId} onValueChange={setItemId}>
            <SelectTrigger className="w-full bg-input border-transparent rounded-lg h-9 text-sm text-foreground">
              <SelectValue placeholder="Select Item" />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="quantity"
              className="text-sm font-medium text-foreground"
            >
              Quantity *
            </Label>
            <Input
              id="quantity"
              type="number"
              min={0}
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) =>
                setQuantity(sanitizeNonNegativeNumberInput(e.target.value))
              }
              className="bg-input border-transparent rounded-lg h-9 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="unit"
              className="text-sm font-medium text-foreground"
            >
              Unit *
            </Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="w-full bg-input border-transparent rounded-lg h-9 text-sm text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNIT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="pricePerUnit"
            className="text-sm font-medium text-foreground"
          >
            Price Per Unit *
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#525252]">
              ₹
            </span>
            <Input
              id="pricePerUnit"
              type="number"
              min={0}
              placeholder="Enter price"
              value={pricePerUnit}
              onChange={(e) =>
                setPricePerUnit(sanitizeNonNegativeNumberInput(e.target.value))
              }
              className="bg-input border-transparent rounded-lg h-9 text-sm pl-8"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="total"
            className="text-sm font-medium text-foreground"
          >
            Total
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#525252]">
              ₹
            </span>
            <Input
              id="total"
              placeholder="Total amount"
              value={total > 0 ? total.toLocaleString() : ""}
              readOnly
              className="bg-[#f3f3f5] border-transparent rounded-lg h-9 text-sm pl-8"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="notes"
            className="text-sm font-medium text-foreground"
          >
            Notes (Optional)
          </Label>
          <Input
            id="notes"
            placeholder="Add notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="bg-input border-transparent rounded-lg h-9 text-sm"
          />
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-muted/50 px-6 py-4 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="h-9 px-4 border border-border text-foreground rounded-lg"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isPending || !canSubmit}
          className="h-9 px-4 bg-admin text-primary-foreground hover:bg-admin/90 rounded-lg"
        >
          {isPending ? "Saving..." : mode === "add" ? "Add Receipt" : "Update Receipt"}
        </Button>
      </div>
    </DialogContent>
  );
}
