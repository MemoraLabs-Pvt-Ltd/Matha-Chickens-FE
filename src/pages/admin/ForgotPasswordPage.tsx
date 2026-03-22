import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get("from");
  const from = fromParam === "store" ? "store" : "admin";
  const loginPath = from === "store" ? "/store/login" : "/admin/login";
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await resetPassword(email, { from });

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsSuccess(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-10 sm:py-12">
      <div className="w-full min-w-0 max-w-md">
        <Button
          className="mb-4 h-auto gap-2 px-2 py-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(loginPath)}
          variant="ghost"
          type="button"
        >
          <FaArrowLeft className="size-4 shrink-0" />
          <span className="text-sm font-normal">Back to Login</span>
        </Button>

        <form
          onSubmit={handleReset}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          <div className="flex flex-col items-center">
            <div className="relative h-16 w-[70px] shrink-0 rounded-lg">
              <Logo className="pointer-events-none absolute inset-0 size-full max-w-none rounded-lg border-0 object-cover" />
            </div>
            <p className="mt-4 text-center text-base font-medium text-foreground">
              Reset Password
            </p>
            <p className="mt-1 max-w-sm px-2 text-center text-base text-muted-foreground">
              Enter your email to receive a password reset link
            </p>
          </div>

          <div className="mt-8 flex w-full flex-col gap-4">
            {error && (
              <div className="w-full rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {isSuccess ? (
              <div className="w-full rounded-lg bg-green-100 p-3 text-sm text-green-700">
                Password reset email sent! Check your inbox.
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    className="h-9 rounded-lg border-transparent bg-input"
                    id="email"
                    placeholder="admin@mathachickens.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button
                  className="h-9 w-full rounded-lg bg-primary text-white hover:bg-primary/90"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
