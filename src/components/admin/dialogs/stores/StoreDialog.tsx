import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Switch } from "@/components/ui/switch";
import { useCreateStore, useUpdateStore } from "@/hooks/useStores";
import {
  formatIndianPhoneLocalDisplay,
  normalizeIndianPhonePayloadFromLocal,
  sanitizeIndianPhoneLocalInput,
} from "@/lib/display/phone";
import type { CreateStoreInput, Store, UpdateStoreInput } from "@/lib/api/stores";

interface StoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  store?: Store | null;
}

interface StoreDialogBodyProps {
  mode: "add" | "edit";
  store?: Store | null;
  onOpenChange: (open: boolean) => void;
}

function sanitizeNonNegativeNumberInput(value: string): string {
  if (!value.trim()) return "";
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "";
  return parsed < 0 ? "0" : value;
}

export function StoreDialog({
  open,
  onOpenChange,
  mode,
  store,
}: StoreDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <StoreDialogBody
        key={`${mode}-${store?.id ?? "new"}-${open ? "open" : "closed"}`}
        mode={mode}
        store={store}
        onOpenChange={onOpenChange}
      />
    </Dialog>
  );
}

function StoreDialogBody({ mode, store, onOpenChange }: StoreDialogBodyProps) {
  const createStore = useCreateStore();
  const updateStore = useUpdateStore();

  const [storeName, setStoreName] = useState(
    mode === "edit" && store ? store.name : "",
  );
  const [phone, setPhone] = useState(
    mode === "edit" && store ? formatIndianPhoneLocalDisplay(store.phone) : "",
  );
  const [address, setAddress] = useState(
    mode === "edit" && store ? store.address : "",
  );
  const [loginId, setLoginId] = useState(
    mode === "edit" && store ? store.login_id : "",
  );
  const [password, setPassword] = useState("");
  const [enableDiscount, setEnableDiscount] = useState(
    mode === "edit" && store ? store.enable_discount : false,
  );
  const [discountPercentage, setDiscountPercentage] = useState(
    mode === "edit" && store ? String(store.discount_percent ?? 0) : "0",
  );
  const [isTaxApplicable, setIsTaxApplicable] = useState(
    mode === "edit" && store ? store.is_tax_applicable : false,
  );
  const [isActive, setIsActive] = useState(
    mode === "edit" && store ? store.status !== "inactive" : true,
  );

  const isPending =
    mode === "add" ? createStore.isPending : updateStore.isPending;

  const emailChanged =
    mode === "edit" && store ? loginId.trim() !== store.login_id : false;

  const requiresPassword = mode === "add" || emailChanged;
  const normalizedPhone = normalizeIndianPhonePayloadFromLocal(phone);
  const phoneDigitsCount = phone.replace(/\D/g, "").length;

  const canSubmit =
    storeName.trim().length > 0 &&
    phoneDigitsCount === 10 &&
    address.trim().length > 0 &&
    loginId.trim().length > 0 &&
    (!requiresPassword || password.trim().length > 0);

  const handleSubmit = () => {
    if (!canSubmit) return;

    if (phoneDigitsCount !== 10) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    if (requiresPassword && password.trim().length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const parsedDiscountPercent = Number(discountPercentage || "0");
    if (!Number.isFinite(parsedDiscountPercent) || parsedDiscountPercent < 0) {
      toast.error("Discount must be a positive number");
      return;
    }

    const basePayload = {
      name: storeName.trim(),
      phone: normalizedPhone,
      address: address.trim(),
      login_id: loginId.trim(),
      enable_discount: enableDiscount,
      discount_percent: enableDiscount ? parsedDiscountPercent : 0,
      is_tax_applicable: isTaxApplicable,
      status: isActive ? ("active" as const) : ("inactive" as const),
    };

    if (mode === "add") {
      const payload: CreateStoreInput = {
        ...basePayload,
        password: password.trim(),
      };

      createStore.mutate(payload, { onSuccess: () => onOpenChange(false) });
      return;
    }

    if (!store) return;

    const payload: UpdateStoreInput = {
      ...basePayload,
      password: password.trim() ? password.trim() : undefined,
    };

    updateStore.mutate(
      { id: store.id, data: payload },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <DialogContent className={adminDialogContentClass()}>
      <DialogHeader className={adminDialogHeaderClass}>
        <DialogTitle>
          {mode === "add" ? "Create Store" : "Edit Store"}
        </DialogTitle>
        <DialogDescription>
          {mode === "add"
            ? "Create a new store and login account"
            : "Update store information and configuration"}
        </DialogDescription>
      </DialogHeader>

      <div className={cn(adminDialogBodyScrollClass, "space-y-4")}>
        <div className="grid grid-cols-1 gap-4 min-w-0 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="storeName"
              className="text-sm font-medium text-foreground"
            >
              Store Name *
            </Label>
            <Input
              id="storeName"
              placeholder="Enter store name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="bg-input border-transparent rounded-lg h-9 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-medium text-foreground"
            >
              Phone *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground">
                +91
              </span>
              <Input
                id="phone"
                type="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(sanitizeIndianPhoneLocalInput(e.target.value))}
                className="bg-input border-transparent rounded-lg h-9 text-sm pl-12"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="address"
            className="text-sm font-medium text-foreground"
          >
            Address *
          </Label>
          <Input
            id="address"
            placeholder="Enter store address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-input border-transparent rounded-lg h-9 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 min-w-0 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="loginId"
              className="text-sm font-medium text-foreground"
            >
              Login ID (Email) *
            </Label>
            <Input
              id="loginId"
              type="email"
              placeholder="store@example.com"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="bg-input border-transparent rounded-lg h-9 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              {mode === "add"
                ? "Password *"
                : "Password (optional, required if login changes)"}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={mode === "add" ? "Enter password" : "Leave blank to keep unchanged"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-input border-transparent rounded-lg h-9 text-sm"
            />
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-3">
          <h4 className="text-base font-medium text-foreground">
            Discount Configuration
          </h4>
          <div className="flex items-center justify-between">
            <Label
              htmlFor="enableDiscount"
              className="text-sm font-medium text-foreground"
            >
              Enable Discount
            </Label>
            <Switch
              id="enableDiscount"
              checked={enableDiscount}
              onCheckedChange={setEnableDiscount}
            />
          </div>

          {enableDiscount && (
            <div className="space-y-2">
              <Label
                htmlFor="discountPercentage"
                className="text-sm font-medium text-foreground"
              >
                Discount Percentage
              </Label>
              <Input
                id="discountPercentage"
                type="number"
                min={0}
                max={100}
                placeholder="Enter percentage"
                value={discountPercentage}
                onChange={(e) =>
                  setDiscountPercentage(
                    sanitizeNonNegativeNumberInput(e.target.value),
                  )
                }
                className="bg-input border-transparent rounded-lg h-9 text-sm"
              />
            </div>
          )}
        </div>

        <div className="border-t border-border pt-4 space-y-3">
          <h4 className="text-base font-medium text-foreground">
            Tax Configuration
          </h4>
          <div className="flex items-center justify-between">
            <Label
              htmlFor="isTaxApplicable"
              className="text-sm font-medium text-foreground"
            >
              Is Tax Applicable
            </Label>
            <Switch
              id="isTaxApplicable"
              checked={isTaxApplicable}
              onCheckedChange={setIsTaxApplicable}
            />
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="storeStatus"
              className="text-sm font-medium text-foreground"
            >
              Store Status
            </Label>
            <Switch
              id="storeStatus"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
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
            "bg-admin px-4 text-primary-foreground hover:bg-admin/90",
          )}
        >
          {isPending ? "Saving..." : mode === "add" ? "Create" : "Update"}
        </Button>
      </div>
    </DialogContent>
  );
}
