import { useState } from "react";
import { StoreLayout } from "@/components/common/layout";
import { Switch } from "@/components/ui/switch";
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
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface StoreItem {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  isAvailable: boolean;
}

const storeItems: StoreItem[] = [
  { id: 1, name: "Fresh Chicken Breast", category: "Broiler Chicken", price: 280, unit: "kg", isAvailable: true },
  { id: 2, name: "Whole Roast Chicken", category: "Broiler Chicken", price: 450, unit: "kg", isAvailable: true },
  { id: 3, name: "Crispy Fried Chicken", category: "Broiler Chicken", price: 320, unit: "kg", isAvailable: true },
  { id: 4, name: "Country Chicken - Whole", category: "Country Chicken", price: 550, unit: "kg", isAvailable: false },
  { id: 5, name: "Country Chicken - Cut Pieces", category: "Country Chicken", price: 580, unit: "kg", isAvailable: true },
  { id: 6, name: "Farm Fresh Eggs (12 pcs)", category: "Eggs", price: 84, unit: "pcs", isAvailable: true },
  { id: 7, name: "Farm Fresh Eggs (30 pcs)", category: "Eggs", price: 195, unit: "pcs", isAvailable: true },
  { id: 8, name: "Chicken Wings", category: "Broiler Chicken", price: 240, unit: "kg", isAvailable: true },
  { id: 9, name: "Chicken Drumsticks", category: "Broiler Chicken", price: 260, unit: "kg", isAvailable: true },
  { id: 10, name: "Chicken Liver", category: "Broiler Chicken", price: 150, unit: "kg", isAvailable: true },
  { id: 11, name: "Chicken Gizzard", category: "Broiler Chicken", price: 180, unit: "kg", isAvailable: true },
  { id: 12, name: "Chicken Sausages (500g)", category: "Processed", price: 320, unit: "pack", isAvailable: true },
  { id: 13, name: "Chicken Nuggets (500g)", category: "Processed", price: 350, unit: "pack", isAvailable: true },
  { id: 14, name: "Chicken Patties (4 pcs)", category: "Processed", price: 280, unit: "pack", isAvailable: false },
  { id: 15, name: "Tandoori Chicken", category: "Broiler Chicken", price: 380, unit: "kg", isAvailable: true },
  { id: 16, name: "Chicken Tikka", category: "Broiler Chicken", price: 400, unit: "kg", isAvailable: true },
  { id: 17, name: "Chicken Keema", category: "Broiler Chicken", price: 350, unit: "kg", isAvailable: true },
  { id: 18, name: "Chicken Lolipop", category: "Broiler Chicken", price: 300, unit: "kg", isAvailable: true },
  { id: 19, name: "Duck Meat", category: "Country Chicken", price: 480, unit: "kg", isAvailable: false },
  { id: 20, name: "Turkey Breast", category: "Country Chicken", price: 520, unit: "kg", isAvailable: true },
  { id: 21, name: "Quail Eggs (12 pcs)", category: "Eggs", price: 120, unit: "pcs", isAvailable: true },
  { id: 22, name: "Duck Eggs (6 pcs)", category: "Eggs", price: 90, unit: "pcs", isAvailable: true },
  { id: 23, name: "Chicken Salami (250g)", category: "Processed", price: 250, unit: "pack", isAvailable: true },
  { id: 24, name: "Chicken Bacon (250g)", category: "Processed", price: 300, unit: "pack", isAvailable: true },
  { id: 25, name: "Marinated Chicken Breast", category: "Broiler Chicken", price: 340, unit: "kg", isAvailable: true },
  { id: 26, name: "Chicken Spring Chicken", category: "Broiler Chicken", price: 380, unit: "kg", isAvailable: true },
  { id: 27, name: "Country Chicken Eggs (12 pcs)", category: "Eggs", price: 150, unit: "pcs", isAvailable: true },
  { id: 28, name: "Organic Chicken", category: "Broiler Chicken", price: 450, unit: "kg", isAvailable: true },
  { id: 29, name: "Chicken Feet", category: "Broiler Chicken", price: 120, unit: "kg", isAvailable: true },
  { id: 30, name: "Chicken Neck", category: "Broiler Chicken", price: 100, unit: "kg", isAvailable: true },
  { id: 31, name: "Chicken Wings - Spicy", category: "Broiler Chicken", price: 280, unit: "kg", isAvailable: true },
  { id: 32, name: "Chicken Malai Tikka", category: "Broiler Chicken", price: 420, unit: "kg", isAvailable: false },
  { id: 33, name: "Chicken Seekh Kebab", category: "Broiler Chicken", price: 360, unit: "kg", isAvailable: true },
  { id: 34, name: "Chicken Biryani Cut", category: "Broiler Chicken", price: 290, unit: "kg", isAvailable: true },
  { id: 35, name: "Chicken Boneless", category: "Broiler Chicken", price: 360, unit: "kg", isAvailable: true },
  { id: 36, name: "Chicken Mince (Keema)", category: "Broiler Chicken", price: 340, unit: "kg", isAvailable: true },
  { id: 37, name: "Pickled Chicken", category: "Processed", price: 280, unit: "pack", isAvailable: true },
  { id: 38, name: "Chicken Stock (1L)", category: "Processed", price: 150, unit: "bottle", isAvailable: true },
  { id: 39, name: "Chicken Bouillon (10 cubes)", category: "Processed", price: 80, unit: "pack", isAvailable: true },
  { id: 40, name: "Frozen Chicken (1kg)", category: "Broiler Chicken", price: 250, unit: "pack", isAvailable: false },
];

