import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartPulse, Mail, Lock, AlertCircle } from "lucide-react";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await API.post("/auth/login", { email, password });
			const { token, user } = response.data;

			login(user, token);

			if (user.role === "doctor") {
				navigate("/doctor/dashboard");
			} else {
				navigate("/patient/dashboard");
			}
		} catch (err) {
			setError(err.response?.data?.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-ink-50 px-4 py-10">
			<div className="w-full max-w-md">
				<Link
					to="/"
					className="mb-6 flex items-center justify-center gap-2.5"
				>
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
						<HeartPulse size={20} />
					</div>
					<span className="text-lg font-extrabold tracking-tight text-ink-900">
						HealthBridge
					</span>
				</Link>

				<div className="card-pad">
					<h1 className="text-xl font-extrabold text-ink-900">
						Welcome back
					</h1>
					<p className="mt-1 text-sm text-ink-500">
						Log in to continue to your health dashboard.
					</p>

					{error && (
						<div className="mt-4 flex items-center gap-2 rounded-xl bg-coral-50 px-4 py-3 text-sm font-medium text-coral-600">
							<AlertCircle size={16} className="shrink-0" />{" "}
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="mt-5 space-y-4">
						<div>
							<label className="field-label">Email</label>
							<div className="relative">
								<Mail
									size={16}
									className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
								/>
								<input
									type="email"
									className="input pl-10"
									placeholder="you@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
						</div>

						<div>
							<label className="field-label">Password</label>
							<div className="relative">
								<Lock
									size={16}
									className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
								/>
								<input
									type="password"
									className="input pl-10"
									placeholder="••••••••"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
								/>
							</div>
						</div>

						<button
							type="submit"
							className="btn-primary w-full py-2.5"
							disabled={loading}
						>
							{loading ? "Logging in..." : "Log in"}
						</button>
					</form>
				</div>

				<p className="mt-5 text-center text-sm text-ink-500">
					Don't have an account?{" "}
					<Link
						to="/register"
						className="font-semibold text-brand-600 hover:underline"
					>
						Create one
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
