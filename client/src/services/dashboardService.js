import API from "./api";


export const getPatientDashboard =
  async () => {

    const response =
      await API.get(
        "/dashboard/patient"
      );

    return response.data;

  };