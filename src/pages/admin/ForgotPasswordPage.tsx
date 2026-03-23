import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get("from");
  const from = fromParam === "store" ? "store" : "admin";
  const loginPath = from === "store" ? "/store/login" : "/admin/login";
  const { sendResetCode, verifyResetCode } = useAuth();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await sendResetCode(email);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsSent(true);
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    const verifyResult = await verifyResetCode(email, code);
    if (verifyResult.error) {
      setError(verifyResult.error);
      setIsLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setIsLoading(false);
      return;
    }

    await supabase.auth.signOut();
    setIsLoading(false);
    navigate(loginPath);
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

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center">
            <div className="relative h-16 w-[70px] shrink-0 rounded-lg">
              <Logo className="pointer-events-none absolute inset-0 size-full max-w-none rounded-lg border-0 object-cover" />
            </div>
            <p className="mt-4 text-center text-base font-medium text-foreground">
              Reset Password
            </p>
            <p className="mt-1 max-w-sm px-2 text-center text-base text-muted-foreground">
              {isSent
                ? "Enter the code sent to your email and your new password"
                : "Enter your email to receive a password reset code"}
            </p>
          </div>

          <div className="mt-8 flex w-full flex-col gap-4">
            {error && (
              <div className="w-full rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form
              onSubmit={isSent ? handleReset : handleSendCode}
              className="flex flex-col gap-4"
            >
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
                  disabled={isSent}
                />
              </div>

              {isSent && (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="code">Reset Code</Label>
                    <Input
                      className="h-9 rounded-lg border-transparent bg-input tracking-widest"
                      id="code"
                      placeholder="123456"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={8}
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.replace(/\D/g, ""))
                      }
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      className="h-9 rounded-lg border-transparent bg-input"
                      id="password"
                      placeholder="Enter new password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      className="h-9 rounded-lg border-transparent bg-input"
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <Button
                className="h-9 w-full rounded-lg bg-primary text-white hover:bg-primary/90"
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? isSent
                    ? "Resetting..."
                    : "Sending..."
                  : isSent
                    ? "Reset Password"
                    : "Send Reset Code"}
              </Button>
            </form>

            {isSent && (
              <p
                className="cursor-pointer text-center text-sm text-muted-foreground hover:underline"
                onClick={() => {
                  setIsSent(false);
                  setCode("");
                  setPassword("");
                  setConfirmPassword("");
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setIsSent(false);
                    setCode("");
                    setPassword("");
                    setConfirmPassword("");
                    setError("");
                  }
                }}
                role="button"
                tabIndex={0}
              >
                Didn't receive a code? Send again
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
