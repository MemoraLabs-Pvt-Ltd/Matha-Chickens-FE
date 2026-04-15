import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardPath } from "@/lib/auth";

const LOWERCASE_EMAIL_PATTERN = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

export default function StoreLoginPage() {
  const navigate = useNavigate();
  const { login, user, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      navigate(getDashboardPath(user.role), { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const normalizedEmail = email.trim().toLowerCase();
    if (!LOWERCASE_EMAIL_PATTERN.test(normalizedEmail)) {
      setError("Email must be a valid lowercase email address");
      setIsSubmitting(false);
      return;
    }

    const result = await login(normalizedEmail, password);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      navigate("/store/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-10 sm:py-12">
      <div className="w-full min-w-0 max-w-md">
        <Button
          className="mb-4 h-auto gap-2 px-2 py-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/")}
          variant="ghost"
          type="button"
        >
          <ArrowLeft className="size-4 shrink-0" />
          <span className="text-sm font-normal">Back to Home</span>
        </Button>

        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          <div className="flex flex-col items-center">
            <div className="relative h-16 w-[70px] shrink-0 rounded-lg">
              <Logo className="pointer-events-none absolute inset-0 size-full max-w-none rounded-lg border-0 object-cover" />
            </div>
            <p className="mt-4 text-center text-base font-medium text-foreground">
              Store Owner Login
            </p>
            <p className="mt-1 text-center text-base text-muted-foreground">
              Access your store dashboard
            </p>
          </div>

          <div className="mt-8 flex w-full flex-col gap-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                className="h-9 rounded-lg border-transparent bg-input"
                id="email"
                placeholder="store@mathachickens.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                autoCapitalize="none"
                autoCorrect="off"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  className="h-9 rounded-lg border-transparent bg-input pr-10"
                  id="password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              className="h-9 w-full rounded-lg bg-store text-white hover:bg-store/90"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <p
              className="cursor-pointer text-center text-sm text-muted-foreground hover:underline"
              onClick={() => navigate("/forgot-password?from=store")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate("/forgot-password?from=store");
                }
              }}
              role="button"
              tabIndex={0}
            >
              Forgot password?
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
