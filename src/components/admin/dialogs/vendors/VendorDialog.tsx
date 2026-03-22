import { useState } from "react";
import { Eye, EyeOff, Globe, PhoneCall } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { useCreateVendor, useUpdateVendor } from "@/hooks/useVendors";
import {
  formatIndianPhoneLocalDisplay,
  normalizeIndianPhonePayloadFromLocal,
  sanitizeIndianPhoneLocalInput,
} from "@/lib/display/phone";
import type {
  CreateVendorInput,
  UpdateVendorInput,
  Vendor,
  VendorBillingMode,
  VendorDiscountType,
  VendorStatus,
} from "@/lib/api/vendors";
import {
  adminDialogBodyScrollClass,
  adminDialogContentClass,
  adminDialogFooterButtonClass,
  adminDialogFooterClass,
  adminDialogHeaderClass,
} from "@/lib/adminDialogContent";
import { cn } from "@/lib/utils";

interface VendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  vendor?: Vendor | null;
}

interface VendorDialogBodyProps {
  mode: "add" | "edit";
  vendor?: Vendor | null;
  onOpenChange: (open: boolean) => void;
}

export function VendorDialog({
  open,
  onOpenChange,
  mode,
  vendor,
}: VendorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <VendorDialogBody
        key={`${mode}-${vendor?.id ?? "new"}-${open ? "open" : "closed"}`}
        mode={mode}
        vendor={vendor}
        onOpenChange={onOpenChange}
      />
    </Dialog>
  );
}

