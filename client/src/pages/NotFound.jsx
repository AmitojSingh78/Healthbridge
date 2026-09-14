import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-50 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Compass size={30} />
      </div>
      <h1 className="text-2xl font-extrabold text-ink-900">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-500">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn-primary">
        Go home
      </Link>
    </div>
  );
};

export default NotFound;
