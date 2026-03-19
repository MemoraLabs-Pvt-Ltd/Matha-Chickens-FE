import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  FileText,
  Receipt,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
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
import { usePagination } from "@/hooks/usePagination";
import { StoreLayout } from "@/components/common/layout";
import { BillDetailsSheet } from "./BillDetailsSheet";

interface BillItem {
  name: string;
  quantity: number;
  price: number;
}

interface CompletedBill {
  billNumber: string;
  date: string;
  time: string;
  items: BillItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: "Cash" | "UPI" | "Card" | "Other";
}

const completedBills: CompletedBill[] = [
  { billNumber: "MG-001", date: "25/02/2026", time: "11:20:00", items: [{ name: "Fresh Chicken Breast", quantity: 1.5, price: 280 }, { name: "Farm Fresh Eggs (12 pcs)", quantity: 2, price: 84 }], subtotal: 588, discount: 29.4, tax: 27.93, total: 586.53, paymentMethod: "Cash" },
  { billNumber: "MG-002", date: "25/02/2026", time: "15:45:00", items: [{ name: "Whole Roast Chicken", quantity: 1, price: 450 }], subtotal: 450, discount: 22.5, tax: 21.38, total: 448.88, paymentMethod: "UPI" },
  { billNumber: "MG-003", date: "24/02/2026", time: "10:30:00", items: [{ name: "Crispy Fried Chicken", quantity: 2, price: 320 }, { name: "Chicken Wings", quantity: 1, price: 240 }], subtotal: 880, discount: 44, tax: 41.8, total: 877.8, paymentMethod: "Card" },
  { billNumber: "MG-004", date: "24/02/2026", time: "14:15:00", items: [{ name: "Chicken Tikka", quantity: 1.5, price: 400 }], subtotal: 600, discount: 30, tax: 28.5, total: 598.5, paymentMethod: "UPI" },
  { billNumber: "MG-005", date: "24/02/2026", time: "18:00:00", items: [{ name: "Country Chicken - Cut Pieces", quantity: 1, price: 580 }, { name: "Chicken Keema", quantity: 0.5, price: 350 }], subtotal: 755, discount: 37.75, tax: 35.86, total: 753.11, paymentMethod: "Cash" },
  { billNumber: "MG-006", date: "23/02/2026", time: "09:45:00", items: [{ name: "Tandoori Chicken", quantity: 2, price: 380 }], subtotal: 760, discount: 38, tax: 36.1, total: 758.1, paymentMethod: "UPI" },
  { billNumber: "MG-007", date: "23/02/2026", time: "13:20:00", items: [{ name: "Chicken Lolipop", quantity: 4, price: 300 }, { name: "Chicken Drumsticks", quantity: 2, price: 260 }], subtotal: 1720, discount: 86, tax: 81.7, total: 1715.7, paymentMethod: "Card" },
  { billNumber: "MG-008", date: "23/02/2026", time: "17:30:00", items: [{ name: "Farm Fresh Eggs (30 pcs)", quantity: 2, price: 195 }], subtotal: 390, discount: 19.5, tax: 18.53, total: 389.03, paymentMethod: "UPI" },
  { billNumber: "MG-009", date: "22/02/2026", time: "11:00:00", items: [{ name: "Whole Roast Chicken", quantity: 1, price: 450 }, { name: "Chicken Naan", quantity: 4, price: 60 }], subtotal: 690, discount: 34.5, tax: 32.78, total: 688.28, paymentMethod: "Cash" },
  { billNumber: "MG-010", date: "22/02/2026", time: "15:45:00", items: [{ name: "Chicken Malai Tikka", quantity: 2, price: 420 }, { name: "Chicken Seekh Kebab", quantity: 1, price: 360 }], subtotal: 1200, discount: 60, tax: 57, total: 1197, paymentMethod: "UPI" },
  { billNumber: "MG-011", date: "22/02/2026", time: "20:00:00", items: [{ name: "Chicken Boneless", quantity: 1.5, price: 360 }], subtotal: 540, discount: 27, tax: 25.65, total: 538.65, paymentMethod: "Card" },
  { billNumber: "MG-012", date: "21/02/2026", time: "12:30:00", items: [{ name: "Crispy Fried Chicken", quantity: 2, price: 320 }, { name: "Chicken Spring Chicken", quantity: 1, price: 380 }], subtotal: 1020, discount: 51, tax: 48.45, total: 1017.45, paymentMethod: "UPI" },
];

const menuItems = [
  { id: 1, name: "Fresh Chicken Breast", price: 280, unit: "kg" },
  { id: 2, name: "Whole Roast Chicken", price: 450, unit: "kg" },
  { id: 3, name: "Crispy Fried Chicken", price: 320, unit: "kg" },
  { id: 4, name: "Country Chicken - Whole", price: 550, unit: "kg" },
  { id: 5, name: "Country Chicken - Cut Pieces", price: 580, unit: "kg" },
  { id: 6, name: "Farm Fresh Eggs (12 pcs)", price: 84, unit: "pcs" },
  { id: 7, name: "Farm Fresh Eggs (30 pcs)", price: 195, unit: "pcs" },
  { id: 8, name: "Chicken Wings", price: 240, unit: "kg" },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  unit: string;
  quantity: number;
}

const discountPercent = 5;
const taxPercent = 5;

