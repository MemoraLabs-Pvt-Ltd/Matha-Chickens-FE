import { useState } from "react";
import { AlertTriangle, Trash2, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";

export default function DeleteAccountPage() {
  const deleteAccount = useDeleteAccount();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const canSubmit = email.trim() !== "" && password.trim() !== "";

  const handleDelete = () => {
    deleteAccount.mutate(
      { email, password },
      {
        onSuccess: () => {
          setEmail("");
          setPassword("");
          setShowConfirm(false);
        },
        onError: () => {
          setShowConfirm(false);
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-6 text-destructive" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Delete My Account
              </h1>
              <p className="text-sm text-muted-foreground">
                Matha Chickens — Account Deletion
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="mt-6 space-y-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm">
            <p className="font-semibold text-destructive">
              What happens when you delete your account:
            </p>
            <ul className="ml-5 list-disc space-y-1.5 text-muted-foreground">
              <li>
                Your profile and all associated personal data will be
                permanently removed
              </li>
              <li>Your authentication credentials will be deleted</li>
              <li>
                You will lose access to your order history and saved addresses
              </li>
              <li>This action cannot be reversed</li>
            </ul>
          </div>

          {/* Credentials form */}
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="delete-email"
                className="text-sm font-medium text-foreground"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="delete-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="pl-10"
                  disabled={deleteAccount.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="delete-password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="delete-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  disabled={deleteAccount.isPending}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6">
            {!showConfirm ? (
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowConfirm(true)}
                disabled={!canSubmit || deleteAccount.isPending}
              >
                <Trash2 className="size-4" />
                Delete My Account
              </Button>
            ) : (
              <div className="space-y-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                <p className="text-sm font-medium text-destructive">
                  Are you sure? This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowConfirm(false)}
                    disabled={deleteAccount.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleDelete}
                    disabled={deleteAccount.isPending}
                  >
                    {deleteAccount.isPending ? (
                      <>
                        <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Deleting...
                      </>
                    ) : (
                      "Yes, Delete"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Success state */}
          {deleteAccount.isSuccess && (
            <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-center text-sm text-green-400">
              Your account has been successfully deleted. You can close this
              page.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
