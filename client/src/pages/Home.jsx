import { Link } from "react-router-dom";
import {
	HeartPulse,
	Bot,
	CalendarDays,
	BookOpen,
	Activity,
	ShieldCheck,
	ArrowRight,
} from "lucide-react";

const features = [
	{
		icon: Bot,
		title: "AI Health Assistant",
		description:
			"Describe your symptoms and get organized, non-diagnostic guidance in seconds.",
	},
	{
		icon: Activity,
		title: "Wellness Assessments",
		description:
			"A holistic score across nutrition, sleep, activity, and mental well-being.",
	},
	{
		icon: BookOpen,
		title: "Personalized Learning",
		description:
			"Bite-sized lessons and quizzes tailored to your weaker wellness areas.",
	},
	{
		icon: CalendarDays,
		title: "Doctor Appointments",
		description:
			"Browse real doctors by specialization and book a slot in a few clicks.",
	},
];

const Home = () => {
	return (
		<div className="min-h-screen bg-ink-50">
			<header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
				<div className="flex items-center gap-2.5">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-900/20">
						<HeartPulse size={20} />
					</div>
					<span className="text-lg font-extrabold tracking-tight text-ink-900">
						HealthBridge
					</span>
				</div>
				<div className="flex items-center gap-2">
					<Link to="/login" className="btn-ghost">
						Log in
					</Link>
					<Link to="/register" className="btn-primary">
						Get started
					</Link>
				</div>
			</header>

			<section className="mx-auto max-w-5xl px-6 pb-16 pt-10 text-center md:pt-20">
				<span className="badge-green mx-auto inline-flex">
					<ShieldCheck size={13} /> AI-assisted, human-verified care
				</span>
				<h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-ink-900 md:text-6xl">
					Preventive healthcare,
					<br />
					<span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
						personalized for you
					</span>
				</h1>
				<p className="mx-auto mt-5 max-w-2xl text-base text-ink-500 md:text-lg">
					HealthBridge combines an AI health assistant, wellness
					scoring, and real doctor appointments so you can understand
					your health and act on it — before small issues become big
					ones.
				</p>
				<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
					<Link
						to="/register"
						className="btn-primary px-6 py-3 text-base"
					>
						Create your free account <ArrowRight size={17} />
					</Link>
					<Link
						to="/login"
						className="btn-secondary px-6 py-3 text-base"
					>
						I already have an account
					</Link>
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-6 pb-24">
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
					{features.map((feature) => {
						const Icon = feature.icon;
						return (
							<div
								key={feature.title}
								className="card-pad text-left transition hover:-translate-y-1 hover:shadow-popover"
							>
								<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
									<Icon size={20} />
								</div>
								<h3 className="mt-4 font-bold text-ink-900">
									{feature.title}
								</h3>
								<p className="mt-1.5 text-sm text-ink-500">
									{feature.description}
								</p>
							</div>
						);
					})}
				</div>
			</section>

			<section className="border-t border-ink-100 bg-white py-8">
				<p className="text-center text-xs text-ink-400">
					HealthBridge is an educational tool and does not replace
					professional medical advice, diagnosis, or treatment. Always
					consult a qualified doctor for medical concerns.
				</p>
			</section>
		</div>
	);
};

export default Home;
