import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TaxDialog } from "@/components/admin/dialogs/taxes/TaxDialog";
import { DeleteTaxDialog } from "@/components/admin/dialogs/taxes/DeleteTaxDialog";

interface Tax {
  id: string;
  name: string;
  percentage: number;
}

const taxes: Tax[] = [
  { id: "1", name: "GST 5%", percentage: 5 },
  { id: "2", name: "GST 12%", percentage: 12 },
  { id: "3", name: "GST 18%", percentage: 18 },
];

export default function TaxManagement() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<Tax | null>(null);
  const [deletingTax, setDeletingTax] = useState<Tax | null>(null);

  const handleEdit = (id: string) => {
    const tax = taxes.find((t) => t.id === id);
    if (tax) {
      setEditingTax(tax);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    const tax = taxes.find((t) => t.id === id);
    if (tax) {
      setDeletingTax(tax);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    console.log("Deleting tax:", deletingTax?.id);
    setDeleteDialogOpen(false);
    setDeletingTax(null);
  };

  return (
    <AdminLayout title="Tax Management">
      <div className="bg-[#fafafa]">
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-[18px] border-b border-[rgba(0,0,0,0.1)]">
            <p className="text-base text-[#525252]">
              Manage tax types and rates
            </p>
            <Button
              onClick={() => setAddDialogOpen(true)}
              className="flex items-center gap-2 h-9 px-4 bg-admin text-white text-sm font-medium rounded-lg hover:bg-admin/90 transition-colors"
            >
              <Plus className="size-4" />
              <span>Add Tax Type</span>
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-b border-[rgba(0,0,0,0.1)]">
                <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                  Tax Name
                </TableHead>
                <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-[#0a0a0a]">
                  Percentage
                </TableHead>
                <TableHead className="text-right py-[10px] pr-2 text-sm font-medium text-[#0a0a0a]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxes.map((tax) => (
                <TableRow
                  key={tax.id}
                  className="border-b border-[rgba(0,0,0,0.1)] last:border-0"
                >
                  <TableCell className="py-3 pl-2 text-sm font-medium text-[#0a0a0a]">
                    {tax.name}
                  </TableCell>
                  <TableCell className="py-3 pl-2 text-sm text-[#0a0a0a]">
                    {tax.percentage}%
                  </TableCell>
                  <TableCell className="py-3 pr-2">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(tax.id)}
                        className="size-8 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Pencil className="size-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(tax.id)}
                        className="size-8 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="text-sm text-[#737373] italic mt-5 ml-1">
          Note: One tax type per store, applied after discount. 0% is allowed.
        </p>
      </div>

      <TaxDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} mode="add" />
      {editingTax && (
        <TaxDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          mode="edit"
          tax={editingTax}
        />
      )}
      {deletingTax && (
        <DeleteTaxDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          taxName={deletingTax.name}
          onDelete={handleConfirmDelete}
        />
      )}
    </AdminLayout>
  );
}
