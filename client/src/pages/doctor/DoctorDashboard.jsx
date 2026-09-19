import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	CalendarClock,
	Users,
	CheckCircle2,
	Clock3,
	Stethoscope,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getMyStats } from "../../services/doctorService";
import StatCard from "../../components/StatCard";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const statusBadge = {
	pending: "badge-amber",
	confirmed: "badge-blue",
	completed: "badge-green",
	rejected: "badge-red",
	cancelled: "badge-slate",
};

const DoctorDashboard = () => {
	const { user } = useAuth();
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const data = await getMyStats();
				setStats(data);
			} catch {}
			setLoading(false);
		})();
	}, []);

	if (loading) return <Loader label="Loading your dashboard..." />;

	return (
		<div>
			<div className="flex flex-col gap-1">
				<h1 className="page-title">
					Welcome back, Dr. {user?.name?.split(" ")[0]}
				</h1>
				<p className="page-subtitle">
					Here's what's happening with your patients today.
				</p>
			</div>

			<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					icon={CalendarClock}
					label="Total appointments"
					value={stats?.totalAppointments ?? 0}
					tone="brand"
				/>
				<StatCard
					icon={Clock3}
					label="Pending requests"
					value={stats?.pending ?? 0}
					tone="amber"
				/>
				<StatCard
					icon={CheckCircle2}
					label="Completed"
					value={stats?.completed ?? 0}
					tone="sky"
				/>
				<StatCard
					icon={Users}
					label="Unique patients"
					value={stats?.uniquePatients ?? 0}
					tone="coral"
				/>
			</div>

			<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div className="card-pad">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="section-title">Today's schedule</h2>
						<Link
							to="/doctor/appointments"
							className="text-xs font-semibold text-brand-600 hover:underline"
						>
							View all
						</Link>
					</div>

					{stats?.todaysAppointments?.length ? (
						<ul className="space-y-3">
							{stats.todaysAppointments.map((appt) => (
								<li
									key={appt._id}
									className="flex items-center justify-between rounded-xl border border-ink-100 px-4 py-3"
								>
									<div>
										<p className="text-sm font-semibold text-ink-800">
											{appt.patient?.name}
										</p>
										<p className="text-xs text-ink-400">
											{appt.time} • {appt.reason}
										</p>
									</div>
									<span
										className={
											statusBadge[appt.status] ||
											"badge-slate"
										}
									>
										{appt.status}
									</span>
								</li>
							))}
						</ul>
					) : (
						<EmptyState
							icon={Stethoscope}
							title="Nothing scheduled today"
							description="Enjoy the calm — check back once patients book new slots."
						/>
					)}
				</div>

				<div className="card-pad">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="section-title">Upcoming appointments</h2>
						<Link
							to="/doctor/appointments"
							className="text-xs font-semibold text-brand-600 hover:underline"
						>
							Manage
						</Link>
					</div>

					{stats?.upcomingAppointments?.length ? (
						<ul className="space-y-3">
							{stats.upcomingAppointments.map((appt) => (
								<li
									key={appt._id}
									className="flex items-center justify-between rounded-xl border border-ink-100 px-4 py-3"
								>
									<div>
										<p className="text-sm font-semibold text-ink-800">
											{appt.patient?.name}
										</p>
										<p className="text-xs text-ink-400">
											{appt.date} • {appt.time}
										</p>
									</div>
									<span
										className={
											statusBadge[appt.status] ||
											"badge-slate"
										}
									>
										{appt.status}
									</span>
								</li>
							))}
						</ul>
					) : (
						<EmptyState
							icon={CalendarClock}
							title="No upcoming appointments"
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default DoctorDashboard;
