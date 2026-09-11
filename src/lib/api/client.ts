import { supabase, API_BASE_URL } from "@/lib/supabase";

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new ApiError("Not authenticated", 401);
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  };
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(
      data?.message || "Request failed",
      response.status,
      data
    );
  }

  return response.json();
}

export async function apiPost<T>(
  endpoint: string,
  body: unknown
): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(
      data?.message || "Request failed",
      response.status,
      data
    );
  }

  return response.json();
}

/**
 * Multipart form-data POST (file uploads). Omits Content-Type so the
 * browser sets it with the correct multipart boundary.
 */
export async function apiPostForm<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const headers = await getAuthHeaders();
  delete (headers as Record<string, string>)["Content-Type"];

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(
      data?.message || "Request failed",
      response.status,
      data
    );
  }

  return response.json();
}

export async function apiPut<T>(
  endpoint: string,
  body: unknown
): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(
      data?.message || "Request failed",
      response.status,
      data
    );
  }

  return response.json();
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(
      data?.message || "Request failed",
      response.status,
      data
    );
  }

  return response.json();
}