export default function ManualBillingPage() {
  const [activeTab, setActiveTab] = useState<"completed" | "create">("create");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [selectedBill, setSelectedBill] = useState<CompletedBill | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { currentPage, setCurrentPage, totalPages, currentItems, getPageNumbers } = usePagination(completedBills);

  const handleViewBill = (bill: CompletedBill) => {
    setSelectedBill(bill);
    setIsSheetOpen(true);
  };

  const addToCart = (item: (typeof menuItems)[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxPercent) / 100;
  const total = taxableAmount + taxAmount;

  const filteredItems = useMemo(
    () =>
      menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  );

  return (
    <StoreLayout title="Manual Billing" disableScroll>
      <div className="flex gap-4 h-full overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as typeof activeTab)}
          className="flex-1 flex flex-col h-full overflow-hidden"
        >
          <TabsList className="mb-4 bg-muted h-9 rounded-full w-auto">
            <TabsTrigger
              value="create"
              className="rounded-full px-4 h-7 data-[state=active]:bg-white"
            >
              <Receipt className="size-4 mr-2" />
              Create Bill
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="rounded-full px-4 h-7 data-[state=active]:bg-white"
            >
              <FileText className="size-4 mr-2" />
              Completed Bills ({completedBills.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="completed" className="flex-1 min-h-0 mt-0">
            <Card className="border-border h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium text-foreground">
                  Completed Bills History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border">
                      <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                        Bill Number
                      </TableHead>
                      <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                        Date & Time
                      </TableHead>
                      <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                        Items
                      </TableHead>
                      <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                        Total
                      </TableHead>
                      <TableHead className="text-left py-3 pl-4 text-sm font-medium text-foreground">
                        Payment
                      </TableHead>
                      <TableHead className="text-right py-3 pr-4 text-sm font-medium text-foreground">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((bill) => (
                      <TableRow
                        key={bill.billNumber}
                        className="border-b border-border"
                      >
                        <TableCell className="py-4 pl-4">
                          <span className="text-sm font-medium text-foreground">
                            {bill.billNumber}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 pl-4">
                          <div className="text-sm text-foreground">
                            {bill.date}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {bill.time}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 pl-4">
                          <span className="text-sm text-foreground">
                            {bill.items.length} item(s)
                          </span>
                        </TableCell>
                        <TableCell className="py-4 pl-4">
                          <span className="text-sm font-semibold text-foreground">
                            ₹{bill.total.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 pl-4">
                          <span className="inline-flex items-center px-2 py-1 bg-muted rounded text-xs text-foreground">
                            {bill.paymentMethod}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 pr-4 text-right">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 hover:bg-muted"
                            onClick={() => handleViewBill(bill)}
                          >
                            <Eye className="size-4 text-muted-foreground" />
                          </Button>
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
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="create"
            className="flex-1 min-h-0 mt-0 flex gap-4"
          >
            <div className="bg-card border border-border rounded-xl w-full max-w-[519px] overflow-hidden flex flex-col">
              <div className="px-6 pt-5 pb-3 shrink-0">
                <h2 className="text-base font-medium text-foreground">
                  Select Items
                </h2>
              </div>

              <div className="px-6 pb-4 flex-1 min-h-0 flex flex-col">
                <div className="flex gap-3 mb-3 shrink-0">
                  <Button
                    variant="secondary"
                    className="h-9 px-3 rounded-lg gap-2"
                  >
                    All Categories
                    <ChevronDown className="size-4" />
                  </Button>
                  <div className="flex-1 bg-muted rounded-lg px-3 flex items-center h-9">
                    <Search className="size-4 text-muted-foreground mr-2" />
                    <Input
                      className="border-0 bg-transparent p-0 h-auto shadow-none focus-visible:ring-0 text-sm"
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto pr-1">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-muted rounded-xl px-3 py-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-base font-medium text-foreground">
                          {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ₹{item.price.toFixed(2)}/{item.unit}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        className="size-8 bg-store hover:bg-store/90 rounded-lg"
                        onClick={() => addToCart(item)}
                      >
                        <Plus className="size-4 text-white" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-[519px] h-full overflow-hidden">
              <div className="bg-card border border-border rounded-xl px-6 py-5 overflow-hidden flex flex-col">
                <h2 className="text-base font-medium text-foreground mb-4 shrink-0">
                  Bill Details
                </h2>
                {cart.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-base text-muted-foreground">
                      No items added yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Select items from the left panel
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ₹{item.price} x {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-card border border-border rounded-xl px-6 py-5 overflow-hidden flex flex-col">
                <h2 className="text-base font-medium text-foreground mb-4 shrink-0">
                  Bill Summary
                </h2>

                <div className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">Subtotal:</span>
                    <span className="text-sm text-foreground">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">
                      Discount ({discountPercent}%):
                    </span>
                    <span className="text-sm text-[#00a63e]">
                      -₹{discountAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">
                      Tax (GST {taxPercent}%):
                    </span>
                    <span className="text-sm text-foreground">
                      ₹{taxAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="text-base font-bold text-foreground">
                      Total:
                    </span>
                    <span className="text-base font-bold text-foreground">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-medium text-foreground mb-2">
                      Payment Mode
                    </p>
                    <Select value={paymentMode} onValueChange={setPaymentMode}>
                      <SelectTrigger className="w-full bg-muted border-transparent rounded-lg h-9 text-sm">
                        <SelectValue placeholder="Select Payment Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full h-9 bg-store hover:bg-store/90 rounded-lg text-white mt-4"
                    disabled={cart.length === 0}
                  >
                    <FileText className="size-4 mr-2" />
                    Save & Print Bill
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <BillDetailsSheet
          bill={selectedBill}
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
        />
      </div>
    </StoreLayout>
  );
}
