import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import NotFoundSvg from "@/assets/not_found.svg";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10 sm:gap-8 sm:p-8">
      <img
        src={NotFoundSvg}
        alt="Page not found"
        className="h-auto w-full max-w-[min(600px,calc(100vw-2rem))]"
      />
      <div className="flex max-w-md flex-col items-center gap-2 text-center">
        <p className="text-lg font-semibold text-[#0a0a0a] sm:text-xl">
          Page not found
        </p>
        <p className="text-sm text-muted-foreground sm:text-base">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <Button
        onClick={() => navigate("/")}
        className="h-9 rounded-lg bg-admin px-6 text-white hover:bg-admin/90"
      >
        <Home className="mr-2 size-4" />
        Back to Home
      </Button>
    </div>
  );
}
