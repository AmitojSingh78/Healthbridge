import API from "./api";

/**
 * Searches for a medicine using LangChain + DuckDuckGo on the backend.
 * @param {string} query - Medicine name or brand
 * @param {string} [country="India"] - Target country for pharmacy links
 */
export const searchMedicine = async (query, country = "India") => {
  const response = await API.post("/medicine/search", { query, country });
  return response.data;
};

/**
 * Fetches popular trending medicine suggestions.
 */
export const getMedicineSuggestions = async () => {
  const response = await API.get("/medicine/suggestions");
  return response.data;
};
