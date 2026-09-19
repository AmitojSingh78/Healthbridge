import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { HeartPulse, LogOut, Menu, X, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const DashboardShell = ({ menuItems, roleLabel }) => {
	const { user, logout } = useAuth();
	const [mobileOpen, setMobileOpen] = useState(false);

	const initials = (user?.name || "?")
		.split(" ")
		.map((p) => p[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	const SidebarContent = (
		<div className="flex h-full flex-col bg-ink-950 text-white">
			<div className="flex items-center gap-3 px-5 pt-6 pb-5">
				<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 shadow-lg shadow-brand-900/40">
					<HeartPulse size={20} />
				</div>
				<div>
					<p className="text-base font-extrabold leading-none tracking-tight">
						HealthBridge
					</p>
					<p className="mt-1 text-[11px] font-medium uppercase tracking-widest text-ink-400">
						{roleLabel}
					</p>
				</div>
			</div>

			<nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
				{menuItems.map((item) => {
					const Icon = item.icon;
					return (
						<NavLink
							key={item.path}
							to={item.path}
							end={item.end}
							onClick={() => setMobileOpen(false)}
							className={({ isActive }) =>
								isActive ? "nav-link-active" : "nav-link"
							}
						>
							<Icon size={18} />
							<span>{item.name}</span>
						</NavLink>
					);
				})}
			</nav>

			<div className="border-t border-white/10 p-3">
				<div className="flex items-center gap-3 rounded-xl px-2 py-2">
					<div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-xs font-bold">
						{initials}
					</div>
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-semibold">
							{user?.name}
						</p>
						<p className="truncate text-xs text-ink-400">
							{user?.email}
						</p>
					</div>
				</div>
				<button
					onClick={logout}
					className="nav-link mt-1 w-full text-coral-400 hover:bg-coral-500/10 hover:text-coral-300"
				>
					<LogOut size={18} />
					<span>Log out</span>
				</button>
			</div>
		</div>
	);

	return (
		<div className="flex min-h-screen w-full bg-ink-50">
			<aside className="hidden w-64 shrink-0 lg:block">
				<div className="fixed h-screen w-64">{SidebarContent}</div>
			</aside>

			{mobileOpen && (
				<div className="fixed inset-0 z-40 lg:hidden">
					<div
						className="absolute inset-0 bg-black/40"
						onClick={() => setMobileOpen(false)}
					/>
					<div className="absolute inset-y-0 left-0 w-72">
						{SidebarContent}
					</div>
				</div>
			)}

			<div className="flex min-h-screen flex-1 flex-col">
				<header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-100 bg-white/80 px-4 py-3 backdrop-blur lg:px-8">
					<button
						className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 lg:hidden"
						onClick={() => setMobileOpen(true)}
					>
						<Menu size={20} />
					</button>
					<div className="hidden lg:block">
						<p className="text-sm text-ink-400">
							Welcome back,{" "}
							<span className="font-semibold text-ink-700">
								{user?.name?.split(" ")[0]}
							</span>
						</p>
					</div>
					<div className="flex items-center gap-3">
						<button className="relative rounded-lg p-2 text-ink-500 hover:bg-ink-100">
							<Bell size={19} />
							<span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-coral-500" />
						</button>
						<div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 lg:hidden">
							{initials}
						</div>
					</div>
				</header>

				{mobileOpen && (
					<button
						className="fixed right-4 top-4 z-50 rounded-full bg-white p-2 text-ink-700 shadow-lg lg:hidden"
						onClick={() => setMobileOpen(false)}
					>
						<X size={18} />
					</button>
				)}

				<main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
					<div className="mx-auto w-full max-w-7xl animate-fadeIn">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
};

export default DashboardShell;
