import API from "./api";

export const bookAppointment =
  async (appointmentData) => {

    const response =
      await API.post(
        "/appointments",
        appointmentData
      );

    return response.data;

  };

export const getPatientAppointments =
  async () => {

    const response =
      await API.get(
        "/appointments/patient"
      );

    return response.data;

  };


export const getDoctorAppointments =
  async () => {

    const response =
      await API.get(
        "/appointments/doctor"
      );

    return response.data;

  };

export const updateAppointmentStatus =
  async (
    appointmentId,
    status,
    doctorNotes
  ) => {

    const response =
      await API.patch(
        `/appointments/${appointmentId}/status`,
        {
          status,
          ...(doctorNotes !== undefined ? { doctorNotes } : {}),
        }
      );

    return response.data;

  };

export const cancelAppointment =
  async (
    appointmentId
  ) => {

    const response =
      await API.patch(
        `/appointments/${appointmentId}/cancel`
      );

    return response.data;

  };