function VendorDialogBody({ mode, vendor, onOpenChange }: VendorDialogBodyProps) {
  const createVendor = useCreateVendor();
  const updateVendor = useUpdateVendor();

  const [businessName, setBusinessName] = useState(
    mode === "edit" && vendor ? vendor.business_name : "",
  );
  const [contactPerson, setContactPerson] = useState(
    mode === "edit" && vendor ? vendor.contact_person : "",
  );
  const [phone, setPhone] = useState(
    mode === "edit" && vendor ? formatIndianPhoneLocalDisplay(vendor.phone) : "",
  );
  const [email, setEmail] = useState(
    mode === "edit" && vendor ? (vendor.email ?? "") : "",
  );
  const [address, setAddress] = useState(
    mode === "edit" && vendor ? (vendor.address ?? "") : "",
  );
  const [loginId, setLoginId] = useState(
    mode === "edit" && vendor ? (vendor.login_id ?? "") : "",
  );
  const [password, setPassword] = useState("");
  const [billingMode, setBillingMode] = useState<VendorBillingMode>(
    mode === "edit" && vendor ? vendor.billing_mode : "online",
  );
  const [discountType, setDiscountType] = useState<VendorDiscountType>(
    mode === "edit" && vendor ? vendor.discount_type : "none",
  );
  const [discountValue, setDiscountValue] = useState(
    mode === "edit" && vendor ? String(vendor.discount_value) : "0",
  );
  const [status, setStatus] = useState<VendorStatus>(
    mode === "edit" && vendor ? vendor.status : "active",
  );
  const [showPassword, setShowPassword] = useState(false);

  const normalizedPhone = normalizeIndianPhonePayloadFromLocal(phone);
  const phoneDigitsCount = phone.replace(/\D/g, "").length;
  const parsedDiscountValue = Number(discountValue);

  const isPending = mode === "add" ? createVendor.isPending : updateVendor.isPending;

  const isDiscountValid =
    discountValue.trim().length > 0 &&
    Number.isFinite(parsedDiscountValue) &&
    parsedDiscountValue >= 0;

  const isPasswordRequired =
    mode === "add" ||
    (mode === "edit" &&
      vendor &&
      loginId.trim() !== (vendor.login_id ?? "").trim());

  const canSubmit =
    businessName.trim().length > 0 &&
    contactPerson.trim().length > 0 &&
    phoneDigitsCount === 10 &&
    loginId.trim().length > 0 &&
    isDiscountValid &&
    (!isPasswordRequired || password.trim().length >= 6);

  const handleSubmit = () => {
    if (!canSubmit) return;

    if (phoneDigitsCount !== 10) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    if (isPasswordRequired && password.trim().length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const basePayload = {
      business_name: businessName.trim(),
      contact_person: contactPerson.trim(),
      phone: normalizedPhone,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      login_id: loginId.trim(),
      billing_mode: billingMode,
      discount_type: discountType,
      discount_value: parsedDiscountValue,
      status,
    };

    if (mode === "add") {
      const payload: CreateVendorInput = {
        ...basePayload,
        password: password.trim(),
      };
      createVendor.mutate(payload, {
        onSuccess: () => onOpenChange(false),
      });
      return;
    }

    if (!vendor) return;

    const payload: UpdateVendorInput = {
      ...basePayload,
      password: password.trim() || undefined,
    };

    updateVendor.mutate(
      { id: vendor.id, data: payload },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  return (
    <DialogContent
      className={adminDialogContentClass({ variant: "plain", className: "gap-0" })}
    >
      <DialogHeader className={cn(adminDialogHeaderClass, "gap-2 sm:pb-2")}>
        <DialogTitle className="text-lg font-semibold text-foreground">
          {mode === "add" ? "Add Vendor" : "Edit Vendor"}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {mode === "add"
            ? "Create a new vendor for bulk orders"
            : "Update vendor details and billing configuration"}
        </DialogDescription>
      </DialogHeader>

      <div className={cn(adminDialogBodyScrollClass, "flex flex-col gap-4")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">
              Business Name *
            </Label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="ABC Poultry Supplies"
              className="bg-muted border-0 h-9"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">
              Contact Person *
            </Label>
            <Input
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="John Doe"
              className="bg-muted border-0 h-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">
              Phone *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground">
                +91
              </span>
              <Input
                value={phone}
                onChange={(e) => setPhone(sanitizeIndianPhoneLocalInput(e.target.value))}
                placeholder="98765 43210"
                className="bg-muted border-0 h-9 pl-12"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vendor@example.com"
              className="bg-muted border-0 h-9"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-foreground">Address</Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123, Main Street, City"
            className="bg-muted border-0 h-9"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">Login ID *</Label>
            <Input
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="vendor@example.com"
              className="bg-muted border-0 h-9"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">
              {isPasswordRequired ? "Password *" : "Password (optional)"}
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-muted border-0 h-9 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-muted-foreground" />
                ) : (
                  <Eye size={18} className="text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">
              Billing Mode *
            </Label>
            <Select
              value={billingMode}
              onValueChange={(value) => setBillingMode(value as VendorBillingMode)}
            >
              <SelectTrigger className="bg-muted border-0 h-9 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-admin" />
                    Online
                  </div>
                </SelectItem>
                <SelectItem value="offline">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="h-4 w-4 text-store" />
                    Offline
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">
              Discount Type *
            </Label>
            <Select
              value={discountType}
              onValueChange={(value) => setDiscountType(value as VendorDiscountType)}
            >
              <SelectTrigger className="bg-muted border-0 h-9 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="flat">Flat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">
              Discount Value *
            </Label>
            <Input
              type="number"
              min={0}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="bg-muted border-0 h-9"
            />
          </div>
          <div className="flex items-center justify-between pt-0 sm:pt-7">
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium text-foreground">Status</Label>
              <p className="text-xs text-muted-foreground">
                {status === "active" ? "Active" : "Inactive"}
              </p>
            </div>
            <Switch
              checked={status === "active"}
              onCheckedChange={(checked) =>
                setStatus(checked ? "active" : "inactive")
              }
            />
          </div>
        </div>
      </div>

      <div className={adminDialogFooterClass}>
        <Button
          variant="outline"
          className={cn(adminDialogFooterButtonClass, "border-border")}
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button
          className={cn(
            adminDialogFooterButtonClass,
            "bg-admin text-white hover:bg-admin/90",
          )}
          onClick={handleSubmit}
          disabled={!canSubmit || isPending}
        >
          {isPending ? "Saving..." : mode === "add" ? "Create" : "Save Changes"}
        </Button>
      </div>
    </DialogContent>
  );
}
