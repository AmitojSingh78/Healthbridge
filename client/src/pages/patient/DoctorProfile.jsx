import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Stethoscope, Award, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { getDoctor } from "../../services/doctorService";
import { bookAppointment } from "../../services/appointmentService";
import Loader from "../../components/Loader";

const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const data = await getDoctor(id);
        setDoctor(data);
      } catch {
        setError("Unable to load doctor");
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setBooking(true);
    setError("");
    setMessage("");

    try {
      await bookAppointment({ doctor: id, date, time, reason });
      setMessage("Appointment booked successfully!");
      setTimeout(() => navigate("/patient/my-appointments"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to book appointment");
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <Loader label="Loading doctor..." />;
  if (!doctor) return <p className="text-ink-500">Doctor not found.</p>;

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-3xl">
      <Link to="/patient/appointments" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-800">
        <ArrowLeft size={15} /> Back to doctors
      </Link>

      <div className="card-pad flex flex-wrap items-start gap-5 border-peach-100/90">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-peach-50 text-peach-700 border border-peach-100">
          <Stethoscope size={28} />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-ink-900">Dr. {doctor.name}</h1>
          <p className="font-semibold text-peach-700">{doctor.specialization || "General Physician"}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-500">
            <span className="flex items-center gap-1.5">
              <Award size={14} className="text-ink-400" /> {doctor.experience || 0}+ years experience
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-ink-400" /> {doctor.hospital || "Hospital not specified"}
            </span>
          </div>
        </div>
      </div>

      <div className="card-pad mt-6 border-peach-100/90">
        <h2 className="section-title">Book an appointment</h2>

        {message && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-peach-50 px-4 py-3 text-sm font-medium text-peach-700">
            <CheckCircle2 size={16} /> {message}
          </div>
        )}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-coral-50 px-4 py-3 text-sm font-medium text-coral-600">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleBooking} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Date</label>
              <input
                type="date"
                className="input"
                min={minDate}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="field-label">Time</label>
              <select className="select" value={time} onChange={(e) => setTime(e.target.value)} required>
                <option value="">Select time</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="field-label">Reason for consultation</label>
            <textarea
              className="textarea"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe why you want to consult the doctor..."
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={booking}>
            {booking ? "Booking..." : "Confirm appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;
