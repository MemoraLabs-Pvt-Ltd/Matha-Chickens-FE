import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StoreDialog } from "@/components/admin/dialogs/stores/StoreDialog";

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  discount: string;
  tax: string;
  status: "active" | "inactive";
}

const stores: Store[] = [
  {
    id: "1",
    name: "Matha Chickens - MG Road",
    address: "MG Road, Bangalore, Karnataka - 560001",
    phone: "+91 80 2345 6789",
    discount: "5%",
    tax: "GST 5% (5%)",
    status: "active",
  },
  {
    id: "2",
    name: "Matha Chickens - Koramangala",
    address: "5th Block, Koramangala, Bangalore - 560095",
    phone: "+91 80 2345 6790",
    discount: "No Discount",
    tax: "No Tax (0%)",
    status: "active",
  },
  {
    id: "3",
    name: "Matha Chickens - Whitefield",
    address: "ITPL Main Road, Whitefield, Bangalore - 560066",
    phone: "+91 80 2345 6791",
    discount: "10%",
    tax: "GST 5% (5%)",
    status: "active",
  },
];

export default function StoreManagement() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);

  const handleEdit = (id: string) => {
    const store = stores.find((s) => s.id === id);
    if (store) {
      setEditingStore(store);
      setEditDialogOpen(true);
    }
  };

  return (
    <AdminLayout title="Store Management">
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <p className="text-base text-muted-foreground">
            Manage store locations and configuration
          </p>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center gap-2 h-9 px-4 bg-admin text-primary-foreground text-sm font-medium rounded-lg hover:bg-admin/90 transition-colors"
          >
            <Plus className="size-4" />
            <span>Create Store</span>
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="text-left py-3 pl-6 text-sm font-medium text-foreground">
                Store Name
              </TableHead>
              <TableHead className="text-left py-3 pl-6 text-sm font-medium text-foreground">
                Phone
              </TableHead>
              <TableHead className="text-left py-3 pl-6 text-sm font-medium text-foreground">
                Discount
              </TableHead>
              <TableHead className="text-left py-3 pl-6 text-sm font-medium text-foreground">
                Tax
              </TableHead>
              <TableHead className="text-left py-3 pl-6 text-sm font-medium text-foreground">
                Status
              </TableHead>
              <TableHead className="text-right py-3 pr-6 text-sm font-medium text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store) => (
              <TableRow
                key={store.id}
                className="border-b border-border"
              >
                <TableCell className="py-3 pl-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {store.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {store.address}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3 pl-6 text-sm text-foreground">
                  {store.phone}
                </TableCell>
                <TableCell className="py-3 pl-6 text-sm text-foreground">
                  {store.discount}
                </TableCell>
                <TableCell className="py-3 pl-6 text-sm text-foreground">
                  {store.tax}
                </TableCell>
                <TableCell className="py-3 pl-6">
                  <Badge
                    variant="default"
                    className="bg-[#dcfce7] text-[#016630] border border-[#dcfce7]"
                  >
                    Active
                  </Badge>
                </TableCell>
                <TableCell className="py-3 pr-6">
                  <div className="flex items-center justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(store.id)}
                      className="size-8 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Pencil className="size-4 text-muted-foreground" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <StoreDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        mode="create"
      />

      {editingStore && (
        <StoreDialog
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) setEditingStore(null);
          }}
          mode="edit"
          store={editingStore}
        />
      )}
    </AdminLayout>
  );
}
