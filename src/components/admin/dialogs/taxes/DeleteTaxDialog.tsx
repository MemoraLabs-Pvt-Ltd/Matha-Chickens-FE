import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  adminDialogContentClass,
  adminDialogDeleteFooterClass,
  adminDialogDeleteHeaderClass,
  adminDialogFooterButtonClass,
} from "@/lib/adminDialogContent";
import { cn } from "@/lib/utils";

interface DeleteTaxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taxName: string;
  onDelete: () => void;
}

export function DeleteTaxDialog({
  open,
  onOpenChange,
  taxName,
  onDelete,
}: DeleteTaxDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={adminDialogContentClass()}>
        <DialogHeader className={adminDialogDeleteHeaderClass}>
          <DialogTitle>Delete Tax Type</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{taxName}</strong>? This
            action cannot be undone.
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
            className={cn(
              adminDialogFooterButtonClass,
              "bg-admin px-4 text-white hover:bg-admin/90",
            )}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
