import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  adminDialogContentClass,
  adminDialogDeleteFooterClass,
  adminDialogDeleteHeaderClass,
  adminDialogFooterButtonClass,
} from "@/lib/adminDialogContent";
import { cn } from "@/lib/utils";

interface DeleteStockReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiptCode: string;
  onDelete: () => void;
  isPending?: boolean;
}

export function DeleteStockReceiptDialog({
  open,
  onOpenChange,
  receiptCode,
  onDelete,
  isPending = false,
}: DeleteStockReceiptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={adminDialogContentClass()}>
        <DialogHeader className={adminDialogDeleteHeaderClass}>
          <DialogTitle>Delete Stock Receipt</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{receiptCode}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className={adminDialogDeleteFooterClass}>
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
            onClick={onDelete}
            disabled={isPending}
            className={cn(
              adminDialogFooterButtonClass,
              "bg-destructive px-4 text-primary-foreground hover:bg-destructive/90",
            )}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
