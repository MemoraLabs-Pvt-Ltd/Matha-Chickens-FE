import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateSupplier, useUpdateSupplier } from "@/hooks/useSuppliers";
import {
  formatPhoneForDisplay,
  normalizePhoneForPayload,
  sanitizePhoneForDisplayInput,
} from "@/lib/phone";
import type { CreateSupplierInput, Supplier } from "@/lib/api/suppliers";

interface SupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  supplier?: Supplier | null;
}

interface SupplierDialogBodyProps {
  mode: "add" | "edit";
  supplier?: Supplier | null;
  onOpenChange: (open: boolean) => void;
}

export function SupplierDialog({
  open,
  onOpenChange,
  mode,
  supplier,
}: SupplierDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <SupplierDialogBody
        key={`${mode}-${supplier?.id ?? "new"}-${open ? "open" : "closed"}`}
        mode={mode}
        supplier={supplier}
        onOpenChange={onOpenChange}
      />
    </Dialog>
  );
}

function SupplierDialogBody({
  mode,
  supplier,
  onOpenChange,
}: SupplierDialogBodyProps) {
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();

  const [supplierName, setSupplierName] = useState(
    mode === "edit" && supplier ? supplier.name : "",
  );
  const [phoneNumber, setPhoneNumber] = useState(
    mode === "edit" && supplier ? formatPhoneForDisplay(supplier.phone_number) : "",
  );
  const [address, setAddress] = useState(
    mode === "edit" && supplier ? supplier.address : "",
  );

  const normalizedPhone = normalizePhoneForPayload(phoneNumber);

  const isPending =
    mode === "add" ? createSupplier.isPending : updateSupplier.isPending;

  const canSubmit =
    supplierName.trim().length > 0 &&
    normalizedPhone.length > 0 &&
    address.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    if (!normalizedPhone.startsWith("+")) {
      toast.error("Phone must include country code, e.g. +91 98765 43210");
      return;
    }

    if (normalizedPhone.length < 8 || normalizedPhone.length > 16) {
      toast.error("Enter a valid phone number");
      return;
    }

    const payload: CreateSupplierInput = {
      name: supplierName.trim(),
      phone_number: normalizedPhone,
      address: address.trim(),
    };

    if (mode === "add") {
      createSupplier.mutate(payload, { onSuccess: () => onOpenChange(false) });
      return;
    }

    if (!supplier) return;

    updateSupplier.mutate(
      { id: supplier.id, data: payload },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <DialogContent className="bg-card rounded-xl border border-text-muted p-6 max-w-[512px]!">
      <DialogHeader className="space-y-1.5">
        <DialogTitle className="text-lg font-semibold text-foreground">
          {mode === "add" ? "Add Supplier" : "Edit Supplier"}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {mode === "add"
            ? "Create a new supplier"
            : "Update supplier information"}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="supplierName"
            className="text-sm font-medium text-foreground"
          >
            Supplier Name *
          </Label>
          <Input
            id="supplierName"
            placeholder="Enter supplier name"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            className="bg-input border-transparent rounded-lg h-9 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="phoneNumber"
            className="text-sm font-medium text-foreground"
          >
            Phone Number *
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="+91 98765 43210"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(sanitizePhoneForDisplayInput(e.target.value))}
            className="bg-input border-transparent rounded-lg h-9 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="address"
            className="text-sm font-medium text-foreground"
          >
            Address *
          </Label>
          <textarea
            id="address"
            placeholder="Enter supplier address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-input border-transparent rounded-lg px-3 py-2 text-sm min-h-[64px] w-full resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
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
          className="h-9 px-4 bg-admin text-white hover:bg-admin/90 rounded-lg"
        >
          {isPending ? "Saving..." : mode === "add" ? "Create" : "Update"}
        </Button>
      </div>
    </DialogContent>
  );
}
