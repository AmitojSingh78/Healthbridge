import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	Activity,
	Sparkles,
	Salad,
	Dumbbell,
	Moon,
	Brain,
	ShieldAlert,
	ListChecks,
} from "lucide-react";
import {
	runAssessment,
	getLatestAssessment,
} from "../../services/wellnessService";
import { generateLearningPath } from "../../services/learningService";
import Loader from "../../components/Loader";

const CATEGORY_META = [
	{ key: "nutrition", label: "Nutrition", icon: Salad },
	{ key: "physicalActivity", label: "Physical Activity", icon: Dumbbell },
	{ key: "sleep", label: "Sleep", icon: Moon },
	{ key: "mentalWellbeing", label: "Mental Well-being", icon: Brain },
	{ key: "substanceRisk", label: "Health Risk Awareness", icon: ShieldAlert },
];

const scoreColor = (score) => {
	if (score >= 80) return "from-brand-400 to-brand-600";
	if (score >= 60) return "from-sky-400 to-sky-600";
	if (score >= 40) return "from-amber-400 to-amber-500";
	return "from-coral-400 to-coral-600";
};

const ScoreRing = ({ score }) => {
	const circumference = 2 * Math.PI * 54;
	const offset = circumference - (score / 100) * circumference;
	return (
		<div className="relative flex h-40 w-40 items-center justify-center">
			<svg viewBox="0 0 120 120" className="h-40 w-40 -rotate-90">
				<circle
					cx="60"
					cy="60"
					r="54"
					fill="none"
					stroke="#eceef2"
					strokeWidth="10"
				/>
				<circle
					cx="60"
					cy="60"
					r="54"
					fill="none"
					stroke="#1d7a63"
					strokeWidth="10"
					strokeLinecap="round"
					strokeDasharray={circumference}
					strokeDashoffset={offset}
				/>
			</svg>
			<div className="absolute flex flex-col items-center">
				<span className="text-3xl font-extrabold text-ink-900">
					{score}
				</span>
				<span className="text-xs text-ink-400">/ 100</span>
			</div>
		</div>
	);
};

const Wellness = () => {
	const [assessment, setAssessment] = useState(null);
	const [loading, setLoading] = useState(true);
	const [running, setRunning] = useState(false);
	const [message, setMessage] = useState("");

	const loadAssessment = async () => {
		try {
			const data = await getLatestAssessment();
			setAssessment(data.assessment);
		} catch {
			setAssessment(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadAssessment();
	}, []);

	const handleAssessment = async () => {
		try {
			setRunning(true);
			setMessage("");

			const data = await runAssessment();
			setAssessment(data.assessment);

			await generateLearningPath();

			setMessage(
				"Your personalized health learning path has been generated.",
			);
		} catch (err) {
			setMessage(
				err.response?.data?.message || "Unable to generate assessment.",
			);
		} finally {
			setRunning(false);
		}
	};

	if (loading) return <Loader label="Loading wellness dashboard..." />;

	return (
		<div>
			<h1 className="page-title">My Wellness</h1>
			<p className="page-subtitle">
				Understand your lifestyle and build healthier habits.
			</p>

			{!assessment && (
				<div className="card-pad mt-6 flex flex-col items-center gap-4 py-12 text-center">
					<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
						<Sparkles size={26} />
					</div>
					<div>
						<h2 className="section-title">
							Start your health assessment
						</h2>
						<p className="mx-auto mt-1.5 max-w-md text-sm text-ink-500">
							We'll analyze the information in your health profile
							and create a personalized wellness learning path.
						</p>
					</div>
					<button
						onClick={handleAssessment}
						className="btn-primary"
						disabled={running}
					>
						{running
							? "Analyzing..."
							: "Generate my wellness report"}
					</button>
					<Link
						to="/patient/health"
						className="text-xs font-semibold text-brand-600 hover:underline"
					>
						Haven't filled your health profile? Do that first.
					</Link>
				</div>
			)}

			{assessment && (
				<div className="mt-6 space-y-6">
					<div className="card-pad flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
							<ScoreRing score={assessment.overallScore} />
							<div className="text-center sm:text-left">
								<h2 className="section-title">
									Your wellness score
								</h2>
								<p className="mt-1 max-w-xs text-sm text-ink-500">
									A holistic snapshot across nutrition,
									activity, sleep, and mental well-being.
								</p>
							</div>
						</div>
						<button
							onClick={handleAssessment}
							className="btn-secondary shrink-0"
							disabled={running}
						>
							{running ? "Recalculating..." : "Recalculate score"}
						</button>
					</div>

					<div className="card-pad">
						<div className="mb-4 flex items-center gap-2">
							<Activity size={18} className="text-brand-600" />
							<h2 className="section-title">Health areas</h2>
						</div>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{CATEGORY_META.map(({ key, label, icon: Icon }) => {
								const score =
									assessment.categories?.[key]?.score ?? 0;
								return (
									<div
										key={key}
										className="rounded-xl border border-ink-100 p-4"
									>
										<div className="flex items-center justify-between">
											<span className="flex items-center gap-1.5 text-sm font-semibold text-ink-700">
												<Icon
													size={15}
													className="text-ink-400"
												/>{" "}
												{label}
											</span>
											<span className="text-sm font-bold text-ink-800">
												{score}
											</span>
										</div>
										<div className="progress-track mt-2">
											<div
												className={`h-full rounded-full bg-gradient-to-r ${scoreColor(score)}`}
												style={{ width: `${score}%` }}
											/>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						<div className="card-pad">
							<div className="mb-3 flex items-center gap-2">
								<ShieldAlert
									size={18}
									className="text-coral-500"
								/>
								<h2 className="section-title">
									Priority areas
								</h2>
							</div>
							{assessment.priorityAreas.length === 0 ? (
								<p className="text-sm text-ink-500">
									Great! No major priority areas identified
									from your current profile.
								</p>
							) : (
								<ul className="space-y-2">
									{assessment.priorityAreas.map((area) => (
										<li
											key={area}
											className="badge-red inline-flex capitalize"
										>
											{area}
										</li>
									))}
								</ul>
							)}
						</div>

						<div className="card-pad">
							<div className="mb-3 flex items-center gap-2">
								<ListChecks
									size={18}
									className="text-brand-600"
								/>
								<h2 className="section-title">
									Recommendations
								</h2>
							</div>
							<ul className="space-y-2.5">
								{assessment.recommendations.map(
									(recommendation, index) => (
										<li
											key={index}
											className="flex items-start gap-2 text-sm text-ink-600"
										>
											<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
											{recommendation}
										</li>
									),
								)}
							</ul>
						</div>
					</div>

					<Link to="/patient/learning" className="btn-primary">
						View my learning path
					</Link>
				</div>
			)}

			{message && (
				<div className="mt-4 rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
					{message}
				</div>
			)}
		</div>
	);
};

export default Wellness;
