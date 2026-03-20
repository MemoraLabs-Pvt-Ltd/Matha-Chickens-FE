import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
      <DialogContent className="bg-card rounded-xl border border-border p-0 max-w-[512px]!">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle>Delete Stock Receipt</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{receiptCode}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="shrink-0 border-t border-border bg-muted/50 px-6 py-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 px-4 border border-border text-foreground rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={onDelete}
            disabled={isPending}
            className="h-9 px-4 bg-destructive text-primary-foreground hover:bg-destructive/90 rounded-lg"
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
