import {
  LayoutDashboard,
  HeartPulse,
  Bot,
  CalendarDays,
  BookOpen,
  Activity,
  Trophy,
  Settings,
} from "lucide-react";
import DashboardShell from "../components/DashboardShell";

const menuItems = [
  { name: "Dashboard", path: "/patient/dashboard", icon: LayoutDashboard, end: true },
  { name: "My Health", path: "/patient/health", icon: HeartPulse },
  { name: "AI Assistant", path: "/patient/ai-assistant", icon: Bot },
  { name: "Appointments", path: "/patient/appointments", icon: CalendarDays },
  { name: "My Bookings", path: "/patient/my-appointments", icon: CalendarDays },
  { name: "Wellness Check", path: "/patient/wellness", icon: Activity },
  { name: "Learning Path", path: "/patient/learning", icon: BookOpen },
  { name: "Education Hub", path: "/patient/education", icon: BookOpen },
  { name: "My Progress", path: "/patient/progress", icon: Trophy },
  { name: "Settings", path: "/patient/settings", icon: Settings },
];

const PatientLayout = () => <DashboardShell menuItems={menuItems} roleLabel="Patient Portal" />;

export default PatientLayout;
