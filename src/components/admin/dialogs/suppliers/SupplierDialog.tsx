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
import { useState } from "react";

interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
}

interface SupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  supplier?: Supplier | null;
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
        key={`${mode}-${supplier?.id || "new"}-${open ? "open" : "closed"}`}
        mode={mode}
        supplier={supplier}
        onOpenChange={onOpenChange}
      />
    </Dialog>
  );
}

interface SupplierDialogBodyProps {
  mode: "add" | "edit";
  supplier?: Supplier | null;
  onOpenChange: (open: boolean) => void;
}

function SupplierDialogBody({
  mode,
  supplier,
  onOpenChange,
}: SupplierDialogBodyProps) {
  const [supplierName, setSupplierName] = useState(
    mode === "edit" && supplier ? supplier.name : "",
  );
  const [phoneNumber, setPhoneNumber] = useState(
    mode === "edit" && supplier ? supplier.phone : "",
  );
  const [address, setAddress] = useState(
    mode === "edit" && supplier ? supplier.address : "",
  );

  const handleSubmit = () => {
    if (mode === "add") {
      console.log("Create supplier:", { supplierName, phoneNumber, address });
    } else {
      console.log("Update supplier:", {
        id: supplier?.id,
        supplierName,
        phoneNumber,
        address,
      });
    }
    onOpenChange(false);
  };

  return (
    <DialogContent className="bg-card rounded-xl border border-text-muted p-6 max-w-[512px]!">
      <DialogHeader className="space-y-1.5">
        <DialogTitle className="text-lg font-semibold text-foreground  ">
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
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="bg-input border-transparent rounded-lg h-9 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="address"
            className="text-sm font-medium text-foreground"
          >
            Address
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
          className="h-9 px-4 bg-admin text-white hover:bg-admin/90 rounded-lg"
        >
          {mode === "add" ? "Create" : "Update"}
        </Button>
      </div>
    </DialogContent>
  );
}
