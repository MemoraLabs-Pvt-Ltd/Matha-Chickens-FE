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
  adminDialogDeleteMessageClass,
  adminDialogFooterButtonClass,
} from "@/lib/adminDialogContent";
import { cn } from "@/lib/utils";

interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryName: string;
  onDelete: () => void;
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  categoryName,
  onDelete,
}: DeleteCategoryDialogProps) {
  const handleDelete = () => {
    onDelete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={adminDialogContentClass()}>
        <DialogHeader className={cn(adminDialogDeleteHeaderClass, "pb-0 sm:pb-0")}>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Delete Item
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Delete category information
          </DialogDescription>
        </DialogHeader>

        <div className={adminDialogDeleteMessageClass}>
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold">"{categoryName}"</span>?
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
