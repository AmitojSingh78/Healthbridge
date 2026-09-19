import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	Activity,
	BookOpen,
	Star,
	CalendarDays,
	Bot,
	ClipboardList,
	Sparkles,
} from "lucide-react";
import { getPatientDashboard } from "../../services/dashboardService";
import StatCard from "../../components/StatCard";
import Loader from "../../components/Loader";

const PatientDashboard = () => {
	const [dashboard, setDashboard] = useState(null);
	const [loading, setLoading] = useState(true);

	const loadDashboard = async () => {
		try {
			const data = await getPatientDashboard();
			setDashboard(data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadDashboard();
	}, []);

	if (loading) return <Loader label="Loading your health dashboard..." />;
	if (!dashboard)
		return <p className="text-ink-500">Unable to load dashboard.</p>;

	const { patient } = dashboard;
	const wellness = dashboard.wellness;
	const learning = dashboard.learning.path;
	const latestScore = wellness.latest?.overallScore || 0;
	const learningProgress = learning?.overallProgress || 0;
	const points = learning?.points || 0;
	const appointments = dashboard.appointments || [];

	return (
		<div className="space-y-8">
			<div>
				<h1 className="page-title">
					Welcome back, {patient?.name || "Patient"} 👋
				</h1>
				<p className="page-subtitle">
					Your personal health and learning overview.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					icon={Activity}
					label="Wellness score"
					value={`${latestScore}/100`}
					tone="brand"
				/>
				<StatCard
					icon={BookOpen}
					label="Learning progress"
					value={`${learningProgress}%`}
					tone="sky"
				/>
				<StatCard
					icon={Star}
					label="Health points"
					value={points}
					tone="amber"
				/>
				<StatCard
					icon={CalendarDays}
					label="Upcoming appointments"
					value={appointments.length}
					tone="coral"
				/>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div className="card-pad">
					<div className="flex items-center justify-between">
						<h2 className="section-title">Wellness progress</h2>
						<Link
							to="/patient/wellness"
							className="text-xs font-semibold text-brand-600 hover:underline"
						>
							Details
						</Link>
					</div>

					{wellness.history?.length > 0 ? (
						<div className="mt-5 space-y-3.5">
							{wellness.history.slice(-5).map((assessment) => (
								<div
									key={assessment._id}
									className="flex items-center gap-3"
								>
									<span className="w-20 shrink-0 text-xs text-ink-400">
										{new Date(
											assessment.createdAt,
										).toLocaleDateString()}
									</span>
									<div className="progress-track flex-1">
										<div
											className="progress-fill"
											style={{
												width: `${assessment.overallScore}%`,
											}}
										/>
									</div>
									<span className="w-8 shrink-0 text-right text-sm font-bold text-ink-800">
										{assessment.overallScore}
									</span>
								</div>
							))}
						</div>
					) : (
						<p className="mt-5 text-sm text-ink-500">
							Complete your first wellness assessment to see your
							progress.
						</p>
					)}
				</div>

				<div className="card-pad">
					<h2 className="section-title">Learning journey</h2>

					{learning ? (
						<div className="mt-5">
							<div className="flex items-center justify-between text-sm">
								<span className="text-ink-500">
									Overall progress
								</span>
								<span className="font-bold text-ink-800">
									{learningProgress}%
								</span>
							</div>
							<div className="progress-track mt-2">
								<div
									className="progress-fill"
									style={{ width: `${learningProgress}%` }}
								/>
							</div>

							<div className="mt-5 grid grid-cols-2 gap-3">
								<div className="rounded-xl bg-ink-50 p-3.5">
									<p className="text-xs text-ink-400">
										Lessons completed
									</p>
									<p className="mt-1 text-xl font-extrabold text-ink-900">
										{learning.completedLessons || 0}
									</p>
								</div>
								<div className="rounded-xl bg-ink-50 p-3.5">
									<p className="text-xs text-ink-400">
										Points
									</p>
									<p className="mt-1 text-xl font-extrabold text-ink-900">
										⭐ {points}
									</p>
								</div>
							</div>

							<Link
								to="/patient/learning"
								className="mt-5 inline-block text-sm font-semibold text-brand-600 hover:underline"
							>
								Continue your learning →
							</Link>
						</div>
					) : (
						<div className="mt-5">
							<p className="text-sm text-ink-500">
								Your personalized learning path hasn't been
								generated yet.
							</p>
							<Link
								to="/patient/wellness"
								className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:underline"
							>
								Take wellness assessment →
							</Link>
						</div>
					)}
				</div>
			</div>

			<div className="card-pad">
				<div className="flex items-center justify-between">
					<h2 className="section-title">Upcoming appointments</h2>
					<Link
						to="/patient/appointments"
						className="text-xs font-semibold text-brand-600 hover:underline"
					>
						View all
					</Link>
				</div>

				{appointments.length > 0 ? (
					<div className="mt-4 space-y-3">
						{appointments.map((appointment) => (
							<div
								key={appointment._id}
								className="flex items-center justify-between rounded-xl bg-ink-50 p-4"
							>
								<div>
									<p className="font-semibold text-ink-800">
										Dr.{" "}
										{appointment.doctor?.name || "Doctor"}
									</p>
									<p className="text-sm text-ink-500">
										{appointment.doctor?.specialization ||
											"Healthcare Professional"}
									</p>
								</div>
								<div className="text-right">
									<p className="font-medium text-ink-800">
										{new Date(
											appointment.date,
										).toLocaleDateString()}
									</p>
									<p className="text-sm text-ink-500">
										{appointment.time}
									</p>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="mt-4 text-sm text-ink-500">
						No upcoming appointments.
					</p>
				)}
			</div>

			<div>
				<h2 className="section-title mb-4">Quick actions</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<Link
						to="/patient/ai-assistant"
						className="card-pad transition hover:-translate-y-1 hover:shadow-popover"
					>
						<Bot size={20} className="text-brand-600" />
						<h3 className="mt-3 font-bold text-ink-900">
							AI Health Assistant
						</h3>
						<p className="mt-1.5 text-sm text-ink-500">
							Discuss your health concerns and prepare information
							for a healthcare professional.
						</p>
					</Link>
					<Link
						to="/patient/wellness"
						className="card-pad transition hover:-translate-y-1 hover:shadow-popover"
					>
						<ClipboardList size={20} className="text-brand-600" />
						<h3 className="mt-3 font-bold text-ink-900">
							Wellness Assessment
						</h3>
						<p className="mt-1.5 text-sm text-ink-500">
							Check your current wellness profile.
						</p>
					</Link>
					<Link
						to="/patient/learning"
						className="card-pad transition hover:-translate-y-1 hover:shadow-popover"
					>
						<Sparkles size={20} className="text-brand-600" />
						<h3 className="mt-3 font-bold text-ink-900">
							Learning Path
						</h3>
						<p className="mt-1.5 text-sm text-ink-500">
							Continue your personalized health education.
						</p>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default PatientDashboard;
