import { useState } from "react";
import { AlertTriangle, Download, Leaf, LoaderCircle, ShieldCheck, Utensils } from "lucide-react";
import { generateDietPlan } from "../../services/dietPlannerService";
import { downloadDietPlanPdf, prepareDietPlan } from "../../utils/dietPlanner";

const initialForm = {
	name: "",
	age: "",
	goal: "Balanced everyday eating",
	dietPreference: "Vegetarian",
	allergies: "",
	conditions: "",
	avoidFoods: "",
};

const Field = ({ label, hint, children }) => (
	<div>
		<label className="field-label">{label}</label>
		{children}
		{hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
	</div>
);

export default function DietPlanner() {
	const [form, setForm] = useState(initialForm);
	const [plan, setPlan] = useState(null);
	const [error, setError] = useState("");
	const [generating, setGenerating] = useState(false);
	const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
	const submit = async (event) => {
		event.preventDefault();
		if (form.age && (Number(form.age) < 13 || Number(form.age) > 120)) {
			setError("This general meal planner is designed for people aged 13 and over. For a child, consult a pediatric clinician.");
			return;
		}
		setError("");
		setGenerating(true);
		try {
			const result = await generateDietPlan({ ...form, age: form.age ? Number(form.age) : null });
			setPlan(prepareDietPlan(result, form));
		} catch (requestError) {
			setError(requestError.response?.data?.message || "Groq could not create your meal plan. Check that the agent service and GROQ_API_KEY are configured, then try again.");
		} finally {
			setGenerating(false);
		}
	};

	return (
		<div className="max-w-6xl">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<div className="mb-2 inline-flex items-center gap-2 rounded-full border border-peach-100 bg-white px-3 py-1 text-xs font-semibold text-peach-700"><Leaf size={14} /> Everyday nutrition</div>
					<h1 className="page-title">Diet Planner</h1>
					<p className="page-subtitle max-w-2xl">Share a few food and lifestyle preferences to create a practical 7-day meal guide.</p>
				</div>
				<div className="flex items-center gap-2 rounded-xl border border-peach-100 bg-white px-3 py-2 text-xs text-ink-500"><ShieldCheck size={16} className="text-brand-600" /> Sent to Groq for generation; not saved as a profile</div>
			</div>

			<form onSubmit={submit} className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
				<section className="card-pad space-y-5">
					<div>
						<h2 className="section-title">Your food profile</h2>
						<p className="mt-1 text-sm text-ink-500">Only share details you are comfortable using for meal suggestions.</p>
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						<Field label="Name (optional)"><input className="input" name="name" value={form.name} onChange={change} placeholder="What should we call you?" /></Field>
						<Field label="Age (optional)" hint="For context only; no calorie targets are calculated."><input className="input" name="age" type="number" min="13" max="120" value={form.age} onChange={change} placeholder="e.g. 30" /></Field>
						<Field label="Your goal"><select className="select" name="goal" value={form.goal} onChange={change}>{["Balanced everyday eating", "More plant-based meals", "Support an active lifestyle", "Simpler home cooking"].map((item) => <option key={item}>{item}</option>)}</select></Field>
						<Field label="Diet preference"><select className="select" name="dietPreference" value={form.dietPreference} onChange={change}>{["Vegetarian", "Vegan", "Eggetarian", "Non-vegetarian"].map((item) => <option key={item}>{item}</option>)}</select></Field>
						<Field label="Foods you prefer to avoid" hint="Comma separate foods; matching meals are replaced in the plan."><input className="input" name="avoidFoods" value={form.avoidFoods} onChange={change} placeholder="e.g. mushrooms, spicy food" /></Field>
					</div>
					<Field label="Food allergies or intolerances" hint="List these so matching suggestions can be replaced with a cautious placeholder."><textarea className="textarea min-h-20" name="allergies" value={form.allergies} onChange={change} placeholder="e.g. peanuts, dairy" /></Field>
					<Field label="Health conditions (optional)" hint="This guide is not tailored treatment for a condition."><textarea className="textarea min-h-20" name="conditions" value={form.conditions} onChange={change} placeholder="e.g. diabetes, high blood pressure" /></Field>
					<button type="submit" disabled={generating} className="btn-primary w-full sm:w-auto">{generating ? <><LoaderCircle size={16} className="animate-spin" /> Creating with Groq...</> : <><Utensils size={16} /> Create my 7-day plan</>}</button>
				</section>

				<section className="space-y-5">
					{!plan ? <div className="card-pad flex min-h-72 flex-col items-center justify-center text-center">
						<div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-peach-100 bg-peach-50 text-peach-600"><Utensils size={25} /></div>
						<h2 className="mt-4 section-title">{generating ? "Building your meal plan" : "Your week, made simpler"}</h2>
						<p className="mt-2 max-w-sm text-sm leading-6 text-ink-500">{generating ? "Groq is creating seven days of meals from your preferences." : "Complete your food profile to generate a fresh plan with Groq, then download it as a PDF."}</p>
					</div> : <>
						<div className="card-pad flex flex-wrap items-center justify-between gap-3">
							<div><h2 className="section-title">{plan.name}'s weekly plan</h2><p className="mt-1 text-sm text-ink-500">{plan.goal} · {plan.preference}</p></div>
							<button type="button" onClick={() => downloadDietPlanPdf(plan)} className="btn-primary"><Download size={16} /> Download PDF</button>
						</div>
						{plan.allergies && <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><AlertTriangle size={18} className="mt-0.5 shrink-0" /><p><strong>Allergy reminder:</strong> Check every ingredient and cross-contact risk. This AI planner cannot verify that a food is safe for you; meals matching listed restrictions were replaced with a generic prompt.</p></div>}
						<div className="grid gap-3 sm:grid-cols-2">
							{plan.days.map(({ day, meals }) => <article key={day} className="card-pad !p-4">
								<div className="mb-3 flex items-center justify-between"><h3 className="font-bold text-ink-900">Day {day}</h3><span className="badge-peach">3 meals</span></div>
								<div className="space-y-3">{["Breakfast", "Lunch", "Dinner"].map((label, index) => <div key={label} className="border-t border-ink-100 pt-2.5 first:border-0 first:pt-0"><p className="text-[10px] font-bold uppercase tracking-wider text-peach-700">{label}</p><p className="mt-0.5 text-sm leading-5 text-ink-700">{meals[index]}</p></div>)}</div>
							</article>)}
						</div>
					</>}
					{error && <div role="alert" className="flex gap-2 rounded-xl bg-coral-50 p-3 text-sm text-coral-700"><AlertTriangle size={17} className="mt-0.5 shrink-0" />{error}</div>}
				</section>
			</form>
			<div className="mt-6 flex gap-3 rounded-2xl border border-ink-100 bg-white/70 p-4 text-xs leading-5 text-ink-500"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-ink-400" /><p>{plan?.disclaimer || "General meal ideas only, not medical nutrition therapy."} If you have a medical condition, are pregnant, have a history of disordered eating, or need allergy-safe meals, please consult a qualified clinician or dietitian. Portion sizes and nutrient needs vary by person.</p></div>
		</div>
	);
}
