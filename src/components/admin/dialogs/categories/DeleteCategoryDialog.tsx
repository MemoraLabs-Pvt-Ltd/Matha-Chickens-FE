import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
      <DialogContent className="bg-card rounded-xl border border-border p-6 max-w-[512px]! ">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Delete Item
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Delete category information
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <p className="text-sm font-medium text-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold">"{categoryName}"</span>?
          </p>
        </div>

        <DialogFooter className="mt-4 gap-2">
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
