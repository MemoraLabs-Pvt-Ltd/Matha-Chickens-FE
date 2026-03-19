import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center w-full">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">403</h1>
        <p className="text-lg text-muted-foreground mb-6">
          You do not have permission to access this page.
        </p>
        <Button onClick={() => navigate("/admin/dashboard")} variant="default">
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
