import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
      <DialogContent className="bg-card rounded-xl border border-border p-6 max-w-[512px]!">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold text-foreground">
            Delete Supplier
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Delete supplier information
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm font-medium text-foreground">
          Are you sure you want to delete{" "}
          <span className="font-semibold">"{supplierName}"</span>?
        </p>

        <DialogFooter className="mt-6 gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 px-4 border border-border text-foreground rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="h-9 px-4 bg-destructive text-primary-foreground hover:bg-destructive/90 rounded-lg"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
