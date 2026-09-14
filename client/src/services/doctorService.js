import API from "./api";

export const getDoctors = async (params = {}) => {
  const response = await API.get("/doctors", { params });
  return response.data;
};

export const getDoctor = async (doctorId) => {
  const response = await API.get(`/doctors/${doctorId}`);
  return response.data;
};
export const getMyPatients = async () => {
  const response = await API.get("/doctors/me/patients");
  return response.data;
};

export const getMyStats = async () => {
  const response = await API.get("/doctors/me/stats");
  return response.data;
};
