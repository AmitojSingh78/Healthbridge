import API from "./api";


export const getHealthTimeline =
  async () => {

    const response =
      await API.get(
        "/timeline"
      );

    return response.data;

  };