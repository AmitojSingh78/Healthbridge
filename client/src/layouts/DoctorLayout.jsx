import { LayoutDashboard, CalendarDays, Users, Settings } from "lucide-react";
import DashboardShell from "../components/DashboardShell";

const menuItems = [
	{
		name: "Dashboard",
		path: "/doctor/dashboard",
		icon: LayoutDashboard,
		end: true,
	},
	{ name: "Appointments", path: "/doctor/appointments", icon: CalendarDays },
	{ name: "My Patients", path: "/doctor/patients", icon: Users },
	{ name: "Settings", path: "/doctor/settings", icon: Settings },
];

const DoctorLayout = () => (
	<DashboardShell menuItems={menuItems} roleLabel="Doctor Portal" />
);

export default DoctorLayout;
