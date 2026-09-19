import API from "./api";

export const getLibrary = async () => {
	const response = await API.get("/learning/library");

	return response.data;
};

export const generateLearningPath = async () => {
	const response = await API.post("/learning/generate");

	return response.data;
};

export const getLearningPath = async () => {
	const response = await API.get("/learning");

	return response.data;
};

export const updateModuleProgress = async (pathId, moduleId, progress) => {
	const response = await API.patch(
		`/learning/${pathId}/module/${moduleId}`,

		{
			progress,
		},
	);

	return response.data;
};
export const submitQuiz = async (pathId, moduleId, lessonId, answers) => {
	const response = await API.post(
		`/learning/${pathId}/module/${moduleId}/lesson/${lessonId}/quiz`,

		{
			answers,
		},
	);

	return response.data;
};
