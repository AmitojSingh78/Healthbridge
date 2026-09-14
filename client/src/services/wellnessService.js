import API from "./api";


export const runAssessment =
  async () => {

    const response =
      await API.post(
        "/wellness/assessment"
      );

    return response.data;

  };


export const getLatestAssessment =
  async () => {

    const response =
      await API.get(
        "/wellness/assessment/latest"
      );

    return response.data;

  };