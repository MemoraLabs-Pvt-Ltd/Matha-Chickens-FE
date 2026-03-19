import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[512px]! p-0 gap-0 shadow-none">
        <DialogHeader className="px-6 pt-6 pb-2 gap-2">
          <DialogTitle className="text-lg font-semibold text-foreground">
            Vendor Login - QR Code
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {vendor?.businessName}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 flex flex-col gap-4">
          {/* QR Code Container */}
          <div className="flex justify-center">
            <div className="border-4 border-[#9810FA] rounded-[10px] size-[256px] flex items-center justify-center p-1">
              <div className="size-full flex flex-col items-center justify-center p-1">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl size-32 flex items-center justify-center">
                  <QrCode className="size-24 text-[#9810FA]" />
                </div>
                <p className="mt-4 text-sm font-medium text-foreground text-center">
                  Scan to Login
                </p>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Vendor Portal Access
                </p>
              </div>
            </div>
          </div>

          {/* Login Info Container */}
          <div className="bg-muted border border-border rounded-[10px] p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Login ID:
              </span>
              <span className="text-sm font-semibold text-foreground">
                johndoe
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Password:
              </span>
              <span className="text-sm font-semibold text-foreground font-mono">
                ••••••••
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Portal URL:
              </span>
              <span className="text-sm font-normal text-[#9810FA]">
                vendor.mathachickens.com
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Share this QR code with the vendor to grant portal access
          </p>
          <DialogFooter className="px-6 py-4 border-t bg-muted/50 gap-2">
            <Button
              variant="outline"
              className="border-border"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button className="hover:cursor-pointer bg-[#9810FA] hover:bg-[#9810FA]/90 text-white">
              <Download className="w-4 h-4 mr-2" />
              Download QR Code
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
