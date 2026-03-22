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
      <div className="min-w-0 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat) => (
            <StatCard key={`stat-${stat.title}`} {...stat} />
          ))}
        </div>

        <div className="bg-linear-to-r from-[#009689] to-[#00BBA7] flex flex-col gap-4 rounded-2xl p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 shrink-0">
            <FaChartLine className="size-5 text-white" />
            <p className="text-base font-semibold text-white tracking-wide">
              EXECUTIVE SUMMARY
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-3 text-sm text-white/90 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-x-8 sm:gap-y-2">
            <p>
              Stock value:{" "}
              <span className="font-bold text-white">
                {executiveSummary.stockValue}
              </span>
            </p>
            <p>
              Pending:{" "}
              <span className="font-bold text-white">
                {executiveSummary.pending}
              </span>
            </p>
            <p>
              Delivered:{" "}
              <span className="font-bold text-white">
                {executiveSummary.delivered}
              </span>
            </p>
            <p>
              Active Customers:{" "}
              <span className="font-bold text-white">
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
            <div className="overflow-x-auto">
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
            </div>
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
