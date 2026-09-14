import API from "./api";

export const getHealthProfile = async () => {

  const response = await API.get(
    "/health/profile"
  );

  return response.data;

};


export const saveHealthProfile = async (
  profileData
) => {

  const response = await API.post(
    "/health/profile",
    profileData
  );

  return response.data;

};