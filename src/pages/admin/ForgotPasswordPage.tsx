import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await resetPassword(email);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsSuccess(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center w-full">
      <div className="h-[500px] relative shrink-0 w-[448px]">
        <form onSubmit={handleReset}>
          <div>
            <Button
              className="absolute left-0 top-0 px-6 py-4"
              onClick={() => navigate("/admin/login")}
              variant="ghost"
              type="button"
            >
              <FaArrowLeft className="size-4 text-muted-foreground" />
              <span className="font-normal leading-5 ml-2 text-sm text-muted-foreground">
                Back to Login
              </span>
            </Button>

            <div className="absolute bg-card border border-border flex flex-col gap-16 h-[460px] items-start left-0 p-px rounded-2xl top-[52px] w-[448px]">
              <div className="h-[120px] relative shrink-0 w-[446px]">
                <div className="flex flex-col items-center pt-6 px-6 size-full">
                  <div className="h-16 relative rounded-lg shrink-0 w-[70px]">
                    <Logo className="absolute bg-clip-padding border-0 border-transparent border-solid inset-0 max-w-none object-cover pointer-events-none rounded-lg size-full" />
                  </div>

                  <p className="font-medium leading-4 mt-4 text-base text-foreground text-center">
                    Reset Password
                  </p>

                  <p className="font-normal leading-6 mt-1 text-base text-muted-foreground text-center px-4">
                    Enter your email to receive a password reset link
                  </p>
                </div>
              </div>

              <div className="flex-1 min-h-px min-w-px relative w-[446px]">
                <div className="flex flex-col items-start px-6 size-full">
                  <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
                    {error && (
                      <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg w-full">
                        {error}
                      </div>
                    )}

                    {isSuccess ? (
                      <div className="bg-green-100 text-green-700 text-sm p-3 rounded-lg w-full">
                        Password reset email sent! Check your inbox.
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col gap-2 h-[58px] items-start relative shrink-0 w-full">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            className="bg-input border-transparent h-9 rounded-lg"
                            id="email"
                            placeholder="admin@mathachickens.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>

                        <Button
                          className="bg-admin h-9 hover:bg-admin/90 rounded-lg text-white w-full"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? "Sending..." : "Send Reset Link"}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
