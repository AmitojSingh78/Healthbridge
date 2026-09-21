import { useEffect, useState } from "react";
import {
	CalendarClock,
	Check,
	X,
	CheckCheck,
	StickyNote,
	Filter,
} from "lucide-react";
import {
	getDoctorAppointments,
	updateAppointmentStatus,
} from "../../services/appointmentService";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const TABS = [
	"all",
	"pending",
	"confirmed",
	"completed",
	"rejected",
	"cancelled",
];

const statusBadge = {
	pending: "badge-amber",
	confirmed: "badge-blue",
	completed: "badge-peach",
	rejected: "badge-red",
	cancelled: "badge-slate",
};

const DoctorAppointments = () => {
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [tab, setTab] = useState("all");
	const [busyId, setBusyId] = useState(null);
	const [noteDrafts, setNoteDrafts] = useState({});

	const load = async () => {
		try {
			const data = await getDoctorAppointments();
			setAppointments(data.appointments || []);
		} catch {
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
	}, []);

	const handleStatus = async (id, status) => {
		setBusyId(id);
		try {
			await updateAppointmentStatus(id, status, noteDrafts[id]);
			await load();
		} catch (err) {
			alert(
				err.response?.data?.message || "Failed to update appointment.",
			);
		} finally {
			setBusyId(null);
		}
	};

	if (loading) return <Loader label="Loading appointments..." />;

	const filtered =
		tab === "all"
			? appointments
			: appointments.filter((a) => a.status === tab);

	return (
		<div>
			<h1 className="page-title">Appointments</h1>
			<p className="page-subtitle">
				Review, accept, and manage your patient appointment requests.
			</p>

			<div className="mt-5 flex flex-wrap items-center gap-2">
				<Filter size={15} className="text-ink-400" />
				{TABS.map((t) => (
					<button
						key={t}
						onClick={() => setTab(t)}
						className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
							tab === t
								? "bg-ink-900 text-white"
								: "bg-white text-ink-600 border border-ink-200 hover:bg-peach-50/50 hover:border-peach-200"
						}`}
					>
						{t}
					</button>
				))}
			</div>

			{filtered.length === 0 ? (
				<div className="mt-6">
					<EmptyState
						icon={CalendarClock}
						title="No appointments here"
						description="Try a different filter."
					/>
				</div>
			) : (
				<div className="mt-6 space-y-4">
					{filtered.map((appt) => (
						<div key={appt._id} className="card-pad border-peach-100/90">
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div>
									<div className="flex items-center gap-2">
										<p className="font-bold text-ink-900">
											{appt.patient?.name}
										</p>
										<span
											className={
												statusBadge[appt.status] ||
												"badge-slate"
											}
										>
											{appt.status}
										</span>
									</div>
									<p className="mt-1 text-sm text-ink-500">
										{appt.date} at {appt.time}
									</p>
									<p className="mt-2 text-sm text-ink-700">
										<span className="font-semibold">
											Reason:{" "}
										</span>
										{appt.reason}
									</p>
									{appt.patientNotes && (
										<p className="mt-1 text-sm text-ink-500">
											<span className="font-semibold">
												Patient notes:{" "}
											</span>
											{appt.patientNotes}
										</p>
									)}
									<p className="mt-1 text-xs text-ink-400">
										Contact: {appt.patient?.email}{" "}
										{appt.patient?.phone
											? `• ${appt.patient.phone}`
											: ""}
									</p>
								</div>
							</div>

							{["pending", "confirmed"].includes(appt.status) && (
								<div className="mt-4 border-t border-ink-100 pt-4">
									<label className="field-label flex items-center gap-1">
										<StickyNote size={12} /> Doctor notes
										(optional)
									</label>
									<textarea
										className="textarea"
										rows={2}
										placeholder="Add clinical notes visible to the patient..."
										value={
											noteDrafts[appt._id] ??
											appt.doctorNotes ??
											""
										}
										onChange={(e) =>
											setNoteDrafts({
												...noteDrafts,
												[appt._id]: e.target.value,
											})
										}
									/>

									<div className="mt-3 flex flex-wrap gap-2">
										{appt.status === "pending" && (
											<>
												<button
													className="btn-primary btn-sm"
													disabled={
														busyId === appt._id
													}
													onClick={() =>
														handleStatus(
															appt._id,
															"confirmed",
														)
													}
												>
													<Check size={14} /> Accept
												</button>
												<button
													className="btn-danger btn-sm"
													disabled={
														busyId === appt._id
													}
													onClick={() =>
														handleStatus(
															appt._id,
															"rejected",
														)
													}
												>
													<X size={14} /> Decline
												</button>
											</>
										)}
										{appt.status === "confirmed" && (
											<button
												className="btn-secondary btn-sm"
												disabled={busyId === appt._id}
												onClick={() =>
													handleStatus(
														appt._id,
														"completed",
													)
												}
											>
												<CheckCheck size={14} /> Mark
												completed
											</button>
										)}
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default DoctorAppointments;
