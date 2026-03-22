import { FaChartLine } from "react-icons/fa";
import type { IconType } from "react-icons";
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
import { AdminLayout } from "./AdminLayout";
import {
  StatCard,
  OrderRow,
  StatusRow,
  AlertRow,
  StoreStatRow,
} from "@/components/common/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { getPaginationPageNumbers } from "@/lib/display/pagination";

interface DashboardLayoutProps {
  stats: {
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: string;
    iconBg: string;
    icon: IconType;
    iconColor: string;
  }[];
  executiveSummary: {
    stockValue: string;
    pending: string;
    delivered: string;
    activeCustomers: string;
  };
  orders: {
    id: string;
    customer: string;
    phone: string;
    store: string;
    amount: string;
    status: "received" | "dispatched" | "delivered";
    date: string;
  }[];
  orderStatuses: {
    label: string;
    value: number;
    icon: IconType;
    bgColor: string;
  }[];
  inventoryAlerts: {
    label: string;
    value: number;
    icon: IconType;
    bgColor: string;
  }[];
  storeStats: {
    label: string;
    value: string | number;
    valueColor?: string;
  }[];
  isLoading?: boolean;
  ordersCurrentPage?: number;
  ordersTotalPages?: number;
  onOrdersPageChange?: (page: number) => void;
}

export function DashboardLayout({
  stats,
  executiveSummary,
  orders,
  orderStatuses,
  inventoryAlerts,
  storeStats,
  isLoading,
  ordersCurrentPage = 1,
  ordersTotalPages = 1,
  onOrdersPageChange,
}: DashboardLayoutProps) {
  return (
    <AdminLayout title="Dashboard">
      <div className="flex-1 p-6 overflow-auto z-10">
        <div className="grid grid-cols-4 gap-6 mb-6">
          {stats.map((stat) => (
            <StatCard key={`stat-${stat.title}`} {...stat} />
          ))}
        </div>

        <div className="bg-linear-to-r from-[#009689] to-[#00BBA7] rounded-2xl p-4 mb-6 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaChartLine className="size-5 text-white" />
            <p className="text-base font-semibold text-white tracking-wide">
              EXECUTIVE SUMMARY
            </p>
          </div>
          <div className="flex gap-8">
            <p className="text-sm text-white opacity-90">
              Stock value:{" "}
              <span className="font-bold">{executiveSummary.stockValue}</span>
            </p>
            <p className="text-sm text-white opacity-90">
              Pending:{" "}
              <span className="font-bold">{executiveSummary.pending}</span>
            </p>
            <p className="text-sm text-white opacity-90">
              Delivered:{" "}
              <span className="font-bold">{executiveSummary.delivered}</span>
            </p>
            <p className="text-sm text-white opacity-90">
              Active Customers:{" "}
              <span className="font-bold">
                {executiveSummary.activeCustomers}
              </span>
            </p>
          </div>
        </div>

        <Card className="rounded-2xl border-[#e5e5e5] shadow-sm mb-6">
          <CardHeader className="border-b border-[#e5e5e5] px-6 py-6">
            <CardTitle className="text-xl font-semibold text-[#171717] tracking-wide">
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#fafafa]">
                  <TableHead className="text-left py-4 pl-6 text-sm font-semibold text-[#404040]">
                    Order ID
                  </TableHead>
                  <TableHead className="text-left py-4 text-sm font-semibold text-[#404040]">
                    Customer
                  </TableHead>
                  <TableHead className="text-left py-4 text-sm font-semibold text-[#404040]">
                    Store
                  </TableHead>
                  <TableHead className="text-right py-4 pr-6 text-sm font-semibold text-[#404040]">
                    Amount
                  </TableHead>
                  <TableHead className="text-center py-4 text-sm font-semibold text-[#404040]">
                    Status
                  </TableHead>
                  <TableHead className="text-right py-4 pr-6 text-sm font-semibold text-[#404040]">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={`skel-${i}`}>
                      <TableCell className="py-4 pl-6">
                        <Skeleton className="h-4 w-16 rounded" />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-4 w-28 rounded" />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-4 w-36 rounded" />
                      </TableCell>
                      <TableCell className="py-4 pr-6 text-right">
                        <Skeleton className="h-4 w-20 rounded ml-auto" />
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <Skeleton className="h-6 w-24 rounded-full mx-auto" />
                      </TableCell>
                      <TableCell className="py-4 pr-6 text-right">
                        <Skeleton className="h-4 w-20 rounded ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}
                {!isLoading &&
                  orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                {!isLoading &&
                  orders.map((order) => (
                    <OrderRow key={order.id} {...order} />
                  ))}
              </TableBody>
            </Table>
            {ordersTotalPages > 1 && (
              <div className="py-4 px-6 border-t border-[#e5e5e5]">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          onOrdersPageChange?.(
                            Math.max(1, ordersCurrentPage - 1),
                          )
                        }
                        className={
                          ordersCurrentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {getPaginationPageNumbers(ordersCurrentPage, ordersTotalPages).map(
                      (page, index) =>
                        page === "ellipsis" ? (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={page}>
                            <PaginationLink
                              isActive={ordersCurrentPage === page}
                              onClick={() => onOrdersPageChange?.(page)}
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
                          onOrdersPageChange?.(
                            Math.min(ordersTotalPages, ordersCurrentPage + 1),
                          )
                        }
                        className={
                          ordersCurrentPage === ordersTotalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-6">
          <Card className="rounded-2xl border-[#e5e5e5] shadow-sm p-6">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-base font-semibold text-[#171717]">
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="flex flex-col gap-4">
                {orderStatuses.map((item) => (
                  <StatusRow key={`status-${item.label}`} {...item} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[#e5e5e5] shadow-sm p-6">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-base font-semibold text-[#171717]">
                Inventory Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="flex flex-col gap-4">
                {inventoryAlerts.map((item) => (
                  <AlertRow key={`alert-${item.label}`} {...item} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[#e5e5e5] shadow-sm p-6">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-base font-semibold text-[#171717]">
                Store Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="flex flex-col gap-3">
                {storeStats.map((item) => (
                  <StoreStatRow key={`store-${item.label}`} {...item} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
