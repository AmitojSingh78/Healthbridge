import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-50 px-6 text-center">
			<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-coral-50 text-coral-500">
				<ShieldAlert size={30} />
			</div>
			<h1 className="text-2xl font-extrabold text-ink-900">
				Access denied
			</h1>
			<p className="max-w-sm text-sm text-ink-500">
				You don't have permission to view this page with your current
				account role.
			</p>
			<Link to="/" className="btn-primary">
				Go home
			</Link>
		</div>
	);
};

export default Unauthorized;
