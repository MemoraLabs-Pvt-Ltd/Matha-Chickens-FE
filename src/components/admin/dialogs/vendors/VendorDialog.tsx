import { useState } from "react";
import { Eye, EyeOff, Globe, PhoneCall } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Vendor {
  id: string;
  businessName: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  totalOrders: number;
  billingMode: "Online" | "Offline";
  status: "Active" | "Inactive";
}

interface VendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  vendor?: Vendor | null;
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
        key={`${mode}-${vendor?.id || "new"}-${open ? "open" : "closed"}`}
        mode={mode}
        vendor={vendor}
        onOpenChange={onOpenChange}
      />
    </Dialog>
  );
}

interface VendorDialogBodyProps {
  mode: "add" | "edit";
  vendor?: Vendor | null;
  onOpenChange: (open: boolean) => void;
}

function VendorDialogBody({ mode, vendor, onOpenChange }: VendorDialogBodyProps) {
  const [businessName, setBusinessName] = useState(
    mode === "edit" && vendor ? vendor.businessName : "",
  );
  const [contactPerson, setContactPerson] = useState(
    mode === "edit" && vendor ? vendor.contactPerson : "",
  );
  const [phone, setPhone] = useState(
    mode === "edit" && vendor ? vendor.phone : "",
  );
  const [email, setEmail] = useState(
    mode === "edit" && vendor ? vendor.email : "",
  );
  const [address, setAddress] = useState(
    mode === "edit" && vendor ? vendor.address : "",
  );
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [billingMode, setBillingMode] = useState<"Online" | "Offline">(
    mode === "edit" && vendor ? vendor.billingMode : "Online",
  );
  const [isActive, setIsActive] = useState(
    mode === "edit" && vendor ? vendor.status === "Active" : true,
  );
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (mode === "add") {
      console.log("Create vendor:", {
        businessName,
        contactPerson,
        phone,
        email,
        address,
        loginId,
        password,
        billingMode,
        isActive,
      });
    } else {
      console.log("Update vendor:", {
        id: vendor?.id,
        businessName,
        contactPerson,
        phone,
        email,
        address,
        billingMode,
        isActive,
      });
    }
    onOpenChange(false);
  };

  return (
    <DialogContent className="max-w-[512px]! p-0 gap-0 shadow-none">
      <DialogHeader className="px-6 pt-6 pb-2 gap-2">
        <DialogTitle className="text-lg font-semibold text-foreground">
          {mode === "add" ? "Add Vendor" : "Edit Vendor"}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {mode === "add"
            ? "Create a new vendor for bulk orders"
            : "Update vendor details and billing configuration"}
        </DialogDescription>
      </DialogHeader>

      <div className="px-6 py-4 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Business Name *
            </label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="ABC Poultry Supplies"
              className="bg-muted border-0 h-9"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Contact Person *
            </label>
            <Input
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="John Doe"
              className="bg-muted border-0 h-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Phone *
            </label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="bg-muted border-0 h-9"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vendor@example.com"
              className="bg-muted border-0 h-9"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Address
          </label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123, Main Street, City"
            className="bg-muted border-0 h-9"
          />
        </div>

        <div className="border-t pt-4">
          <h4 className="text-base font-medium text-foreground mb-3">
            Login Credentials
          </h4>
          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Login ID
              </label>
              <Input
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="vendor_login"
                className="bg-muted border-0 h-9"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">
                Password
              </label>
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
        </div>

        <div className="border-t pt-4">
          <h4 className="text-base font-medium text-foreground mb-3">
            Billing Configuration
          </h4>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Billing Mode
            </label>
            <Select
              value={billingMode}
              onValueChange={(value: string) =>
                setBillingMode(value as "Online" | "Offline")
              }
            >
              <SelectTrigger className="bg-muted border-0 h-9 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Online">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-500" />
                    Online (Mobile/Portal)
                  </div>
                </SelectItem>
                <SelectItem value="Offline">
                  <PhoneCall className="h-4 w-4 text-yellow-500" />
                  Offline (Call/In-person)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {billingMode === "Online"
                ? "Vendor can place orders via mobile app or web portal"
                : "Vendor places orders via phone call or in-person visit"}
            </p>
          </div>
        </div>

        <div className="border-t pt-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">
              Status
            </label>
            <p className="text-sm text-muted-foreground">
              {isActive ? "Vendor is active" : "Vendor is inactive"}
            </p>
          </div>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/50 gap-2">
          <Button
            variant="outline"
            className="border-border"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-admin hover:bg-admin/90 text-white"
            onClick={handleSubmit}
          >
            {mode === "add" ? "Create" : "Save Changes"}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  );
}
