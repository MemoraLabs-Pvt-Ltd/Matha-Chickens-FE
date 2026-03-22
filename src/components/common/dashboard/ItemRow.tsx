import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImagePreviewButton } from "@/components/common/ImagePreviewButton";

interface Item {
  id: number;
  name: string;
  category: string;
  price: string;
  status: "active" | "inactive";
  imageUrl?: string | null;
}

interface ItemRowProps extends Item {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ItemRow({
  id,
  name,
  category,
  price,
  status,
  imageUrl,
  onEdit,
  onDelete,
}: ItemRowProps) {
  return (
    <tr className="border-b border-[rgba(0,0,0,0.1)] hover:bg-muted/50 transition-colors">
      <td className="py-3 pl-6 pr-2">
        <span className="text-sm font-medium text-[#0a0a0a]">{name}</span>
      </td>
      <td className="py-3 px-2">
        <span className="text-sm text-[#0a0a0a]">{category}</span>
      </td>
      <td className="py-3 px-2">
        <span className="text-sm text-[#0a0a0a]">{price}</span>
      </td>
      <td className="py-3 px-2">
        <Badge
          variant="default"
          className={`${
            status === "active"
              ? "bg-[#dcfce7] text-[#016630] border border-[#dcfce7]"
              : "bg-[#ffe2e2] text-[#c10007] border border-[#ffe2e2]"
          }`}
        >
          {status === "active" ? "Active" : "Inactive"}
        </Badge>
      </td>
      <td className="py-3 px-2">
        <div className="flex items-center justify-end gap-2 pr-4">
          <ImagePreviewButton
            src={imageUrl}
            variant="icon"
            dialogTitle={`${name} — item image`}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(id)}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            <Pencil className="size-4 text-[#525252]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
