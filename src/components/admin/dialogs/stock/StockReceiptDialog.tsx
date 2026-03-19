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
import { Calendar } from "lucide-react";

interface StockReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StockReceiptDialog({
  open,
  onOpenChange,
}: StockReceiptDialogProps) {
  const [date, setDate] = useState("24 Feb 2026");
  const [supplier, setSupplier] = useState("");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [notes, setNotes] = useState("");

  const total =
    quantity && pricePerUnit
      ? parseFloat(quantity) * parseFloat(pricePerUnit)
      : 0;

  const handleSubmit = () => {
    console.log("Add stock receipt:", {
      date,
      supplier,
      item,
      quantity,
      unit,
      pricePerUnit,
      total,
      notes,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card rounded-xl border border-border p-0 max-w-[512px]!">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <DialogTitle>Add Stock Receipt</DialogTitle>
          <DialogDescription>
            Add new stock received from supplier
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="date"
              className="text-sm font-medium text-foreground"
            >
              Date *
            </Label>
            <div className="relative">
              <Input
                id="date"
                placeholder="Select date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-input border-transparent rounded-lg h-9 text-sm pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717182] pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="supplier"
              className="text-sm font-medium text-foreground"
            >
              Supplier *
            </Label>
            <Select value={supplier} onValueChange={setSupplier}>
              <SelectTrigger className="w-full bg-input border-transparent rounded-lg h-9 text-sm text-foreground">
                <SelectValue placeholder="Select Supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ramesh">Ramesh Poultry Farm</SelectItem>
                <SelectItem value="lakshmi">Lakshmi Egg Traders</SelectItem>
                <SelectItem value="krishna">Krishna Meats</SelectItem>
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
            <Select value={item} onValueChange={setItem}>
              <SelectTrigger className="w-full bg-input border-transparent rounded-lg h-9 text-sm text-foreground">
                <SelectValue placeholder="Select Item" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chicken-breast">
                  Fresh Chicken Breast
                </SelectItem>
                <SelectItem value="chicken-drumstick">
                  Chicken Drumstick
                </SelectItem>
                <SelectItem value="chicken-wings">Chicken Wings</SelectItem>
                <SelectItem value="eggs">Farm Fresh Eggs (12 pcs)</SelectItem>
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
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
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
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="dozen">dozen</SelectItem>
                  <SelectItem value="pcs">pcs</SelectItem>
                  <SelectItem value="liters">liters</SelectItem>
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
                placeholder="Enter price"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
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
            className="h-9 px-4 bg-admin text-primary-foreground hover:bg-admin/90 rounded-lg"
          >
            Add Receipt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
