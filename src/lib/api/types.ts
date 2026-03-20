export interface PaginationMeta {
  page: number;
  limit: number;
  totalPages: number;
  totalData: number;
}

export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T;
  pagination?: PaginationMeta;
}
