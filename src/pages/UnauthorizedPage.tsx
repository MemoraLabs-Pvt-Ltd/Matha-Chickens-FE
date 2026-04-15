import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardPath } from "@/lib/auth";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoToDashboard = () => {
    if (user) {
      navigate(getDashboardPath(user.role), { replace: true });
    } else {
      navigate("/portal", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">403</h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          You do not have permission to access this page.
        </p>
        <Button
          className="mt-8"
          onClick={handleGoToDashboard}
          variant="default"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
