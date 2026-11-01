const axios = require("axios");

const DIET_PREFERENCES = new Set(["Vegetarian", "Vegan", "Eggetarian", "Non-vegetarian"]);

exports.generatePlan = async (req, res) => {
	const { name = "", age = null, goal, dietPreference, allergies = "", conditions = "", avoidFoods = "" } = req.body || {};
	if (typeof age === "number" && (!Number.isInteger(age) || age < 13 || age > 120)) {
		return res.status(400).json({ message: "This general meal planner is designed for people aged 13 and over." });
	}
	if (!DIET_PREFERENCES.has(dietPreference)) {
		return res.status(400).json({ message: "Please select a valid dietary preference." });
	}
	for (const [field, value, maxLength] of [
		["name", name, 80], ["goal", goal, 120], ["allergies", allergies, 500],
		["conditions", conditions, 500], ["avoidFoods", avoidFoods, 500],
	]) {
		if (typeof value !== "string" || value.length > maxLength) {
			return res.status(400).json({ message: `Invalid ${field} value.` });
		}
	}

	const apiKey = process.env.GROQ_API_KEY;
	if (!apiKey) return res.status(503).json({ message: "GROQ_API_KEY is not configured in server/.env." });

	const schema = {
		type: "object",
		properties: {
			days: {
				type: "array",
				items: {
					type: "object", additionalProperties: false,
					properties: { day: { type: "integer" }, breakfast: { type: "string" }, lunch: { type: "string" }, dinner: { type: "string" } },
					required: ["day", "breakfast", "lunch", "dinner"],
				},
			},
		},
		required: ["days"], additionalProperties: false,
	};
	const profile = { name: name || "not provided", age: age ?? "not provided", goal, dietPreference, allergies: allergies || "none listed", avoidFoods: avoidFoods || "none listed", conditions: conditions || "none listed" };
	try {
		const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
			model: process.env.GROQ_DIET_MODEL || "openai/gpt-oss-120b",
			temperature: 0.4,
			max_completion_tokens: 4000,
			response_format: { type: "json_schema", json_schema: { name: "weekly_diet_plan", strict: true, schema } },
			messages: [
				{ role: "system", content: "Create general meal ideas, not medical nutrition therapy. Respect the user's dietary pattern and all listed allergies and foods to avoid. Do not include those ingredients or obvious forms. If you cannot confidently pick a safe replacement, use: Choose a familiar option confirmed safe for your allergy, with a protein, grain and vegetables; check labels and cross-contact. Do not provide calorie targets, weight loss prescriptions, disease treatment, medication advice, or claims a meal is medically safe. Health notes are context only; do not infer a diagnosis. Return seven varied, practical days, numbered 1 through 7 in order, with concise breakfast, lunch, and dinner descriptions. No snacks." },
				{ role: "user", content: JSON.stringify(profile) },
			],
		}, { timeout: 90000, headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } });
		const content = response.data?.choices?.[0]?.message?.content;
		const plan = typeof content === "string" ? JSON.parse(content) : null;
		if (!plan || !Array.isArray(plan.days) || plan.days.length !== 7 || plan.days.some((day, index) => day.day !== index + 1 || !day.breakfast || !day.lunch || !day.dinner)) {
			throw new Error("Groq returned an incomplete meal plan");
		}
		return res.json({ ...plan, disclaimer: "General meal ideas only; not medical nutrition therapy. Check ingredients, labels, and cross-contact risks. Consult a qualified clinician or dietitian for health conditions or allergy-safe advice." });
	} catch (error) {
		console.error("Groq diet plan generation failed:", error.response?.status || error.message);
		const status = error.response?.status === 429 ? 429 : 502;
		return res.status(status).json({ message: status === 429 ? "Groq is busy right now. Please try again shortly." : "Groq could not generate a meal plan. Please try again." });
	}
};
