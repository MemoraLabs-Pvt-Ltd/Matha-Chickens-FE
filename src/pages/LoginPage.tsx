import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center w-full">
      <div className="h-[670px] relative shrink-0 w-[448px]">
        <div>
          <Button
            className="absolute left-0 top-0 px-6 py-4"
            onClick={() => navigate("/")}
            variant="ghost"
          >
            <FaArrowLeft className="size-4 text-muted-foreground" />
            <span className="font-normal leading-5 ml-2 text-sm text-muted-foreground">
              Back to Home
            </span>
          </Button>

          <div className="absolute bg-card border border-border flex flex-col gap-16 h-[618px] items-start left-0 p-px rounded-2xl top-[52px] w-[448px]">
            <div className="h-[156px] relative shrink-0 w-[446px]">
              <div className="flex flex-col items-center pt-6 px-6 size-full">
                <div className="h-16 relative rounded-lg shrink-0 w-[70px]">
                  <Logo className="absolute bg-clip-padding border-0 border-transparent border-solid inset-0 max-w-none object-cover pointer-events-none rounded-lg size-full" />
                </div>

                <p className="font-medium leading-4 mt-4 text-base text-foreground text-center">
                  Admin Login
                </p>

                <p className="font-normal leading-6 mt-1 text-base text-muted-foreground text-center">
                  Access the central management portal
                </p>
              </div>
            </div>

            <div className="flex-1 min-h-px min-w-px relative w-[446px]">
              <div className="flex flex-col items-start px-6 size-full">
                <div className="flex flex-col gap-4 h-[304px] items-start relative shrink-0 w-full">
                  <div className="flex flex-col gap-2 h-[58px] items-start relative shrink-0 w-full">
                    <Label htmlFor="email">Email or Username</Label>
                    <Input
                      className="bg-input border-transparent h-9 rounded-lg"
                      id="email"
                      placeholder="admin@mathachickens.com"
                      type="text"
                    />
                  </div>

                  <div className="flex flex-col gap-2 h-[58px] items-start relative shrink-0 w-full">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      className="bg-input border-transparent h-9 rounded-lg"
                      id="password"
                      placeholder="Enter your password"
                      type="password"
                    />
                  </div>

                  <Button
                    className="bg-admin h-9 hover:bg-admin/90 rounded-lg text-white w-full"
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Login
                  </Button>

                  <div className="flex h-4 items-center relative shrink-0 w-full">
                    <div className="border-border border-solid border-t flex-1 h-px min-h-px min-w-px" />
                    <span className="absolute bg-card h-4 leading-4 px-2 text-xs text-muted-foreground uppercase">
                      Or continue with
                    </span>
                  </div>

                  <Button
                    className="bg-card border border-border h-9 rounded-lg text-foreground w-full"
                    onClick={() => navigate("/admin/dashboard")}
                    variant="outline"
                  >
                    <FcGoogle className="mr-2 size-5" />
                    Login with Gmail
                  </Button>

                  <p className="font-normal h-5 leading-5 text-sm text-muted-foreground text-center w-full">
                    Forgot password?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
