import { Button } from "@/components/ui/button";
import {
  adminDialogContentClass,
  adminDialogDeleteFooterClass,
  adminDialogDeleteHeaderClass,
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

interface DeleteStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeName: string;
  onDelete: () => void;
}

export function DeleteStoreDialog({
  open,
  onOpenChange,
  storeName,
  onDelete,
}: DeleteStoreDialogProps) {
  const handleDelete = () => {
    onDelete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={adminDialogContentClass()}>
        <DialogHeader className={adminDialogDeleteHeaderClass}>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Delete Store
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to delete "{storeName}"? This action cannot
            be undone.
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
