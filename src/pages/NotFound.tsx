import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import NotFoundSvg from "@/assets/not_found.svg";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <img
        src={NotFoundSvg}
        alt="Page not found"
        className="w-full max-w-[600px] h-auto"
      />
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-xl font-semibold text-[#0a0a0a]">Page not found</p>
        <p className="text-sm text-muted-foreground max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <Button
        onClick={() => navigate("/")}
        className="bg-admin h-9 px-6 hover:bg-admin/90 rounded-lg text-white"
      >
        <Home className="size-4 mr-2" />
        Back to Home
      </Button>
    </div>
  );
}
