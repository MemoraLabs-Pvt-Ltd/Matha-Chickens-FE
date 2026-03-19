import { useState, useMemo } from "react";

interface UsePaginationOptions {
  itemsPerPage?: number;
}

export function usePagination<T>(
  allItems: T[],
  { itemsPerPage = 5 }: UsePaginationOptions = {},
) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil(allItems.length / itemsPerPage),
    [allItems.length, itemsPerPage],
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = useMemo(
    () => allItems.slice(startIndex, startIndex + itemsPerPage),
    [allItems, startIndex, itemsPerPage],
  );

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

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems,
    getPageNumbers,
  };
}
