import { useMemo, useState, type SetStateAction } from "react";
import { getPaginationPageNumbers } from "@/lib/display/pagination";

interface UsePaginationOptions {
  itemsPerPage?: number;
}

export function usePagination<T>(
  allItems: T[],
  { itemsPerPage = 5 }: UsePaginationOptions = {},
) {
  const [currentPageState, setCurrentPageState] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil(allItems.length / itemsPerPage),
    [allItems.length, itemsPerPage],
  );

  const currentPage =
    totalPages === 0
      ? 1
      : Math.min(Math.max(currentPageState, 1), totalPages);

  const setCurrentPage = (value: SetStateAction<number>) => {
    setCurrentPageState((prev) => {
      const prevClamped =
        totalPages === 0
          ? 1
          : Math.min(Math.max(prev, 1), totalPages);
      const next =
        typeof value === "function" ? value(prevClamped) : value;

      if (totalPages === 0) return 1;
      return Math.min(Math.max(next, 1), totalPages);
    });
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = useMemo(
    () => allItems.slice(startIndex, startIndex + itemsPerPage),
    [allItems, startIndex, itemsPerPage],
  );

  const getPageNumbers = () =>
    getPaginationPageNumbers(currentPage, totalPages);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems,
    getPageNumbers,
  };
}
