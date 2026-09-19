import API from "./api";

export const getMyProfile = async () => {
	const response = await API.get("/users/profile");
	return response.data;
};

export const updateMyProfile = async (profileData) => {
	const response = await API.patch("/users/profile", profileData);
	return response.data;
};
