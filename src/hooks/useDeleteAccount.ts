import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/supabase";

interface DeleteAccountInput {
  email: string;
  password: string;
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: async ({ email, password }: DeleteAccountInput) => {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/profile/delete-by-credentials`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result?.message || "Failed to delete account");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Your account has been permanently deleted.");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete account",
      );
    },
  });
}
