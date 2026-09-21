import { HeartPulse } from "lucide-react";

const Loader = ({ label = "Loading..." }) => {
	return (
		<div className="flex h-full min-h-[50vh] w-full flex-col items-center justify-center gap-3 text-ink-500">
			<div className="relative flex h-12 w-12 items-center justify-center">
				<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-peach-300 opacity-40" />
				<span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-peach-500 to-brand-500 text-white shadow-md shadow-peach-500/25">
					<HeartPulse size={20} />
				</span>
			</div>
			<p className="text-sm font-semibold animate-pulseSoft text-ink-600">{label}</p>
		</div>
	);
};

export default Loader;
