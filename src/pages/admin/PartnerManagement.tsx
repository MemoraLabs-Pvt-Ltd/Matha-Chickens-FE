import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { TableBodySkeleton } from "@/components/common/TableBodySkeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PartnerDialog } from "@/components/admin/dialogs/partners/PartnerDialog";
import { DeletePartnerDialog } from "@/components/admin/dialogs/partners/DeletePartnerDialog";
import { useDeletePartner, usePartners } from "@/hooks/usePartners";
import { useStores } from "@/hooks/useStores";
import type { Partner } from "@/lib/api/partners";
import { formatPhoneForDisplay } from "@/lib/display/phone";
import { formatInr } from "@/lib/display/formatting";
import { getPaginationPageNumbers } from "@/lib/display/pagination";

const PARTNERS_PAGE_LIMIT = 20;

export default function PartnerManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingPartner, setDeletingPartner] = useState<Partner | null>(null);

  const {
    data: partnersData,
    isLoading,
    isError,
    error,
  } = usePartners({
    page: currentPage,
    limit: PARTNERS_PAGE_LIMIT,
    search: searchQuery.trim() || undefined,
  });

  const deletePartner = useDeletePartner();

  const { data: storesData } = useStores({ limit: 100 });
  const storeNameById = useMemo(
    () => new Map((storesData?.data ?? []).map((store) => [store.id, store.name])),
    [storesData?.data],
  );

  const partners = partnersData?.data ?? [];
  const totalPages = Math.max(partnersData?.pagination?.totalPages ?? 1, 1);
  const safeCurrentPage = partnersData?.pagination?.page ?? currentPage;

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setEditDialogOpen(true);
  };

  const handleDelete = (partner: Partner) => {
    setDeletingPartner(partner);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingPartner) return;

    deletePartner.mutate(deletingPartner.id, {
      onSettled: () => {
        setDeleteDialogOpen(false);
        setDeletingPartner(null);
      },
    });
  };

  return (
    <AdminLayout title="Partners">
      <div className="bg-[#fafafa]">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base text-[#525252]">
            Trade partners billed on credit — hotels, restaurants and other
            recurring B2B accounts
          </p>
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="flex h-9 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-admin px-4 text-sm font-medium text-white transition-colors hover:bg-admin/90 sm:w-auto"
          >
            <Plus className="size-4" />
            <span>Add Partner</span>
          </Button>
        </div>

        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] px-4 py-3 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by partner name..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 bg-[#f3f3f5] border-transparent rounded-lg h-9"
            />
          </div>
        </div>

        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[10px] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[rgba(0,0,0,0.1)]">
                  <TableHead className="text-left py-[10px] pl-4 text-sm font-medium text-foreground">
                    Partner Name
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Store
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    GSTIN
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Phone
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Running Balance
                  </TableHead>
                  <TableHead className="text-left py-[10px] pl-2 text-sm font-medium text-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-right py-[10px] pr-4 text-sm font-medium text-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableBodySkeleton
                    rows={6}
                    columns={7}
                    rowClassName="border-[rgba(0,0,0,0.1)]"
                    cellClassNames={[
                      "py-3 pl-4",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pl-2",
                      "py-3 pr-4",
                    ]}
                    renderCell={(columnIndex) => {
                      if (columnIndex === 5) {
                        return <Skeleton className="h-6 w-20 rounded-lg" />;
                      }
                      if (columnIndex === 6) {
                        return (
                          <div className="flex items-center justify-end gap-2">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                          </div>
                        );
                      }
                      return <Skeleton className="h-4 w-3/4 rounded-lg" />;
                    }}
                  />
                )}

                {isError && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-sm text-destructive">
                      {error instanceof Error ? error.message : "Failed to load partners"}
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !isError && partners.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                      No partners found
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  !isError &&
                  partners.map((partner) => (
                    <TableRow
                      key={partner.id}
                      className="border-b border-[rgba(0,0,0,0.1)] last:border-0"
                    >
                      <TableCell className="py-3 pl-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">
                            {partner.name}
                          </span>
                          {partner.address && (
                            <span className="text-xs text-muted-foreground">
                              {partner.address}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 pl-2 text-sm text-foreground">
                        {storeNameById.get(partner.store_id) ?? `Store #${partner.store_id}`}
                      </TableCell>
                      <TableCell className="py-3 pl-2 text-sm text-foreground">
                        {partner.gstin || "-"}
                      </TableCell>
                      <TableCell className="py-3 pl-2 text-sm text-foreground">
                        {partner.phone ? formatPhoneForDisplay(partner.phone) : "-"}
                      </TableCell>
                      <TableCell className="py-3 pl-2 text-sm font-medium">
                        <span
                          className={
                            partner.running_balance > 0
                              ? "text-destructive"
                              : "text-foreground"
                          }
                        >
                          {formatInr(partner.running_balance)}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 pl-2">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-lg ${
                            partner.status === "active"
                              ? "bg-[#dcfce7] text-[#166534]"
                              : "bg-[#f3f4f6] text-[#4b5563]"
                          }`}
                        >
                          {partner.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 pr-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(partner)}
                            className="size-8 rounded-lg hover:bg-muted transition-colors"
                          >
                            <Pencil className="size-4 text-[#525252]" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(partner)}
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

          {totalPages > 1 && (
            <div className="py-4 px-4 border-t border-[rgba(0,0,0,0.1)]">
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
                  {getPaginationPageNumbers(safeCurrentPage, totalPages).map((page, index) =>
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
      </div>

      <PartnerDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} mode="add" />
      {editingPartner && (
        <PartnerDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          mode="edit"
          partner={editingPartner}
        />
      )}
      {deletingPartner && (
        <DeletePartnerDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          partnerName={deletingPartner.name}
          isDeleting={deletePartner.isPending}
          onDelete={handleConfirmDelete}
        />
      )}
    </AdminLayout>
  );
}
