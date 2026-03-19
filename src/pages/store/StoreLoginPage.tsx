import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";

export default function StoreLoginPage() {
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
            <ArrowLeft className="size-4 text-muted-foreground" />
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
                  Store Owner Login
                </p>

                <p className="font-normal leading-6 mt-1 text-base text-muted-foreground text-center">
                  Access your store dashboard
                </p>
              </div>
            </div>

            <div className="flex-1 min-h-px min-w-px relative w-[446px]">
              <div className="flex flex-col items-start px-6 size-full">
                <div className="flex flex-col gap-4 h-[304px] items-start relative shrink-0 w-full">
                  <div className="flex flex-col gap-2 h-[58px] items-start relative shrink-0 w-full">
                    <Label htmlFor="storeId">Store Login ID</Label>
                    <Input
                      className="bg-input border-transparent h-9 rounded-lg"
                      id="storeId"
                      placeholder="Enter your store ID"
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
                    className="bg-store h-9 hover:bg-store/90 rounded-lg text-white w-full"
                    onClick={() => navigate("/store/dashboard")}
                  >
                    Login
                  </Button>

                  <div className="bg-gray-100 border border-border flex flex-col gap-2 h-[58px] items-start justify-center p-3 rounded-lg w-full">
                    <p className="font-normal leading-4 text-xs text-muted-foreground">
                      Demo Credentials
                    </p>
                    <div className="flex gap-4">
                      <span className="font-medium leading-4 text-sm text-foreground">
                        mgroad
                      </span>
                      <span className="font-medium leading-4 text-sm text-foreground">
                        /
                      </span>
                      <span className="font-medium leading-4 text-sm text-foreground">
                        store123
                      </span>
                    </div>
                  </div>

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
