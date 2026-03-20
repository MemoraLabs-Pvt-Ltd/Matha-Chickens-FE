import { type ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface TableBodySkeletonProps {
  rows?: number;
  columns?: number;
  rowClassName?: string;
  cellClassName?: string;
  cellClassNames?: string[];
  skeletonClassName?: string;
  renderCell?: (columnIndex: number, rowIndex: number) => ReactNode;
}

export function TableBodySkeleton({
  rows = 5,
  columns = 3,
  rowClassName,
  cellClassName,
  cellClassNames,
  skeletonClassName = "h-4 w-full",
  renderCell,
}: TableBodySkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className={cn(rowClassName)}>
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <TableCell
              key={columnIndex}
              className={cn(cellClassNames?.[columnIndex], cellClassName)}
            >
              {renderCell ? (
                renderCell(columnIndex, rowIndex)
              ) : (
                <Skeleton className={skeletonClassName} />
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

