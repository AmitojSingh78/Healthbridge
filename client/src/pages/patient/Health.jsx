import { useEffect, useState } from "react";
import {
	HeartPulse,
	Salad,
	Brain,
	CheckCircle2,
	AlertCircle,
} from "lucide-react";
import {
	getHealthProfile,
	saveHealthProfile,
} from "../../services/healthService";
import Loader from "../../components/Loader";

const Field = ({ label, children }) => (
	<div>
		<label className="field-label">{label}</label>
		{children}
	</div>
);

const Select = (props) => <select className="select" {...props} />;
const NumberInput = (props) => (
	<input type="number" className="input" {...props} />
);

const Health = () => {
	const [formData, setFormData] = useState({
		height: "",
		weight: "",
		bloodGroup: "",
		exerciseFrequency: "",
		sleepHours: "",
		waterIntake: "",
		dietType: "",
		smoking: "",
		alcohol: "",
		stressLevel: "",
		mood: "",
	});

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		const loadProfile = async () => {
			try {
				const profile = await getHealthProfile();
				setFormData({
					height: profile.height || "",
					weight: profile.weight || "",
					bloodGroup: profile.bloodGroup || "",
					exerciseFrequency: profile.exerciseFrequency || "",
					sleepHours: profile.sleepHours || "",
					waterIntake: profile.waterIntake || "",
					dietType: profile.dietType || "",
					smoking: profile.smoking || "",
					alcohol: profile.alcohol || "",
					stressLevel: profile.stressLevel || "",
					mood: profile.mood || "",
				});
			} catch (err) {
				if (err.response?.status !== 404) {
					setError("Unable to load health profile");
				}
			} finally {
				setLoading(false);
			}
		};

		loadProfile();
	}, []);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		setMessage("");
		setError("");

		try {
			const data = await saveHealthProfile(formData);
			setMessage(
				`Profile saved successfully! Completion: ${data.profile.profileCompletion}%`,
			);
		} catch (err) {
			setError(err.response?.data?.message || "Failed to save profile");
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <Loader label="Loading health profile..." />;

	return (
		<div className="max-w-3xl">
			<h1 className="page-title">My Health Profile</h1>
			<p className="page-subtitle">
				This information helps us provide personalized wellness
				guidance.
			</p>

			{message && (
				<div className="mt-4 flex items-center gap-2 rounded-xl bg-peach-50 px-4 py-3 text-sm font-medium text-peach-700">
					<CheckCircle2 size={16} /> {message}
				</div>
			)}
			{error && (
				<div className="mt-4 flex items-center gap-2 rounded-xl bg-coral-50 px-4 py-3 text-sm font-medium text-coral-600">
					<AlertCircle size={16} /> {error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="mt-6 space-y-6">
				<section className="card-pad border-peach-100/90">
					<div className="mb-4 flex items-center gap-2">
						<HeartPulse size={18} className="text-peach-600" />
						<h2 className="section-title">
							Basic health information
						</h2>
					</div>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
						<Field label="Height (cm)">
							<NumberInput
								name="height"
								value={formData.height}
								onChange={handleChange}
								placeholder="e.g. 175"
							/>
						</Field>
						<Field label="Weight (kg)">
							<NumberInput
								name="weight"
								value={formData.weight}
								onChange={handleChange}
								placeholder="e.g. 70"
							/>
						</Field>
						<Field label="Blood group">
							<Select
								name="bloodGroup"
								value={formData.bloodGroup}
								onChange={handleChange}
							>
								<option value="">Select</option>
								{[
									"A+",
									"A-",
									"B+",
									"B-",
									"AB+",
									"AB-",
									"O+",
									"O-",
									"Unknown",
								].map((v) => (
									<option key={v}>{v}</option>
								))}
							</Select>
						</Field>
					</div>
				</section>

				<section className="card-pad border-peach-100/90">
					<div className="mb-4 flex items-center gap-2">
						<Salad size={18} className="text-peach-600" />
						<h2 className="section-title">Lifestyle</h2>
					</div>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<Field label="Exercise frequency">
							<Select
								name="exerciseFrequency"
								value={formData.exerciseFrequency}
								onChange={handleChange}
							>
								<option value="">Select</option>
								{[
									"Never",
									"1-2 days",
									"3-4 days",
									"5+ days",
								].map((v) => (
									<option key={v}>{v}</option>
								))}
							</Select>
						</Field>
						<Field label="Average sleep (hours)">
							<NumberInput
								step="0.5"
								name="sleepHours"
								value={formData.sleepHours}
								onChange={handleChange}
								placeholder="e.g. 7"
							/>
						</Field>
						<Field label="Water intake (litres/day)">
							<NumberInput
								step="0.1"
								name="waterIntake"
								value={formData.waterIntake}
								onChange={handleChange}
								placeholder="e.g. 2.5"
							/>
						</Field>
						<Field label="Diet">
							<Select
								name="dietType"
								value={formData.dietType}
								onChange={handleChange}
							>
								<option value="">Select</option>
								{[
									"Vegetarian",
									"Non-Vegetarian",
									"Vegan",
									"Other",
								].map((v) => (
									<option key={v}>{v}</option>
								))}
							</Select>
						</Field>
						<Field label="Smoking">
							<Select
								name="smoking"
								value={formData.smoking}
								onChange={handleChange}
							>
								<option value="">Select</option>
								{["Never", "Occasionally", "Regularly"].map(
									(v) => (
										<option key={v}>{v}</option>
									),
								)}
							</Select>
						</Field>
						<Field label="Alcohol">
							<Select
								name="alcohol"
								value={formData.alcohol}
								onChange={handleChange}
							>
								<option value="">Select</option>
								{["Never", "Occasionally", "Regularly"].map(
									(v) => (
										<option key={v}>{v}</option>
									),
								)}
							</Select>
						</Field>
					</div>
				</section>

				<section className="card-pad border-peach-100/90">
					<div className="mb-4 flex items-center gap-2">
						<Brain size={18} className="text-peach-600" />
						<h2 className="section-title">Well-being</h2>
					</div>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Field label="Stress level">
							<Select
								name="stressLevel"
								value={formData.stressLevel}
								onChange={handleChange}
							>
								<option value="">Select</option>
								{["Low", "Moderate", "High"].map((v) => (
									<option key={v}>{v}</option>
								))}
							</Select>
						</Field>
						<Field label="Current mood">
							<Select
								name="mood"
								value={formData.mood}
								onChange={handleChange}
							>
								<option value="">Select</option>
								{[
									"Excellent",
									"Good",
									"Okay",
									"Low",
									"Very Low",
								].map((v) => (
									<option key={v}>{v}</option>
								))}
							</Select>
						</Field>
					</div>
				</section>

				<button type="submit" className="btn-primary" disabled={saving}>
					{saving ? "Saving..." : "Save health profile"}
				</button>
			</form>
		</div>
	);
};

export default Health;
