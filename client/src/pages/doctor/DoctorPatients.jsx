import { useEffect, useState } from "react";
import { Users, Mail, Phone, CalendarClock } from "lucide-react";
import { getMyPatients } from "../../services/doctorService";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyPatients();
        setPatients(data.patients || []);
      } catch {
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loader label="Loading your patients..." />;

  const filtered = patients.filter((p) =>
    p.patient?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="page-title">My Patients</h1>
      <p className="page-subtitle">Everyone who has booked an appointment with you.</p>

      <input
        className="input mt-5 max-w-sm"
        placeholder="Search patients by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState icon={Users} title="No patients yet" description="Once patients book appointments with you, they'll show up here." />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((entry) => (
            <div key={entry.patient._id} className="card-pad">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {entry.patient.name?.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-ink-900">{entry.patient.name}</p>
                  <p className="text-xs text-ink-400">{entry.completedVisits} completed visit(s)</p>
                </div>
              </div>

              <div className="mt-4 space-y-1.5 text-sm text-ink-600">
                <p className="flex items-center gap-2">
                  <Mail size={14} className="text-ink-400" /> {entry.patient.email}
                </p>
                {entry.patient.phone && (
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-ink-400" /> {entry.patient.phone}
                  </p>
                )}
                {entry.upcomingAppointment && (
                  <p className="flex items-center gap-2">
                    <CalendarClock size={14} className="text-ink-400" />
                    Next: {entry.upcomingAppointment.date} at {entry.upcomingAppointment.time}
                  </p>
                )}
              </div>

              <div className="mt-4 border-t border-ink-100 pt-3 text-xs text-ink-400">
                Total visits: <span className="font-semibold text-ink-600">{entry.totalVisits}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;
