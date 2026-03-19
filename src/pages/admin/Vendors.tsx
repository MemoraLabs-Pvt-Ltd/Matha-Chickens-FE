import { Clock, Globe, Plus, QrCode, Pencil, FileText, TrendingUp } from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { VendorDialog } from "@/components/admin/dialogs/vendors/VendorDialog";
import { VendorLoginQRDialog } from "@/components/admin/dialogs/vendors/VendorLoginQRDialog";
import { useState } from "react";

interface Vendor {
  id: string;
  businessName: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  totalOrders: number;
  billingMode: "Online" | "Offline";
  status: "Active" | "Inactive";
}

const vendors: Vendor[] = [
  {
    id: "1",
    businessName: "ABC Poultry Supplies",
    address: "123, Main Street, Bangalore",
    contactPerson: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43213",
    totalOrders: 50,
    billingMode: "Online",
    status: "Active",
  },
  {
    id: "2",
    businessName: "XYZ Egg Suppliers",
    address: "456, Market Road, Mysore",
    contactPerson: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+91 98765 43214",
    totalOrders: 30,
    billingMode: "Offline",
    status: "Active",
  },
];

export default function Vendors() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const handleEditClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setEditDialogOpen(true);
  };

  const handleQRClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setQrDialogOpen(true);
  };

  return (
    <>
      <VendorDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        mode="add"
      />
      <VendorDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        mode="edit"
        vendor={selectedVendor}
      />
      <VendorLoginQRDialog
        open={qrDialogOpen}
        onOpenChange={setQrDialogOpen}
        vendor={selectedVendor}
      />
      <AdminLayout title="Vendor Management">
      <div>
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-card border border-border rounded-xl p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Vendor Orders Today
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">12</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-chart-2" />
                <span className="text-xs text-chart-2">
                  +8% from yesterday
              </span>
              </div>
            </div>
            <div className="bg-chart-1/10 rounded-xl w-12 h-12 flex items-center justify-center">
              <Clock className="w-6 h-6 text-chart-1" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Vendors
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">2</p>
              <p className="text-xs text-muted-foreground mt-2">2 active</p>
            </div>
            <div className="bg-chart-2/10 rounded-xl w-12 h-12 flex items-center justify-center">
              <Globe className="w-6 h-6 text-chart-2" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Online Billing
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">1</p>
              <p className="text-xs text-muted-foreground mt-2">
                Mobile/Portal access
              </p>
            </div>
            <div className="bg-admin-accent rounded-xl w-12 h-12 flex items-center justify-center">
              <QrCode className="w-6 h-6 text-admin" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Offline Billing
              </p>
              <p className="text-3xl font-bold text-foreground mt-2">1</p>
              <p className="text-xs text-muted-foreground mt-2">
                Call/In-person orders
              </p>
            </div>
            <div className="bg-store-accent rounded-xl w-12 h-12 flex items-center justify-center">
              <FileText className="w-6 h-6 text-store" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-base text-muted-foreground">
            Manage vendors for bulk large orders
          </p>
          <Button
            className="bg-admin hover:bg-admin/90 text-primary-foreground rounded-lg h-9 px-4"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="text-left py-2.5 pl-2 text-sm font-medium text-foreground">
                  Business Name
                </TableHead>
                <TableHead className="text-left py-2.5 pl-2 text-sm font-medium text-foreground">
                  Contact Person
                </TableHead>
                <TableHead className="text-left py-2.5 pl-2 text-sm font-medium text-foreground">
                  Phone
                </TableHead>
                <TableHead className="text-left py-2.5 pl-2 text-sm font-medium text-foreground">
                  Total Orders
                </TableHead>
                <TableHead className="text-left py-2.5 pl-2 text-sm font-medium text-foreground">
                  Billing Mode
                </TableHead>
                <TableHead className="text-left py-2.5 pl-2 text-sm font-medium text-foreground">
                  Status
                </TableHead>
                <TableHead className="text-right py-2.5 pr-2 text-sm font-medium text-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow
                  key={vendor.id}
                  className="border-b border-border last:border-0"
                >
                  <TableCell className="py-3 pl-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {vendor.businessName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {vendor.address}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 pl-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {vendor.contactPerson}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {vendor.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 pl-2 text-sm text-foreground">
                    {vendor.phone}
                  </TableCell>
                  <TableCell className="py-3 pl-2 text-sm font-semibold text-foreground">
                    {vendor.totalOrders}
                  </TableCell>
                  <TableCell className="py-3 pl-2">
                    <span
                      className={[
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        vendor.billingMode === "Online"
                          ? "bg-admin-accent text-admin"
                          : "bg-store-accent text-store",
                      ].join(" ")}
                    >
                      {vendor.billingMode === "Online" ? (
                        <QrCode className="w-3 h-3" />
                      ) : (
                        <FileText className="w-3 h-3" />
                      )}
                      {vendor.billingMode}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 pl-2">
                    <span
                      className="inline-block px-2 py-1 text-xs font-medium rounded-lg bg-muted text-foreground"
                    >
                      {vendor.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 pr-2">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="size-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                        onClick={() => handleQRClick(vendor)}
                      >
                        <QrCode className="size-4 text-muted-foreground" />
                      </button>
                      <button
                        className="size-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                        onClick={() => handleEditClick(vendor)}
                      >
                        <Pencil className="size-4 text-muted-foreground" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="bg-muted/50 border border-border rounded-xl px-4 py-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Note:</span>{" "}
            Vendors are partners who place regular bulk orders. Online vendors
            can access the vendor portal via QR code or credentials, while
            offline vendors place orders via call or in-person.
          </p>
        </div>
      </div>
    </AdminLayout>
    </>
  );
}
