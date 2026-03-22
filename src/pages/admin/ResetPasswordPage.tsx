import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { supabase } from "@/lib/supabase";

function AuthCardShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-10 sm:py-12">
      <div className="w-full min-w-0 max-w-md">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center">
            <div className="relative h-16 w-[70px] shrink-0 rounded-lg">
              <Logo className="pointer-events-none absolute inset-0 size-full max-w-none rounded-lg border-0 object-cover" />
            </div>
            <p className="mt-4 text-center text-base font-medium text-foreground">
              {title}
            </p>
            {subtitle ? (
              <p className="mt-1 text-center text-base text-muted-foreground">
                {subtitle}
              </p>
            ) : null}
          </div>
          <div className="mt-8 flex w-full flex-col gap-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function loginPathFromParam(from: string | null): string {
  return from === "store" ? "/store/login" : "/admin/login";
}

function parseHashRecovery(): boolean {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return false;
  const params = new URLSearchParams(hash);
  return (
    params.get("type") === "recovery" && Boolean(params.get("access_token"))
  );
}

/** Supabase puts auth errors in the hash, e.g. #error=access_denied&error_code=otp_expired */
function parseHashAuthError(): {
  error: string;
  errorCode: string | null;
  errorDescription: string | null;
} | null {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  const err = params.get("error");
  if (!err) return null;
  return {
    error: err,
    errorCode: params.get("error_code"),
    errorDescription: params.get("error_description"),
  };
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const loginPath = loginPathFromParam(from);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [recoveryReady, setRecoveryReady] = useState(false);
  const [recoveryChecked, setRecoveryChecked] = useState(false);
  const [hashAuthError] = useState<ReturnType<typeof parseHashAuthError>>(() =>
    parseHashAuthError(),
  );

  useEffect(() => {
    let cancelled = false;

    const finish = () => {
      if (!cancelled) setRecoveryChecked(true);
    };

    if (hashAuthError) {
      finish();
      return () => {
        cancelled = true;
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryReady(true);
        finish();
      }
    });

    const run = async () => {
      if (parseHashRecovery()) {
        setRecoveryReady(true);
        finish();
        return;
      }

      const qs = new URLSearchParams(window.location.search);
      const pkceCode = qs.get("code");
      if (pkceCode) {
        for (let i = 0; i < 50; i++) {
          if (cancelled) return;
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session) {
            setRecoveryReady(true);
            finish();
            return;
          }
          await new Promise((r) => setTimeout(r, 100));
        }
        finish();
        return;
      }

      await new Promise((r) => setTimeout(r, 1600));
      finish();
    };

    void run();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [hashAuthError]);

  const showInvalid = recoveryChecked && !recoveryReady && !isSuccess;
  const isOtpExpired =
    hashAuthError?.errorCode === "otp_expired" ||
    hashAuthError?.errorDescription?.toLowerCase().includes("expired");

  if (!recoveryChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (showInvalid) {
    return (
      <AuthCardShell
        title="Password Reset"
        subtitle={
          isOtpExpired
            ? "This link is no longer valid"
            : undefined
        }
      >
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {isOtpExpired ? (
            <>
              <p className="font-medium">The reset link could not be used.</p>
              <p className="mt-2 text-destructive/90">
                That usually means the one-time token was already used, expired,
                or was opened automatically by your email app or a security
                scanner before you clicked it—so it is not the same as the
                email &quot;being old.&quot; Request a new link, open it in a
                private window, and use the latest email only (a new request
                invalidates older links).
              </p>
            </>
          ) : (
            "Invalid or expired password reset link. Please request a new one."
          )}
        </div>
        <Button
          className="h-9 w-full rounded-lg bg-admin text-white hover:bg-admin/90"
          onClick={() =>
            navigate(
              from === "store"
                ? "/forgot-password?from=store"
                : "/forgot-password",
            )
          }
        >
          Request New Link
        </Button>
        <p
          className="cursor-pointer text-center text-sm text-muted-foreground hover:underline"
          onClick={() => navigate(loginPath)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate(loginPath);
            }
          }}
          role="button"
          tabIndex={0}
        >
          Back to Login
        </p>
      </AuthCardShell>
    );
  }

  if (isSuccess) {
    return (
      <AuthCardShell title="Password Reset Complete">
        <p className="text-center text-sm text-muted-foreground">
          Your password has been successfully reset. You can now login with your
          new password.
        </p>
        <Button
          className="h-9 w-full rounded-lg bg-admin text-white hover:bg-admin/90"
          onClick={() => navigate(loginPath)}
        >
          Go to Login
        </Button>
      </AuthCardShell>
    );
  }

  const handleResetPassword = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setIsSubmitting(false);
      return;
    }

    await supabase.auth.signOut();
    setIsSuccess(true);
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-10 sm:py-12">
      <div className="w-full min-w-0 max-w-md">
        <form
          onSubmit={handleResetPassword}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          <div className="flex flex-col items-center">
            <div className="relative h-16 w-[70px] shrink-0 rounded-lg">
              <Logo className="pointer-events-none absolute inset-0 size-full max-w-none rounded-lg border-0 object-cover" />
            </div>
            <p className="mt-4 text-center text-base font-medium text-foreground">
              Set New Password
            </p>
            <p className="mt-1 text-center text-base text-muted-foreground">
              Enter your new password below
            </p>
          </div>

          <div className="mt-8 flex w-full flex-col gap-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

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

            <Button
              className="h-9 w-full rounded-lg bg-admin text-white hover:bg-admin/90"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>

            <p
              className="cursor-pointer text-center text-sm text-muted-foreground hover:underline"
              onClick={() => navigate(loginPath)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(loginPath);
                }
              }}
              role="button"
              tabIndex={0}
            >
              Back to Login
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
