import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
} from "recharts";
import { Trophy, Flame, BookOpen, Activity, TrendingUp } from "lucide-react";
import { getPatientDashboard } from "../../services/dashboardService";
import { getLearningPath } from "../../services/learningService";
import StatCard from "../../components/StatCard";
import EmptyState from "../../components/EmptyState";
import Loader from "../../components/Loader";

const Progress = () => {
	const [dashboard, setDashboard] = useState(null);
	const [learningPath, setLearningPath] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const dash = await getPatientDashboard();
				setDashboard(dash);
			} catch {
				// no-op
			}
			try {
				const path = await getLearningPath();
				setLearningPath(path.learningPath);
			} catch {
				// no learning path yet
			}
			setLoading(false);
		})();
	}, []);

	if (loading) return <Loader label="Loading your progress..." />;

	const history = dashboard?.wellness?.history || [];
	const chartData = history.map((item) => ({
		date: new Date(item.createdAt).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		}),
		score: item.overallScore,
	}));

	const latestScore = dashboard?.wellness?.latest?.overallScore;

	return (
		<div>
			<h1 className="page-title">My Progress</h1>
			<p className="page-subtitle">
				Track how your wellness and learning journey evolves over time.
			</p>

			<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					icon={Activity}
					label="Wellness score"
					value={
						latestScore !== undefined ? `${latestScore}/100` : "—"
					}
					tone="peach"
				/>
				<StatCard
					icon={Trophy}
					label="Total points"
					value={learningPath?.points ?? 0}
					tone="amber"
				/>
				<StatCard
					icon={BookOpen}
					label="Lessons completed"
					value={learningPath?.completedLessons ?? 0}
					tone="brand"
				/>
				<StatCard
					icon={Flame}
					label="Learning streak"
					value={`${learningPath?.streak ?? 0} days`}
					tone="coral"
				/>
			</div>

			<div className="card-pad mt-6">
				<div className="mb-4 flex items-center gap-2">
					<TrendingUp size={18} className="text-peach-600" />
					<h2 className="section-title">Wellness score over time</h2>
				</div>

				{chartData.length > 1 ? (
					<div className="h-64 w-full">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={chartData}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#f7f0e6"
								/>
								<XAxis
									dataKey="date"
									tick={{ fontSize: 12, fill: "#a8937d" }}
								/>
								<YAxis
									domain={[0, 100]}
									tick={{ fontSize: 12, fill: "#a8937d" }}
								/>
								<Tooltip />
								<Line
									type="monotone"
									dataKey="score"
									stroke="#f2723c"
									strokeWidth={3}
									dot={{ r: 5, fill: "#f2723c" }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				) : (
					<EmptyState
						icon={Activity}
						title="Not enough data yet"
						description="Complete at least two wellness assessments to see your trend chart."
						actionLabel="Take a wellness assessment"
						actionTo="/patient/wellness"
					/>
				)}
			</div>

			{learningPath?.modules?.length > 0 && (
				<div className="card-pad mt-6">
					<h2 className="section-title mb-4">Module progress</h2>
					<div className="space-y-4">
						{learningPath.modules.map((module) => (
							<div key={module._id}>
								<div className="mb-1.5 flex items-center justify-between text-sm">
									<span className="font-medium text-ink-700">
										{module.title}
									</span>
									<span className="text-ink-400">
										{module.progress}%
									</span>
								</div>
								<div className="progress-track">
									<div
										className="progress-fill"
										style={{ width: `${module.progress}%` }}
									/>
								</div>
							</div>
						))}
					</div>
					<Link to="/patient/learning" className="btn-secondary mt-5">
						Continue learning
					</Link>
				</div>
			)}
		</div>
	);
};

export default Progress;
