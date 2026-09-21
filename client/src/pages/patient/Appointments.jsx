import { useEffect, useState } from "react";
import { Search, Stethoscope, MapPin, CalendarDays, Award } from "lucide-react";
import { getDoctors } from "../../services/doctorService";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const SPECIALIZATIONS = [
	"Cardiologist",
	"Dermatologist",
	"General Physician",
	"Neurologist",
	"Pediatrician",
	"Orthopedic",
];

const Appointments = () => {
	const [doctors, setDoctors] = useState([]);
	const [search, setSearch] = useState("");
	const [specialization, setSpecialization] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const loadDoctors = async () => {
		try {
			setLoading(true);
			const data = await getDoctors({ search, specialization });
			setDoctors(data.doctors);
		} catch {
			setError("Unable to load doctors");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadDoctors();
	}, []);

	const handleSearch = (e) => {
		e.preventDefault();
		loadDoctors();
	};

	return (
		<div>
			<h1 className="page-title">Find a Doctor</h1>
			<p className="page-subtitle">
				Find the right healthcare professional for your needs.
			</p>

			<form
				onSubmit={handleSearch}
				className="mt-5 flex flex-col gap-3 sm:flex-row"
			>
				<div className="relative flex-1">
					<Search
						size={16}
						className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
					/>
					<input
						className="input pl-10"
						placeholder="Search doctor, hospital..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				<select
					className="select sm:w-56"
					value={specialization}
					onChange={(e) => setSpecialization(e.target.value)}
				>
					<option value="">All specializations</option>
					{SPECIALIZATIONS.map((s) => (
						<option key={s}>{s}</option>
					))}
				</select>

				<button type="submit" className="btn-primary shrink-0">
					Search
				</button>
			</form>

			{error && (
				<div className="mt-4 rounded-xl bg-coral-50 px-4 py-3 text-sm font-medium text-coral-600">
					{error}
				</div>
			)}

			{loading ? (
				<div className="mt-8">
					<Loader label="Finding doctors..." />
				</div>
			) : doctors.length === 0 ? (
				<div className="mt-8">
					<EmptyState
						icon={Stethoscope}
						title="No doctors found"
						description="Try a different search term or specialization."
					/>
				</div>
			) : (
				<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{doctors.map((doctor) => (
						<div
							key={doctor._id}
							className="card-pad flex flex-col border-peach-100/90"
						>
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-peach-50 text-peach-700 border border-peach-100">
								<Stethoscope size={22} />
							</div>
							<h2 className="mt-3 font-bold text-ink-900">
								Dr. {doctor.name}
							</h2>
							<p className="text-sm font-semibold text-peach-700">
								{doctor.specialization || "General Physician"}
							</p>

							<div className="mt-3 space-y-1.5 text-sm text-ink-500">
								<p className="flex items-center gap-1.5">
									<Award size={14} className="text-ink-400" />
									{doctor.experience || 0}+ years experience
								</p>
								<p className="flex items-center gap-1.5">
									<MapPin
										size={14}
										className="text-ink-400"
									/>
									{doctor.hospital ||
										"Hospital not specified"}
								</p>
							</div>

							<Link
								to={`/patient/doctor/${doctor._id}`}
								className="btn-primary mt-4"
							>
								<CalendarDays size={16} /> View & book
							</Link>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Appointments;
