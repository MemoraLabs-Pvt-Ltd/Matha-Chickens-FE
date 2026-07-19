import { cn } from "@/lib/utils";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImagePreviewButton } from "@/components/common/ImagePreviewButton";
import { Pencil, Trash2 } from "lucide-react";

interface CategoryRowProps {
  id: number;
  name: string;
  imgUrl?: string | null;
  status: "active" | "inactive";
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const statusBadgeStyles = {
  active: "bg-[#dcfce7] text-[#016630] border-transparent",
  inactive: "bg-muted text-muted-foreground border-transparent",
};

export function CategoryRow({
  id,
  name,
  imgUrl,
  status,
  onEdit,
  onDelete,
}: CategoryRowProps) {
  return (
    <TableRow className="border-[rgba(0,0,0,0.1)]">
      <TableCell className="py-3 pl-6">
        <p className="text-sm font-medium text-primary">{name}</p>
      </TableCell>
      <TableCell className="py-3">
        <Badge
          className={cn(
            "rounded-lg px-2 py-1 text-xs font-medium",
            statusBadgeStyles[status],
          )}
        >
          {status === "active" ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell className="py-3 pr-6">
        <div className="flex items-center justify-end gap-2">
          <ImagePreviewButton
            src={imgUrl}
            variant="icon"
            dialogTitle={`${name} — category image`}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(id)}
            className="h-8 w-8 rounded-[8px] flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Edit category"
          >
            <Pencil className="size-4 text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Delete category"
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
