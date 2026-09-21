import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock, XCircle, Stethoscope } from "lucide-react";
import {
	getPatientAppointments,
	cancelAppointment,
} from "../../services/appointmentService";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const statusBadge = {
	pending: "badge-amber",
	confirmed: "badge-blue",
	completed: "badge-peach",
	rejected: "badge-red",
	cancelled: "badge-slate",
};

const MyAppointments = () => {
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);

	const loadAppointments = async () => {
		try {
			const data = await getPatientAppointments();
			setAppointments(data.appointments);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadAppointments();
	}, []);

	const handleCancel = async (id) => {
		const confirmCancel = window.confirm("Cancel this appointment?");
		if (!confirmCancel) return;

		try {
			await cancelAppointment(id);
			loadAppointments();
		} catch (error) {
			alert(
				error.response?.data?.message || "Unable to cancel appointment",
			);
		}
	};

	if (loading) return <Loader label="Loading appointments..." />;

	return (
		<div>
			<h1 className="page-title">My Appointments</h1>
			<p className="page-subtitle">
				All your booked, past, and upcoming visits in one place.
			</p>

			{appointments.length === 0 ? (
				<div className="mt-6">
					<EmptyState
						icon={CalendarDays}
						title="You don't have any appointments yet"
						description="Browse our doctor directory and book your first visit."
						actionLabel="Find a doctor"
						actionTo="/patient/appointments"
					/>
				</div>
			) : (
				<div className="mt-6 space-y-4">
					{appointments.map((appointment) => (
						<div
							key={appointment._id}
							className="card-pad flex flex-wrap items-start justify-between gap-4 border-peach-100/90"
						>
							<div className="flex gap-3">
								<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-peach-50 text-peach-700 border border-peach-100">
									<Stethoscope size={20} />
								</div>
								<div>
									<div className="flex items-center gap-2">
										<h2 className="font-bold text-ink-900">
											Dr. {appointment.doctor?.name}
										</h2>
										<span
											className={
												statusBadge[
													appointment.status
												] || "badge-slate"
											}
										>
											{appointment.status}
										</span>
									</div>
									<p className="text-sm font-semibold text-peach-700">
										{appointment.doctor?.specialization}
									</p>
									<p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-500">
										<CalendarDays size={14} />{" "}
										{appointment.date}
										<Clock
											size={14}
											className="ml-2"
										/>{" "}
										{appointment.time}
									</p>
									<p className="mt-1 text-sm text-ink-600">
										<span className="font-semibold">
											Reason:{" "}
										</span>
										{appointment.reason}
									</p>
									{appointment.doctorNotes && (
										<p className="mt-1 text-sm text-ink-600">
											<span className="font-semibold">
												Doctor notes:{" "}
											</span>
											{appointment.doctorNotes}
										</p>
									)}
								</div>
							</div>

							{["pending", "confirmed"].includes(
								appointment.status,
							) && (
								<button
									onClick={() =>
										handleCancel(appointment._id)
									}
									className="btn-secondary btn-sm shrink-0"
								>
									<XCircle size={14} /> Cancel
								</button>
							)}
						</div>
					))}
				</div>
			)}

			<Link
				to="/patient/appointments"
				className="btn-primary mt-6 inline-flex"
			>
				Book another appointment
			</Link>
		</div>
	);
};

export default MyAppointments;
