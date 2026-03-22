import { Download, QrCode } from "lucide-react";
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
import type { Vendor } from "@/lib/api/vendors";

interface VendorLoginQRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: Vendor | null;
}

export function VendorLoginQRDialog({
  open,
  onOpenChange,
  vendor,
}: VendorLoginQRDialogProps) {
  const loginId = vendor?.login_id || "-";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={adminDialogContentClass({ variant: "plain", className: "gap-0" })}
      >
        <DialogHeader className={cn(adminDialogHeaderClass, "gap-2 sm:pb-2")}>
          <DialogTitle className="text-lg font-semibold text-foreground">
            Vendor Login - QR Code
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {vendor?.business_name || "Vendor"}
          </DialogDescription>
          <p className="text-xs font-medium text-foreground">
            Login via vendor app only
          </p>
        </DialogHeader>

        <div className={cn(adminDialogBodyScrollClass, "flex flex-col gap-4")}>
          <div className="flex justify-center">
            <div className="flex size-[min(256px,calc(100vw-3rem))] max-h-[min(256px,calc(100vw-3rem))] items-center justify-center rounded-[10px] border-4 border-admin p-1">
              <div className="flex size-full flex-col items-center justify-center p-1">
                <div className="flex size-32 items-center justify-center rounded-xl border-2 border-dashed bg-gray-200">
                  <QrCode className="size-24 text-admin" />
                </div>
                <p className="mt-4 text-center text-sm font-medium text-foreground">
                  Scan to Login
                </p>
                <p className="mt-1 text-center text-xs text-muted-foreground">
                  Vendor portal access
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-[10px] border border-border bg-muted p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Login ID:
              </span>
              <span className="shrink-0 text-sm font-semibold text-foreground">
                {loginId}
              </span>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Share this QR code with the vendor to grant portal access
          </p>
        </div>

        <div className={adminDialogFooterClass}>
          <Button
            variant="outline"
            className={cn(adminDialogFooterButtonClass, "border-border")}
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            className={cn(
              adminDialogFooterButtonClass,
              "bg-admin text-white hover:cursor-pointer hover:bg-admin/90",
            )}
          >
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
