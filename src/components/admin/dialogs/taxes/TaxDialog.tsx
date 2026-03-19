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

interface Tax {
  id: string;
  name: string;
  percentage: number;
}

interface TaxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  tax?: Tax | null;
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

interface TaxDialogBodyProps {
  mode: "add" | "edit";
  tax?: Tax | null;
  onOpenChange: (open: boolean) => void;
}

function TaxDialogBody({ mode, tax, onOpenChange }: TaxDialogBodyProps) {
  const [taxName, setTaxName] = useState(
    mode === "edit" && tax ? tax.name : "",
  );
  const [percentage, setPercentage] = useState(
    mode === "edit" && tax ? tax.percentage.toString() : "",
  );

  const handleSubmit = () => {
    if (mode === "add") {
      console.log("Create tax:", { taxName, percentage: parseFloat(percentage) });
    } else {
      console.log("Update tax:", {
        id: tax?.id,
        taxName,
        percentage: parseFloat(percentage),
      });
    }
    onOpenChange(false);
  };

  return (
    <DialogContent className="bg-card rounded-xl border border-border p-0 max-w-[512px]!">
      <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
        <DialogTitle>
          {mode === "add" ? "Add Tax Type" : "Edit Tax Type"}
        </DialogTitle>
        <DialogDescription>
          {mode === "add" ? "Create a new tax type" : "Update tax type details"}
        </DialogDescription>
      </DialogHeader>

      <div className="px-6 py-4 space-y-4">
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
            min="0"
            max="100"
            placeholder="e.g. 5"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
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
          className="h-9 px-4 bg-admin text-white hover:bg-admin/90 rounded-lg"
        >
          {mode === "add" ? "Create" : "Save"}
        </Button>
      </div>
    </DialogContent>
  );
}
