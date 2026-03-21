import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteDiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discountTitle: string;
  onDelete: () => void;
}

export function DeleteDiscountDialog({
  open,
  onOpenChange,
  discountTitle,
  onDelete,
}: DeleteDiscountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card rounded-xl border border-border p-0 max-w-[512px]!">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle>Delete Discount Campaign</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{discountTitle}</strong>? This action cannot
            be undone.
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
            className="h-9 px-4 bg-admin text-white hover:bg-admin/90 rounded-lg"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
