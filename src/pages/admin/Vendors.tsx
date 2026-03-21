import { useMemo, useState } from "react";
import {
  Clock,
  FileText,
  Globe,
  Pencil,
  Plus,
  QrCode,
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { TableBodySkeleton } from "@/components/common/TableBodySkeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteVendorDialog } from "@/components/admin/dialogs/vendors/DeleteVendorDialog";
import { VendorDialog } from "@/components/admin/dialogs/vendors/VendorDialog";
import { VendorLoginQRDialog } from "@/components/admin/dialogs/vendors/VendorLoginQRDialog";
import { useDeleteVendor, useVendors } from "@/hooks/useVendors";
import type { Vendor } from "@/lib/api/vendors";
import { formatPhoneForDisplay } from "@/lib/phone";

const VENDORS_PAGE_LIMIT = 20;

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i += 1) pages.push(i);
    return pages;
  }

  pages.push(1);
  if (currentPage > 3) pages.push("ellipsis");

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i += 1) pages.push(i);
  if (currentPage < totalPages - 2) pages.push("ellipsis");
  pages.push(totalPages);

  return pages;
}

export default function Vendors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const {
    data: vendorsData,
    isLoading,
    isError,
    error,
  } = useVendors({
    page: currentPage,
    limit: VENDORS_PAGE_LIMIT,
    search: searchQuery.trim() || undefined,
  });

  const deleteVendor = useDeleteVendor();

  const vendors = vendorsData?.data ?? [];
  const totalPages = Math.max(vendorsData?.pagination?.totalPages ?? 1, 1);
  const safeCurrentPage = vendorsData?.pagination?.page ?? currentPage;

  const stats = useMemo(() => {
    const activeOnPage = vendors.filter((vendor) => vendor.status === "active").length;
    const onlineOnPage = vendors.filter((vendor) => vendor.billing_mode === "online").length;
    const offlineOnPage = vendors.filter((vendor) => vendor.billing_mode === "offline").length;

    return {
      total: vendorsData?.pagination?.totalData ?? vendors.length,
      activeOnPage,
      onlineOnPage,
      offlineOnPage,
    };
  }, [vendors, vendorsData?.pagination?.totalData]);

  const handleEditClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setEditDialogOpen(true);
  };

  const handleQRClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setQrDialogOpen(true);
  };

  const handleDeleteClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedVendor) return;

    deleteVendor.mutate(selectedVendor.id, {
      onSettled: () => {
        setDeleteDialogOpen(false);
        setSelectedVendor(null);
      },
    });
  };

  return (
    <>
      <VendorDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        mode="add"
      />

      {selectedVendor && (
        <VendorDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          mode="edit"
          vendor={selectedVendor}
        />
      )}

      <VendorLoginQRDialog
        open={qrDialogOpen}
        onOpenChange={setQrDialogOpen}
        vendor={selectedVendor}
      />

      {selectedVendor && (
        <DeleteVendorDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          vendorName={selectedVendor.business_name}
          isDeleting={deleteVendor.isPending}
          onDelete={handleConfirmDelete}
        />
      )}

      <AdminLayout title="Vendor Management">
        <div>
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-card border border-border rounded-xl p-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Vendors (Page)
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">{stats.activeOnPage}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3 text-chart-2" />
                  <span className="text-xs text-chart-2">Current page snapshot</span>
                </div>
              </div>
              <div className="bg-chart-1/10 rounded-xl w-12 h-12 flex items-center justify-center">
                <Clock className="w-6 h-6 text-chart-1" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Vendors</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stats.total}</p>
                <p className="text-xs text-muted-foreground mt-2">Across all pages</p>
              </div>
              <div className="bg-chart-2/10 rounded-xl w-12 h-12 flex items-center justify-center">
                <Globe className="w-6 h-6 text-chart-2" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Online Billing (Page)</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stats.onlineOnPage}</p>
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
                  Offline Billing (Page)
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">{stats.offlineOnPage}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Call/In-person orders
                </p>
              </div>
              <div className="bg-store-accent rounded-xl w-12 h-12 flex items-center justify-center">
                <FileText className="w-6 h-6 text-store" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
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

          <div className="bg-card border border-border rounded-xl p-4 mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by business or contact person..."
                className="pl-9 bg-muted border-transparent rounded-lg h-9"
              />
            </div>
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
                {isLoading && (
                  <TableBodySkeleton
                    rows={8}
                    columns={6}
                    rowClassName="border-b border-border"
                    cellClassNames={[
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pr-2",
                    ]}
                    renderCell={(columnIndex) => {
                      if (columnIndex === 5) {
                        return (
                          <div className="flex items-center justify-end gap-2">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                          </div>
                        );
                      }

                      if (columnIndex === 4 || columnIndex === 3) {
                        return <Skeleton className="h-6 w-20 rounded-lg" />;
                      }

                      return <Skeleton className="h-4 w-3/4 rounded-lg" />;
                    }}
                  />
                )}

                {isError && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-sm text-destructive">
                      {error instanceof Error ? error.message : "Failed to load vendors"}
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !isError && vendors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                      No vendors found
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  !isError &&
                  vendors.map((vendor) => (
                    <TableRow
                      key={vendor.id}
                      className="border-b border-border last:border-0"
                    >
                      <TableCell className="py-3 pl-2">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">
                            {vendor.business_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {vendor.address || "-"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-3 pl-2">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">
                            {vendor.contact_person}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {vendor.email || "-"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-3 pl-2 text-sm text-foreground">
                        {formatPhoneForDisplay(vendor.phone)}
                      </TableCell>

                      <TableCell className="py-3 pl-2">
                        <span
                          className={[
                            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                            vendor.billing_mode === "online"
                              ? "bg-admin-accent text-admin"
                              : "bg-store-accent text-store",
                          ].join(" ")}
                        >
                          {vendor.billing_mode === "online" ? (
                            <QrCode className="w-3 h-3" />
                          ) : (
                            <FileText className="w-3 h-3" />
                          )}
                          {vendor.billing_mode === "online" ? "Online" : "Offline"}
                        </span>
                      </TableCell>

                      <TableCell className="py-3 pl-2">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-lg ${
                            vendor.status === "active"
                              ? "bg-[#dcfce7] text-[#166534]"
                              : "bg-[#f3f4f6] text-[#4b5563]"
                          }`}
                        >
                          {vendor.status === "active" ? "Active" : "Inactive"}
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
                          <button
                            className="size-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                            onClick={() => handleDeleteClick(vendor)}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="py-4 px-4 border-t border-border">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        className={
                          safeCurrentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {getPageNumbers(safeCurrentPage, totalPages).map((page, index) =>
                      page === "ellipsis" ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={safeCurrentPage === page}
                            onClick={() => setCurrentPage(page)}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((page) => Math.min(totalPages, page + 1))
                        }
                        className={
                          safeCurrentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
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
