import { Button } from "@/components/ui/button";
import {
  adminDialogContentClass,
  adminDialogDeleteFooterClass,
  adminDialogDeleteHeaderClass,
  adminDialogDeleteMessageClass,
  adminDialogFooterButtonClass,
} from "@/lib/adminDialogContent";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteVendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendorName: string;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function DeleteVendorDialog({
  open,
  onOpenChange,
  vendorName,
  onDelete,
  isDeleting = false,
}: DeleteVendorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={adminDialogContentClass()}>
        <DialogHeader className={cn(adminDialogDeleteHeaderClass, "pb-0 sm:pb-0")}>
          <DialogTitle className="text-lg font-semibold text-foreground">
            Delete Vendor
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Delete vendor information
          </DialogDescription>
        </DialogHeader>

        <div className={adminDialogDeleteMessageClass}>
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold">"{vendorName}"</span>?
          </p>
        </div>

        <div className={adminDialogDeleteFooterClass}>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className={cn(
              adminDialogFooterButtonClass,
              "border border-border px-4 text-foreground",
            )}
          >
            Cancel
          </Button>
          <Button
            onClick={onDelete}
            disabled={isDeleting}
            className={cn(
              adminDialogFooterButtonClass,
              "bg-destructive px-4 text-primary-foreground hover:bg-destructive/90",
            )}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