export default function ItemAvailabilityPage() {
  const [items, setItems] = useState<StoreItem[]>(storeItems);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  const toggleAvailability = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item,
      ),
    );
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <StoreLayout title="Item Availability">
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-medium text-foreground">
            Manage item availability for your store
          </h2>
          <p className="text-sm text-muted-foreground italic">
            Items marked as "Out of Stock" will be hidden from customers in the
            mobile app
          </p>
        </div>

        <div className="bg-card border border-border rounded-[10px] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Item Name
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Category
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Price
                </TableHead>
                <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                  Availability Status
                </TableHead>
                <TableHead className="text-right py-3 pr-4 text-sm font-medium text-foreground">
                  Toggle
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((item) => (
                <TableRow key={item.id} className="border-b border-border">
                  <TableCell className="py-3 pl-4">
                    <span className="text-sm font-medium text-foreground">
                      {item.name}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 pl-4">
                    <span className="text-sm text-foreground">
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 pl-4">
                    <span className="text-sm text-foreground">
                      ₹{item.price.toFixed(2)}/{item.unit}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 pl-4">
                    {item.isAvailable ? (
                      <span className="inline-flex items-center px-2 py-1 bg-[#dcfce7] rounded text-xs font-medium text-[#016630]">
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 bg-[#ffe2e2] rounded text-xs font-medium text-[#9f0712]">
                        Out of Stock
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3 pr-4">
                    <div className="flex items-center justify-end gap-3">
                      <span className="text-sm text-muted-foreground">
                        {item.isAvailable ? "Available" : "Out of Stock"}
                      </span>
                      <Switch
                        checked={item.isAvailable}
                        onCheckedChange={() => toggleAvailability(item.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="bg-[#eff6ff] border border-[#bedbff] rounded-[10px] px-4 py-4">
          <p className="text-sm text-[#1c398e]">
            <span className="font-semibold">Note:</span>{" "}
            <span className="font-normal">
              When you mark an item as "Out of Stock", it will immediately
              disappear from the customer app for your store. The item will
              still be visible to Admin and can be made available again by
              toggling the switch.
            </span>
          </p>
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {getPageNumbers().map((page, index) =>
                page === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </StoreLayout>
  );
}
