import API from "./api";

export const createConversation = async () => {
	const response = await API.post("/ai/conversation");

	return response.data;
};

export const sendAIMessage = async (conversationId, message) => {
	const response = await API.post(
		`/ai/conversation/${conversationId}/message`,

		{
			message,
		},
	);

	return response.data;
};

export const getConversation = async (conversationId) => {
	const response = await API.get(`/ai/conversation/${conversationId}`);

	return response.data;
};
