import { useState } from "react";
import { Plus, Package, TrendingUp, DollarSign, Calendar, Search, Download } from "lucide-react";
import { AdminLayout } from "@/components/common/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StockReceiptDialog } from "@/components/admin/dialogs/stock/StockReceiptDialog";

interface StockReceipt {
  id: string;
  date: string;
  time: string;
  supplier: string;
  item: string;
  quantity: string;
  unit: string;
  pricePerUnit: number;
  total: number;
  notes: string;
}

const receipts: StockReceipt[] = [
  {
    id: "SR001",
    date: "24 Feb 2026",
    time: "10:30 am",
    supplier: "Ramesh Poultry Farm",
    item: "Fresh Chicken Breast",
    quantity: "100",
    unit: "kg",
    pricePerUnit: 280,
    total: 28000,
    notes: "Received 100 kg of fresh chicken breast",
  },
  {
    id: "SR002",
    date: "25 Feb 2026",
    time: "11:20 am",
    supplier: "Lakshmi Egg Traders",
    item: "Farm Fresh Eggs (12 pcs)",
    quantity: "500",
    unit: "dozen",
    pricePerUnit: 84,
    total: 42000,
    notes: "Received 500 dozen of farm fresh eggs",
  },
];

export default function StockManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <AdminLayout title="Stock Management">
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-base text-muted-foreground">
            Track stock received from suppliers
          </p>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-green-600 hover:bg-green-600/90 text-white rounded-lg h-9 px-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Stock Receipt
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* Total Receipts */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-[14px] p-2">
            <div className="px-4 pt-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-[#525252]">Total Receipts</p>
                <Package className="w-5 h-5 text-[#525252]" />
              </div>
              <p className="text-3xl font-bold text-[#1447e6]">2</p>
              <p className="text-xs text-[#525252] mt-1">All time</p>
            </div>
          </div>

          {/* Total Quantity */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-[14px] p-2">
            <div className="px-4 pt-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-[#525252]">Total Quantity</p>
                <TrendingUp className="w-5 h-5 text-[#525252]" />
              </div>
              <p className="text-3xl font-bold text-[#8200db]">600</p>
              <p className="text-xs text-[#525252] mt-1">Units received</p>
            </div>
          </div>

          {/* Total Value */}
          <div className="bg-green-50 border-2 border-green-200 rounded-[14px] p-2">
            <div className="px-4 pt-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-[#525252]">Total Value</p>
                <DollarSign className="w-5 h-5 text-[#525252]" />
              </div>
              <p className="text-3xl font-bold text-[#008236]">₹70,000</p>
              <p className="text-xs text-[#525252] mt-1">Stock value</p>
            </div>
          </div>

          {/* Recent (24h) */}
          <div className="bg-orange-50 border-2 border-orange-200 rounded-[14px] p-2">
            <div className="px-4 pt-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-[#525252]">Recent (24h)</p>
                <Calendar className="w-5 h-5 text-[#525252]" />
              </div>
              <p className="text-3xl font-bold text-[#ca3500]">0</p>
              <p className="text-xs text-[#525252] mt-1">Last 24 hours</p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717182]" />
              <Input
                placeholder="Search by supplier, item, or receipt ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#f3f3f5] border-0 rounded-lg h-9"
              />
            </div>

            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger className="w-[180px] bg-[#f3f3f5] border-0 rounded-lg h-9">
                <SelectValue placeholder="All Suppliers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                <SelectItem value="ramesh">Ramesh Poultry Farm</SelectItem>
                <SelectItem value="lakshmi">Lakshmi Egg Traders</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="border-border rounded-lg h-9 px-4">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] overflow-hidden">
          <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.1)]">
            <h3 className="text-base font-medium text-[#0a0a0a]">Stock Receipt History</h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-b border-[rgba(0,0,0,0.1)]">
                <TableHead className="text-left text-sm font-semibold text-[#404040]">Receipt ID</TableHead>
                <TableHead className="text-left text-sm font-semibold text-[#404040]">Date</TableHead>
                <TableHead className="text-left text-sm font-semibold text-[#404040]">Supplier</TableHead>
                <TableHead className="text-left text-sm font-semibold text-[#404040]">Item</TableHead>
                <TableHead className="text-right text-sm font-semibold text-[#404040]">Quantity</TableHead>
                <TableHead className="text-right text-sm font-semibold text-[#404040]">Price/Unit</TableHead>
                <TableHead className="text-right text-sm font-semibold text-[#404040]">Total</TableHead>
                <TableHead className="text-left text-sm font-semibold text-[#404040]">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.map((receipt) => (
                <TableRow key={receipt.id} className="border-b border-[rgba(0,0,0,0.1)] last:border-0">
                  <TableCell className="py-4">
                    <span className="font-mono font-bold text-[#155dfc] text-sm">
                      {receipt.id}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#171717]">{receipt.date}</span>
                      <span className="text-xs text-[#737373]">{receipt.time}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm font-medium text-[#171717]">{receipt.supplier}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm font-medium text-[#171717]">{receipt.item}</span>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <span className="text-sm font-semibold text-[#8200db]">
                      {receipt.quantity} {receipt.unit}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <span className="text-sm text-[#404040]">₹{receipt.pricePerUnit}</span>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <span className="text-sm font-bold text-[#008236]">₹{receipt.total.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-sm text-[#525252]">{receipt.notes}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <StockReceiptDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </AdminLayout>
  );
}
