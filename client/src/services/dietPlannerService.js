import API from "./api";

export const generateDietPlan = async (profile) => {
	const response = await API.post("/diet-planner/generate", profile, { timeout: 100000 });
	return response.data;
};
