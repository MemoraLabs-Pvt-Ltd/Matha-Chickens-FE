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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PinCodesInput } from "@/components/admin/dialogs/stores/PinCodesInput";

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  discount: string;
  tax: string;
  status: "active" | "inactive";
  loginId?: string;
  password?: string;
  pinCodes?: string[];
}

interface StoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  store?: Store | null;
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
        key={`${mode}-${store?.id || "new"}-${open ? "open" : "closed"}`}
        mode={mode}
        store={store}
        onOpenChange={onOpenChange}
      />
    </Dialog>
  );
}

interface StoreDialogBodyProps {
  mode: "create" | "edit";
  store?: Store | null;
  onOpenChange: (open: boolean) => void;
}

function StoreDialogBody({ mode, store, onOpenChange }: StoreDialogBodyProps) {
  const [storeName, setStoreName] = useState(
    mode === "edit" && store ? store.name : "",
  );
  const [phone, setPhone] = useState(
    mode === "edit" && store ? store.phone : "",
  );
  const [address, setAddress] = useState(
    mode === "edit" && store ? store.address : "",
  );
  const [loginId, setLoginId] = useState(
    mode === "edit" && store ? store.loginId || "" : "",
  );
  const [password, setPassword] = useState(
    mode === "edit" && store ? store.password || "" : "",
  );
  const [enableDiscount, setEnableDiscount] = useState(
    mode === "edit" && store ? store.discount !== "No Discount" : false,
  );
  const [discountPercentage, setDiscountPercentage] = useState(
    mode === "edit" && store && store.discount !== "No Discount"
      ? store.discount.replace("%", "")
      : "",
  );
  const [taxType, setTaxType] = useState(
    mode === "edit" && store
      ? store.tax === "No Tax (0%)" ? "no-tax" : "gst-5"
      : "no-tax",
  );
  const [storeStatus, setStoreStatus] = useState(
    mode === "edit" && store ? store.status === "active" : true,
  );
  const [pinCodes, setPinCodes] = useState<string[]>(
    mode === "edit" && store ? store.pinCodes || ["560001"] : [],
  );

  const handleSubmit = () => {
    if (mode === "create") {
      console.log("Create store:", {
        storeName,
        phone,
        address,
        loginId,
        password,
        enableDiscount,
        discountPercentage: enableDiscount ? discountPercentage : "No Discount",
        taxType,
        storeStatus,
        pinCodes,
      });
    } else {
      console.log("Update store:", {
        id: store?.id,
        storeName,
        phone,
        address,
        loginId,
        password,
        enableDiscount,
        discountPercentage: enableDiscount ? discountPercentage : "No Discount",
        taxType,
        storeStatus,
        pinCodes,
      });
    }
    onOpenChange(false);
  };

  return (
    <DialogContent className="bg-card rounded-xl border border-border p-0 max-w-[512px]! max-h-[85vh] flex flex-col overflow-hidden">
      <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
        <DialogTitle>
          {mode === "create" ? "Create Store" : "Edit Store"}
        </DialogTitle>
        <DialogDescription>
          Store information and configuration
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
        <div className="grid grid-cols-2 gap-4 min-w-0">
          <div className="space-y-2">
            <Label htmlFor="storeName" className="text-sm font-medium text-foreground">
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
            <Label htmlFor="phone" className="text-sm font-medium text-foreground">
              Phone *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-input border-transparent rounded-lg h-9 text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium text-foreground">
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

        <div className="grid grid-cols-2 gap-4 min-w-0">
          <div className="space-y-2">
            <Label htmlFor="loginId" className="text-sm font-medium text-foreground">
              Login ID *
            </Label>
            <Input
              id="loginId"
              placeholder="Enter login ID"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="bg-input border-transparent rounded-lg h-9 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password *
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
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
            <Label htmlFor="enableDiscount" className="text-sm font-medium text-foreground">
              Enable Discount
            </Label>
            <Switch
              id="enableDiscount"
              checked={enableDiscount}
              onCheckedChange={setEnableDiscount}
            />
          </div>
          {mode === "edit" && (
            <div className="space-y-2">
              <Label htmlFor="discountPercentage" className="text-sm font-medium text-foreground">
                Discount Percentage
              </Label>
              <Input
                id="discountPercentage"
                placeholder="Enter percentage"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                disabled={!enableDiscount}
                className="bg-input border-transparent rounded-lg h-9 text-sm"
              />
            </div>
          )}
        </div>

        <div className="border-t border-border pt-4 space-y-3">
          <h4 className="text-base font-medium text-foreground">
            Tax Configuration
          </h4>
          <Select value={taxType} onValueChange={setTaxType}>
            <SelectTrigger className="w-full bg-input border-transparent rounded-lg h-9 text-sm text-foreground">
              <SelectValue placeholder="Select tax type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-tax">No Tax (0%)</SelectItem>
              <SelectItem value="gst-5">GST 5%</SelectItem>
              <SelectItem value="gst-12">GST 12%</SelectItem>
              <SelectItem value="gst-18">GST 18%</SelectItem>
              <SelectItem value="gst-28">GST 28%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="storeStatus" className="text-sm font-medium text-foreground">
              Store Status
            </Label>
            <Switch
              id="storeStatus"
              checked={storeStatus}
              onCheckedChange={setStoreStatus}
            />
          </div>
        </div>

        <PinCodesInput value={pinCodes} onChange={setPinCodes} />
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
          className="h-9 px-4 bg-admin text-primary-foreground hover:bg-admin/90 rounded-lg"
        >
          {mode === "create" ? "Create" : "Update"}
        </Button>
      </div>
    </DialogContent>
  );
}
