import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
      <DialogContent className="bg-card rounded-xl border border-border p-6 max-w-[512px]!">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold text-foreground">
            Delete Vendor
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Delete vendor information
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm font-medium text-foreground">
          Are you sure you want to delete{" "}
          <span className="font-semibold">"{vendorName}"</span>?
        </p>

        <DialogFooter className="mt-6 gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="h-9 px-4 border border-border text-foreground rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={onDelete}
            disabled={isDeleting}
            className="h-9 px-4 bg-destructive text-primary-foreground hover:bg-destructive/90 rounded-lg"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
