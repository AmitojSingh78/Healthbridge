import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";
import PatientLayout from "./layouts/PatientLayout";
import DoctorLayout from "./layouts/DoctorLayout";

import PatientDashboard from "./pages/patient/PatientDashboard";
import Health from "./pages/patient/Health";
import AIAssistant from "./pages/patient/AIAssistant";
import Appointments from "./pages/patient/Appointments";
import MyAppointments from "./pages/patient/MyAppointments";
import DoctorProfile from "./pages/patient/DoctorProfile";
import Wellness from "./pages/patient/Wellness";
import LearningPath from "./pages/patient/LearningPath";
import Education from "./pages/patient/Education";
import Progress from "./pages/patient/Progress";
import Settings from "./pages/patient/Settings";
import MedicineFinder from "./pages/patient/MedicineFinder";

import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import DoctorSettings from "./pages/doctor/DoctorSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/health" element={<Health />} />
          <Route path="/patient/medicines" element={<MedicineFinder />} />
          <Route path="/patient/medicine-finder" element={<MedicineFinder />} />
          <Route path="/patient/ai-assistant" element={<AIAssistant />} />
          <Route path="/patient/appointments" element={<Appointments />} />
          <Route path="/patient/my-appointments" element={<MyAppointments />} />
          <Route path="/patient/doctor/:id" element={<DoctorProfile />} />
          <Route path="/patient/wellness" element={<Wellness />} />
          <Route path="/patient/learning" element={<LearningPath />} />
          <Route path="/patient/education" element={<Education />} />
          <Route path="/patient/progress" element={<Progress />} />
          <Route path="/patient/settings" element={<Settings />} />
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/patients" element={<DoctorPatients />} />
          <Route path="/doctor/settings" element={<DoctorSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
