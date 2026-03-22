import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  adminDialogBodyScrollClass,
  adminDialogContentClass,
  adminDialogFooterButtonClass,
  adminDialogFooterClass,
  adminDialogHeaderClass,
} from "@/lib/adminDialogContent";
import { cn } from "@/lib/utils";
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
  formatIndianPhoneLocalDisplay,
  normalizeIndianPhonePayloadFromLocal,
  sanitizeIndianPhoneLocalInput,
} from "@/lib/display/phone";
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
    mode === "edit" && supplier
      ? formatIndianPhoneLocalDisplay(supplier.phone_number)
      : "",
  );
  const [address, setAddress] = useState(
    mode === "edit" && supplier ? supplier.address : "",
  );

  const normalizedPhone = normalizeIndianPhonePayloadFromLocal(phoneNumber);
  const phoneDigitsCount = phoneNumber.replace(/\D/g, "").length;

  const isPending =
    mode === "add" ? createSupplier.isPending : updateSupplier.isPending;

  const canSubmit =
    supplierName.trim().length > 0 &&
    phoneDigitsCount === 10 &&
    address.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    if (phoneDigitsCount !== 10) {
      toast.error("Enter a valid 10-digit phone number");
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
    <DialogContent
      className={adminDialogContentClass({ className: "border-text-muted" })}
    >
      <DialogHeader className={cn(adminDialogHeaderClass, "space-y-1.5")}>
        <DialogTitle className="text-lg font-semibold text-foreground">
          {mode === "add" ? "Add Supplier" : "Edit Supplier"}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {mode === "add"
            ? "Create a new supplier"
            : "Update supplier information"}
        </DialogDescription>
      </DialogHeader>

      <div className={cn(adminDialogBodyScrollClass, "space-y-4")}>
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
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground">
              +91
            </span>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="98765 43210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(sanitizeIndianPhoneLocalInput(e.target.value))}
              className="bg-input border-transparent rounded-lg h-9 text-sm pl-12"
            />
          </div>
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
          {isPending ? "Saving..." : mode === "add" ? "Create" : "Update"}
        </Button>
      </div>
    </DialogContent>
  );
}
