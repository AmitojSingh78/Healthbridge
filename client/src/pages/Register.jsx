import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartPulse, User, Stethoscope, AlertCircle } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Register = () => {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "patient",
		phone: "",
		dateOfBirth: "",
		gender: "",
		specialization: "",
		experience: "",
		medicalRegistrationNumber: "",
		hospital: "",
	});

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await API.post("/auth/register", formData);
			const { token, user } = response.data;

			login(user, token);

			if (user.role === "doctor") {
				navigate("/doctor/dashboard");
			} else {
				navigate("/patient/dashboard");
			}
		} catch (err) {
			setError(err.response?.data?.message || "Registration failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-ink-50 px-4 py-10">
			<div className="w-full max-w-lg">
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
						Create your account
					</h1>
					<p className="mt-1 text-sm text-ink-500">
						Join HealthBridge as a patient or a doctor.
					</p>

					{error && (
						<div className="mt-4 flex items-center gap-2 rounded-xl bg-coral-50 px-4 py-3 text-sm font-medium text-coral-600">
							<AlertCircle size={16} className="shrink-0" />{" "}
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="mt-5 space-y-4">
						<div className="grid grid-cols-2 gap-3">
							<button
								type="button"
								onClick={() =>
									setFormData({
										...formData,
										role: "patient",
									})
								}
								className={`flex items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-semibold transition ${
									formData.role === "patient"
										? "border-brand-500 bg-brand-50 text-brand-700"
										: "border-ink-200 text-ink-500 hover:bg-ink-50"
								}`}
							>
								<User size={16} /> Patient
							</button>
							<button
								type="button"
								onClick={() =>
									setFormData({ ...formData, role: "doctor" })
								}
								className={`flex items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-semibold transition ${
									formData.role === "doctor"
										? "border-brand-500 bg-brand-50 text-brand-700"
										: "border-ink-200 text-ink-500 hover:bg-ink-50"
								}`}
							>
								<Stethoscope size={16} /> Doctor
							</button>
						</div>

						<div>
							<label className="field-label">Full name</label>
							<input
								className="input"
								name="name"
								value={formData.name}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<label className="field-label">Email</label>
								<input
									className="input"
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									required
								/>
							</div>
							<div>
								<label className="field-label">Password</label>
								<input
									className="input"
									type="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									required
									minLength={6}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<label className="field-label">Phone</label>
								<input
									className="input"
									name="phone"
									value={formData.phone}
									onChange={handleChange}
								/>
							</div>
							<div>
								<label className="field-label">
									Date of birth
								</label>
								<input
									className="input"
									type="date"
									name="dateOfBirth"
									value={formData.dateOfBirth}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div>
							<label className="field-label">Gender</label>
							<select
								className="select"
								name="gender"
								value={formData.gender}
								onChange={handleChange}
							>
								<option value="">Select gender</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
								<option value="other">Other</option>
							</select>
						</div>

						{formData.role === "doctor" && (
							<div className="space-y-4 rounded-xl border border-dashed border-brand-200 bg-brand-50/40 p-4">
								<p className="text-xs font-bold uppercase tracking-wide text-brand-700">
									Professional details
								</p>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div>
										<label className="field-label">
											Specialization
										</label>
										<input
											className="input"
											name="specialization"
											placeholder="e.g. Cardiology"
											value={formData.specialization}
											onChange={handleChange}
										/>
									</div>
									<div>
										<label className="field-label">
											Years of experience
										</label>
										<input
											className="input"
											type="number"
											min="0"
											name="experience"
											value={formData.experience}
											onChange={handleChange}
										/>
									</div>
								</div>
								<div>
									<label className="field-label">
										Medical registration number
									</label>
									<input
										className="input"
										name="medicalRegistrationNumber"
										value={
											formData.medicalRegistrationNumber
										}
										onChange={handleChange}
									/>
								</div>
								<div>
									<label className="field-label">
										Hospital / clinic
									</label>
									<input
										className="input"
										name="hospital"
										value={formData.hospital}
										onChange={handleChange}
									/>
								</div>
							</div>
						)}

						<button
							type="submit"
							className="btn-primary w-full py-2.5"
							disabled={loading}
						>
							{loading ? "Creating account..." : "Create account"}
						</button>
					</form>
				</div>

				<p className="mt-5 text-center text-sm text-ink-500">
					Already have an account?{" "}
					<Link
						to="/login"
						className="font-semibold text-brand-600 hover:underline"
					>
						Log in
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Register;
