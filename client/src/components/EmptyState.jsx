import { Link } from "react-router-dom";

const EmptyState = ({
	icon: Icon,
	title,
	description,
	actionLabel,
	actionTo,
	onAction,
}) => {
	return (
		<div className="card-pad flex flex-col items-center justify-center gap-3 py-14 text-center animate-fadeIn">
			{Icon && (
				<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-peach-50 text-peach-700 border border-peach-100">
					<Icon size={26} />
				</div>
			)}
			<div>
				<h3 className="font-bold text-ink-800">{title}</h3>
				{description && (
					<p className="mt-1 max-w-sm text-sm text-ink-500">
						{description}
					</p>
				)}
			</div>
			{actionLabel &&
				(actionTo ? (
					<Link to={actionTo} className="btn-primary mt-2">
						{actionLabel}
					</Link>
				) : (
					<button onClick={onAction} className="btn-primary mt-2">
						{actionLabel}
					</button>
				))}
		</div>
	);
};

export default EmptyState;
