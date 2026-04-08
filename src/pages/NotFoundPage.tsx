import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 px-4 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-sm text-zinc-600">
        The page you are looking for does not exist.
      </p>
      <Button asChild>
        <Link to="/">Go to Home</Link>
      </Button>
    </div>
  );
}

export default NotFoundPage;
