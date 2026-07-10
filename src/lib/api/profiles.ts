import { apiDelete } from "./client";
import type { ApiResponse } from "./types";

export function deleteProfile(): Promise<ApiResponse<null>> {
  return apiDelete<ApiResponse<null>>("/api/v1/profile");
}
