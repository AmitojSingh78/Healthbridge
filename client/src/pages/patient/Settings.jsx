import { useState } from "react";
import {
	User,
	Phone,
	Calendar,
	Users as GenderIcon,
	Save,
	CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { updateMyProfile } from "../../services/userService";

const Settings = () => {
	const { user, updateUser } = useAuth();

	const [formData, setFormData] = useState({
		name: user?.name || "",
		phone: user?.phone || "",
		dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.substring(0, 10) : "",
		gender: user?.gender || "",
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
			<p className="page-subtitle">Manage your personal information.</p>

			<form onSubmit={handleSubmit} className="card-pad mt-6 space-y-5 border-peach-100/90">
				<div className="flex items-center gap-4 border-b border-ink-100 pb-5">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-peach-500 to-brand-500 text-xl font-bold text-white shadow-md shadow-peach-500/20">
						{(user?.name || "?").slice(0, 1).toUpperCase()}
					</div>
					<div>
						<p className="font-bold text-ink-900">{user?.name}</p>
						<p className="text-sm text-ink-500">{user?.email}</p>
						<span className="badge-slate mt-1 capitalize">
							{user?.role}
						</span>
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
							placeholder="+91 98765 43210"
						/>
					</div>

					<div>
						<label className="field-label">
							<Calendar
								size={12}
								className="mb-0.5 mr-1 inline"
							/>{" "}
							Date of birth
						</label>
						<input
							type="date"
							className="input"
							name="dateOfBirth"
							value={formData.dateOfBirth}
							onChange={handleChange}
						/>
					</div>
				</div>

				<div>
					<label className="field-label">
						<GenderIcon size={12} className="mb-0.5 mr-1 inline" />{" "}
						Gender
					</label>
					<select
						className="select"
						name="gender"
						value={formData.gender}
						onChange={handleChange}
					>
						<option value="">Prefer not to say</option>
						<option value="male">Male</option>
						<option value="female">Female</option>
						<option value="other">Other</option>
					</select>
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
					<div className="flex items-center gap-2 rounded-xl bg-peach-50 px-4 py-3 text-sm font-medium text-peach-700">
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

export default Settings;
