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

interface DeleteSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplierName: string;
  onDelete: () => void;
}

export function DeleteSupplierDialog({
  open,
  onOpenChange,
  supplierName,
  onDelete,
}: DeleteSupplierDialogProps) {
  const handleDelete = () => {
    onDelete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={adminDialogContentClass()}>
        <DialogHeader className={cn(adminDialogDeleteHeaderClass, "pb-0 sm:pb-0")}>
          <DialogTitle className="text-lg font-semibold text-foreground">
            Delete Supplier
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Delete supplier information
          </DialogDescription>
        </DialogHeader>

        <div className={adminDialogDeleteMessageClass}>
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold">"{supplierName}"</span>?
          </p>
        </div>

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
            onClick={handleDelete}
            className={cn(
              adminDialogFooterButtonClass,
              "bg-destructive px-4 text-primary-foreground hover:bg-destructive/90",
            )}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
