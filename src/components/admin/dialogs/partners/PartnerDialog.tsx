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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreatePartner, useUpdatePartner } from "@/hooks/usePartners";
import { useStores } from "@/hooks/useStores";
import {
  formatIndianPhoneLocalDisplay,
  normalizeIndianPhonePayloadFromLocal,
  sanitizeIndianPhoneLocalInput,
} from "@/lib/display/phone";
import type { CreatePartnerInput, Partner, UpdatePartnerInput } from "@/lib/api/partners";

interface PartnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  partner?: Partner | null;
}

interface PartnerDialogBodyProps {
  mode: "add" | "edit";
  partner?: Partner | null;
  onOpenChange: (open: boolean) => void;
}

export function PartnerDialog({
  open,
  onOpenChange,
  mode,
  partner,
}: PartnerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <PartnerDialogBody
        key={`${mode}-${partner?.id ?? "new"}-${open ? "open" : "closed"}`}
        mode={mode}
        partner={partner}
        onOpenChange={onOpenChange}
      />
    </Dialog>
  );
}

function PartnerDialogBody({
  mode,
  partner,
  onOpenChange,
}: PartnerDialogBodyProps) {
  const createPartner = useCreatePartner();
  const updatePartner = useUpdatePartner();
  const { data: storesData, isLoading: storesLoading } = useStores({ limit: 100 });
  const stores = storesData?.data ?? [];

  const [storeId, setStoreId] = useState<string>("");
  const [name, setName] = useState(
    mode === "edit" && partner ? partner.name : "",
  );
  const [gstin, setGstin] = useState(
    mode === "edit" && partner ? (partner.gstin ?? "") : "",
  );
  const [phone, setPhone] = useState(
    mode === "edit" && partner && partner.phone
      ? formatIndianPhoneLocalDisplay(partner.phone)
      : "",
  );
  const [address, setAddress] = useState(
    mode === "edit" && partner ? (partner.address ?? "") : "",
  );
  const [isActive, setIsActive] = useState(
    mode === "edit" && partner ? partner.status === "active" : true,
  );

  const phoneDigitsCount = phone.replace(/\D/g, "").length;
  const normalizedPhone = normalizeIndianPhonePayloadFromLocal(phone);

  const isPending =
    mode === "add" ? createPartner.isPending : updatePartner.isPending;

  const canSubmit =
    name.trim().length > 0 &&
    (phoneDigitsCount === 0 || phoneDigitsCount === 10) &&
    (mode === "edit" || storeId.length > 0);

  const handleSubmit = () => {
    if (!canSubmit) return;

    if (phoneDigitsCount > 0 && phoneDigitsCount !== 10) {
      toast.error("Enter a valid 10-digit phone number, or leave it blank");
      return;
    }

    const basePayload: UpdatePartnerInput = {
      name: name.trim(),
      gstin: gstin.trim() || undefined,
      phone: phoneDigitsCount === 10 ? normalizedPhone : undefined,
      address: address.trim() || undefined,
      status: isActive ? "active" : "inactive",
    };

    if (mode === "add") {
      if (!storeId) return;
      const payload: CreatePartnerInput = { ...basePayload, store_id: Number(storeId) };
      createPartner.mutate(payload, { onSuccess: () => onOpenChange(false) });
      return;
    }

    if (!partner) return;

    updatePartner.mutate(
      { id: partner.id, data: basePayload },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <DialogContent
      className={adminDialogContentClass({ className: "border-text-muted" })}
    >
      <DialogHeader className={cn(adminDialogHeaderClass, "space-y-1.5")}>
        <DialogTitle className="text-lg font-semibold text-foreground">
          {mode === "add" ? "Add Partner" : "Edit Partner"}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {mode === "add"
            ? "Create a new trade partner"
            : "Update partner information"}
        </DialogDescription>
      </DialogHeader>

      <div className={cn(adminDialogBodyScrollClass, "space-y-4")}>
        {mode === "add" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Store *</Label>
            <Select value={storeId} onValueChange={setStoreId}>
              <SelectTrigger className="w-full h-9 bg-input border-transparent rounded-lg text-sm">
                <SelectValue placeholder={storesLoading ? "Loading stores..." : "Select a store"} />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={String(store.id)}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="partnerName" className="text-sm font-medium text-foreground">
            Partner Name *
          </Label>
          <Input
            id="partnerName"
            placeholder="Enter partner / business name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-input border-transparent rounded-lg h-9 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="partnerGstin" className="text-sm font-medium text-foreground">
            GSTIN
          </Label>
          <Input
            id="partnerGstin"
            placeholder="Enter GSTIN (optional)"
            value={gstin}
            onChange={(e) => setGstin(e.target.value.toUpperCase())}
            className="bg-input border-transparent rounded-lg h-9 text-sm uppercase"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="partnerPhone" className="text-sm font-medium text-foreground">
            Phone Number
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground">
              +91
            </span>
            <Input
              id="partnerPhone"
              type="tel"
              placeholder="98765 43210 (optional)"
              value={phone}
              onChange={(e) => setPhone(sanitizeIndianPhoneLocalInput(e.target.value))}
              className="bg-input border-transparent rounded-lg h-9 text-sm pl-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="partnerAddress" className="text-sm font-medium text-foreground">
            Address
          </Label>
          <textarea
            id="partnerAddress"
            placeholder="Enter address (optional)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-input border-transparent rounded-lg px-3 py-2 text-sm min-h-[64px] w-full resize-none"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
          <div>
            <p className="text-sm font-medium text-foreground">Active</p>
            <p className="text-xs text-muted-foreground">
              Inactive partners are hidden from the sale entry picker
            </p>
          </div>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
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
