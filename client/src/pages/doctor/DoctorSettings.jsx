import { useState } from "react";
import {
	User,
	Phone,
	Stethoscope,
	Award,
	Building2,
	Save,
	CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { updateMyProfile } from "../../services/userService";

const DoctorSettings = () => {
	const { user, updateUser } = useAuth();

	const [formData, setFormData] = useState({
		name: user?.name || "",
		phone: user?.phone || "",
		specialization: user?.specialization || "",
		experience: user?.experience || "",
		medicalRegistrationNumber: user?.medicalRegistrationNumber || "",
		hospital: user?.hospital || "",
	});

	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		setMessage("");
		setError("");

		try {
			const data = await updateMyProfile(formData);
			updateUser(data.user);
			setMessage("Your profile has been updated.");
		} catch (err) {
			setError(
				err.response?.data?.message || "Failed to update profile.",
			);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="max-w-2xl">
			<h1 className="page-title">Settings</h1>
			<p className="page-subtitle">Manage your professional profile.</p>

			<form onSubmit={handleSubmit} className="card-pad mt-6 space-y-5">
				<div className="flex items-center gap-4 border-b border-ink-100 pb-5">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700">
						{(user?.name || "?").slice(0, 1).toUpperCase()}
					</div>
					<div>
						<p className="font-bold text-ink-900">
							Dr. {user?.name}
						</p>
						<p className="text-sm text-ink-500">{user?.email}</p>
					</div>
				</div>

				<div>
					<label className="field-label">
						<User size={12} className="mb-0.5 mr-1 inline" /> Full
						name
					</label>
					<input
						className="input"
						name="name"
						value={formData.name}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
					<div>
						<label className="field-label">
							<Phone size={12} className="mb-0.5 mr-1 inline" />{" "}
							Phone number
						</label>
						<input
							className="input"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
						/>
					</div>
					<div>
						<label className="field-label">
							<Stethoscope
								size={12}
								className="mb-0.5 mr-1 inline"
							/>{" "}
							Specialization
						</label>
						<input
							className="input"
							name="specialization"
							value={formData.specialization}
							onChange={handleChange}
							placeholder="e.g. Cardiology"
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
					<div>
						<label className="field-label">
							<Award size={12} className="mb-0.5 mr-1 inline" />{" "}
							Years of experience
						</label>
						<input
							type="number"
							min="0"
							className="input"
							name="experience"
							value={formData.experience}
							onChange={handleChange}
						/>
					</div>
					<div>
						<label className="field-label">
							<Building2
								size={12}
								className="mb-0.5 mr-1 inline"
							/>{" "}
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

				<div>
					<label className="field-label">
						Medical registration number
					</label>
					<input
						className="input"
						name="medicalRegistrationNumber"
						value={formData.medicalRegistrationNumber}
						onChange={handleChange}
					/>
				</div>

				<div>
					<label className="field-label">Email (read-only)</label>
					<input
						className="input bg-ink-50 text-ink-400"
						value={user?.email || ""}
						disabled
					/>
				</div>

				{message && (
					<div className="flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
						<CheckCircle2 size={16} /> {message}
					</div>
				)}
				{error && (
					<div className="rounded-xl bg-coral-50 px-4 py-3 text-sm font-medium text-coral-600">
						{error}
					</div>
				)}

				<button type="submit" className="btn-primary" disabled={saving}>
					<Save size={16} />
					{saving ? "Saving..." : "Save changes"}
				</button>
			</form>
		</div>
	);
};

export default DoctorSettings;
