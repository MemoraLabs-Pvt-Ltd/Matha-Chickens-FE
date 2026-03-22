import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  adminDialogBodyScrollClass,
  adminDialogContentClass,
  adminDialogFooterButtonClass,
  adminDialogFooterClass,
  adminDialogHeaderClass,
} from "@/lib/adminDialogContent";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTax, useUpdateTax } from "@/hooks/useTaxes";
import type { Tax } from "@/lib/api/taxes";

interface TaxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  tax?: Tax | null;
}

interface TaxDialogBodyProps {
  mode: "add" | "edit";
  tax?: Tax | null;
  onOpenChange: (open: boolean) => void;
}

function sanitizeNonNegativeNumberInput(value: string): string {
  if (!value.trim()) return "";
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "";
  return parsed < 0 ? "0" : value;
}

export function TaxDialog({
  open,
  onOpenChange,
  mode,
  tax,
}: TaxDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TaxDialogBody
        key={`${mode}-${tax?.id || "new"}-${open ? "open" : "closed"}`}
        mode={mode}
        tax={tax}
        onOpenChange={onOpenChange}
      />
    </Dialog>
  );
}

function TaxDialogBody({ mode, tax, onOpenChange }: TaxDialogBodyProps) {
  const createTax = useCreateTax();
  const updateTax = useUpdateTax();

  const [taxName, setTaxName] = useState(
    mode === "edit" && tax ? tax.name : "",
  );
  const [percentage, setPercentage] = useState(
    mode === "edit" && tax ? tax.percentage.toString() : "",
  );

  const parsedPercentage = Number(percentage);

  const canSubmit =
    taxName.trim().length > 0 &&
    percentage.trim().length > 0 &&
    Number.isFinite(parsedPercentage) &&
    parsedPercentage >= 0;

  const isPending =
    mode === "add" ? createTax.isPending : updateTax.isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const payload = {
      name: taxName.trim(),
      percentage: parsedPercentage,
    };

    if (mode === "add") {
      createTax.mutate(payload, { onSuccess: () => onOpenChange(false) });
      return;
    }

    if (!tax) return;

    updateTax.mutate(
      { id: tax.id, data: payload },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <DialogContent className={adminDialogContentClass()}>
      <DialogHeader className={adminDialogHeaderClass}>
        <DialogTitle>
          {mode === "add" ? "Add Tax Type" : "Edit Tax Type"}
        </DialogTitle>
        <DialogDescription>
          {mode === "add" ? "Create a new tax type" : "Update tax type details"}
        </DialogDescription>
      </DialogHeader>

      <div className={cn(adminDialogBodyScrollClass, "space-y-4")}>
        <div className="space-y-2">
          <Label htmlFor="taxName" className="text-sm font-medium text-foreground">
            Tax Name *
          </Label>
          <Input
            id="taxName"
            placeholder="e.g. GST 5%"
            value={taxName}
            onChange={(e) => setTaxName(e.target.value)}
            className="bg-input border-transparent rounded-lg h-9 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="percentage" className="text-sm font-medium text-foreground">
            Percentage *
          </Label>
          <Input
            id="percentage"
            type="number"
            min={0}
            placeholder="e.g. 5"
            value={percentage}
            onChange={(e) =>
              setPercentage(sanitizeNonNegativeNumberInput(e.target.value))
            }
            className="bg-input border-transparent rounded-lg h-9 text-sm"
          />
        </div>
      </div>

      <div className={adminDialogFooterClass}>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className={cn(
            adminDialogFooterButtonClass,
            "border border-border px-4 text-foreground",
          )}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isPending || !canSubmit}
          className={cn(
            adminDialogFooterButtonClass,
            "bg-admin px-4 text-white hover:bg-admin/90",
          )}
        >
          {isPending ? "Saving..." : mode === "add" ? "Create" : "Save"}
        </Button>
      </div>
    </DialogContent>
  );
}
