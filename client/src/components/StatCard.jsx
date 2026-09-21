const toneMap = {
	brand: "bg-brand-50 text-brand-700 border border-brand-200/60",
	peach: "bg-peach-50 text-peach-700 border border-peach-200/60",
	amber: "bg-amber-50 text-amber-700 border border-amber-200/60",
	coral: "bg-coral-50 text-coral-600 border border-coral-200/60",
	sky: "bg-sky-50 text-sky-700 border border-sky-200/60",
	slate: "bg-ink-100 text-ink-600 border border-ink-200/60",
};

const StatCard = ({ icon: Icon, label, value, hint, tone = "brand" }) => {
	return (
		<div className="card-pad flex items-start justify-between gap-3 animate-fadeIn">
			<div>
				<p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
					{label}
				</p>
				<p className="mt-1.5 text-2xl font-extrabold text-ink-900">
					{value}
				</p>
				{hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
			</div>
			{Icon && (
				<div
					className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${toneMap[tone] || toneMap.brand}`}
				>
					<Icon size={20} />
				</div>
			)}
		</div>
	);
};

export default StatCard;
