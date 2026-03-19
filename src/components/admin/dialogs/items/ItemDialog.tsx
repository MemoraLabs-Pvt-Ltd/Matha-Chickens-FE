import { useState } from "react";
import { Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { Switch } from "@/components/ui/switch";

interface Item {
  id: string;
  name: string;
  category: string;
  price: string;
  status: "active" | "inactive";
}

interface ItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  item?: Item | null;
  categories: { id: string; name: string }[];
}

export function ItemDialog({
  open,
  onOpenChange,
  mode,
  item,
  categories,
}: ItemDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ItemDialogBody
        key={`${mode}-${item?.id || "new"}-${open ? "open" : "closed"}`}
        mode={mode}
        item={item}
        categories={categories}
        onOpenChange={onOpenChange}
      />
    </Dialog>
  );
}

interface ItemDialogBodyProps {
  mode: "add" | "edit";
  item?: Item | null;
  categories: { id: string; name: string }[];
  onOpenChange: (open: boolean) => void;
}

function ItemDialogBody({
  mode,
  item,
  categories,
  onOpenChange,
}: ItemDialogBodyProps) {
  const [itemName, setItemName] = useState(
    mode === "edit" && item ? item.name : "",
  );
  const [category, setCategory] = useState(
    mode === "edit" && item ? item.category : "",
  );
  const [price, setPrice] = useState(mode === "edit" && item ? item.price : "");
  const [description, setDescription] = useState("");
  const [taxes, setTaxes] = useState([
    { id: "1", name: "GST", percentage: "5" },
  ]);
  const [discountType, setDiscountType] = useState(
    mode === "edit" ? "percentage" : "none",
  );
  const [discountValue, setDiscountValue] = useState(
    mode === "edit" ? "5" : "0",
  );
  const [isActive, setIsActive] = useState(
    mode === "edit" && item ? item.status === "active" : true,
  );

  const addTax = () => {
    setTaxes((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", percentage: "0" },
    ]);
  };

  const removeTax = (id: string) => {
    setTaxes((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTax = (
    id: string,
    field: "name" | "percentage",
    value: string,
  ) => {
    setTaxes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  const basePrice = parseFloat(price) || 0;
  const totalTaxPercentage = taxes.reduce(
    (sum, t) => sum + (parseFloat(t.percentage) || 0),
    0,
  );
  const taxAmount = basePrice * (totalTaxPercentage / 100);
  const discountAmount =
    discountType === "percentage"
      ? basePrice * (parseFloat(discountValue) / 100)
      : parseFloat(discountValue) || 0;
  const afterDiscount = Math.max(0, basePrice - discountAmount);
  const finalPrice = afterDiscount + taxAmount;
  const savings = discountAmount;

  const handleSubmit = () => {
    if (mode === "add") {
      console.log("Create item:", {
        itemName,
        category,
        price,
        description,
        taxes,
        discountType,
        discountValue,
        isActive,
      });
    } else {
      console.log("Update item:", {
        id: item?.id,
        itemName,
        category,
        price,
        description,
        taxes,
        discountType,
        discountValue,
        isActive,
      });
    }
    onOpenChange(false);
  };

  return (
    <DialogContent className="bg-card rounded-xl border border-border p-0 max-w-[512px]! max-h-[85vh] flex flex-col overflow-hidden">
      <DialogHeader className="px-5 pt-5 pb-4 border-b border-border shrink-0">
        <DialogTitle className="text-lg font-semibold text-foreground">
          {mode === "add" ? "Add Item" : "Edit Item"}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {mode === "add"
            ? "Create a new product item"
            : "Update item information"}
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="itemName"
              className="text-sm font-medium text-foreground"
            >
              Item Name *
            </Label>
            <Input
              id="itemName"
              placeholder={
                mode === "add" ? "Enter item name" : "Fresh Chicken Breast"
              }
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="bg-input border-transparent rounded-lg h-9 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-sm font-medium text-foreground"
            >
              Category *
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full h-9 bg-input border-transparent rounded-lg text-sm text-foreground">
                <SelectValue
                  placeholder={
                    mode === "edit" && item ? item.category : "Select category"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="price"
            className="text-sm font-medium text-foreground"
          >
            Selling Price (₹/kg) *
          </Label>
          <Input
            id="price"
            type="number"
            placeholder={mode === "add" ? "0" : "280"}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="flex-1 bg-input border-transparent rounded-lg h-9 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-sm font-medium text-foreground"
          >
            Description (optional)
          </Label>
          <textarea
            id="description"
            placeholder="Enter item description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-input border-transparent rounded-lg px-3 py-2 text-sm min-h-[64px] w-full resize-none"
          />
        </div>

        <div className="border-t border-border pt-3 space-y-3">
          <h3 className="text-base font-semibold text-foreground">
            Tax & Discount
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">
                Taxes
              </Label>
              <Button
                type="button"
                variant="ghost"
                onClick={addTax}
                className="h-7 px-2 text-xs text-admin hover:text-admin/80"
              >
                + Add Tax
              </Button>
            </div>
            <div className="space-y-2">
              {taxes.map((tax) => (
                <div key={tax.id} className="flex items-center gap-2">
                  <Input
                    placeholder="Tax name (e.g., GST)"
                    value={tax.name}
                    onChange={(e) => updateTax(tax.id, "name", e.target.value)}
                    className="flex-1 bg-input border-transparent rounded-lg h-9 text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="%"
                    value={tax.percentage}
                    onChange={(e) =>
                      updateTax(tax.id, "percentage", e.target.value)
                    }
                    className="w-20 bg-input border-transparent rounded-lg h-9 text-sm"
                  />
                  {taxes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeTax(tax.id)}
                      className="size-8 hover:bg-destructive/10 text-destructive"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {taxes.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Total Tax: {totalTaxPercentage}%
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label
                htmlFor="discountType"
                className="text-sm font-medium text-foreground"
              >
                Discount Type
              </Label>
              <Select value={discountType} onValueChange={setDiscountType}>
                <SelectTrigger className="w-full h-9 bg-input border-transparent rounded-lg text-sm text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="flat">Flat (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="discountValue"
                className="text-sm font-medium text-foreground"
              >
                Discount
              </Label>
              <Input
                id="discountValue"
                type="number"
                placeholder="0"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                disabled={discountType === "none"}
                className="bg-input border-transparent rounded-lg h-9 text-sm disabled:opacity-50"
              />
            </div>
          </div>

          {mode === "edit" && (
            <div className="bg-[#FAF5FF] rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-[#59168B]">
                Price Preview (per kg)
              </h4>
              <div className="flex items-center gap-6">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">
                    Original Price
                  </p>
                  <p className="text-base font-semibold text-muted-foreground line-through">
                    ₹{basePrice.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">
                    After Discount
                  </p>
                  <p className="text-base font-semibold text-[#00A63E]">
                    ₹{afterDiscount.toFixed(2)}
                  </p>
                </div>
                {savings > 0 && (
                  <div className="px-2.5 py-1 bg-[#DCFCE7] rounded-full">
                    <p className="text-xs font-medium text-[#00A63E]">
                      Save ₹{savings.toFixed(2)}
                    </p>
                  </div>
                )}
                <div className="space-y-0.5">
                  <p className="text-xs text-foreground">Final Price</p>
                  <p className="text-lg font-semibold text-[#9810FA]">
                    ₹{finalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium text-foreground">
              Status
            </Label>
            <p className="text-sm text-muted-foreground">
              Item is {isActive ? "active" : "inactive"}
            </p>
          </div>
          <Switch
            checked={isActive}
            onCheckedChange={setIsActive}
            className="data-checked:bg-toggle-on [&_[data-slot=switch-thumb]]:bg-white"
          />
        </div>

        {mode === "add" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Upload Image (optional)
            </Label>
            <Button
              type="button"
              variant="outline"
              className="h-8 px-3 border-border text-foreground"
            >
              <Upload className="size-4 mr-2" />
              Upload
            </Button>
          </div>
        )}
      </div>

      <DialogFooter className="shrink-0 border-t border-border px-5 py-4 bg-muted/50 gap-2">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="h-9 px-4 border-border text-foreground rounded-lg"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="h-9 px-4 bg-admin text-primary-foreground hover:bg-admin/90 rounded-lg"
        >
          {mode === "add" ? "Create" : "Update"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
