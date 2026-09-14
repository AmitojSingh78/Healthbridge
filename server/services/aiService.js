
const EMERGENCY_KEYWORDS = [
  "chest pain",
  "difficulty breathing",
  "can't breathe",
  "cannot breathe",
  "shortness of breath",
  "severe bleeding",
  "heavy bleeding",
  "unconscious",
  "unresponsive",
  "fainted",
  "faint",
  "stroke",
  "seizure",
  "suicidal",
  "kill myself",
  "overdose",
  "severe allergic",
  "anaphylaxis",
  "poisoned",
  "can't move",
  "numb on one side",
  "slurred speech",
];

const TOPIC_RESPONSES = [
  {
    keywords: ["headache", "head pain", "migraine"],
    response:
      "Headaches can come from dehydration, poor sleep, stress, eye strain, skipped meals, or other causes. I can help you organize the details for your doctor, but I can't diagnose the cause. How long have you had it, and how severe is it on a scale of 1 to 10?",
    redFlags: [],
  },
  {
    keywords: ["fever", "temperature", "chills"],
    response:
      "Fever is your body's response to many possible conditions, from infections to inflammation. Keep monitoring your temperature and any accompanying symptoms. How long have you had the fever, and what's the highest reading you've recorded?",
    redFlags: [],
  },
  {
    keywords: ["cough", "sore throat", "cold", "flu", "congestion"],
    response:
      "Cough and throat discomfort are common with colds, allergies, or minor infections, but can also point to other things. Is the cough dry or producing mucus, and how many days has it lasted?",
    redFlags: [],
  },
  {
    keywords: ["stomach", "abdominal", "nausea", "vomit", "diarrhea"],
    response:
      "Digestive symptoms can stem from diet, infection, stress, or other causes. Have you noticed any pattern with food, and how long has this been going on?",
    redFlags: [],
  },
  {
    keywords: ["rash", "itchy", "skin"],
    response:
      "Skin changes can relate to allergies, irritation, or infection. Where on your body is it, and did anything new touch your skin recently (new soap, food, medication)?",
    redFlags: [],
  },
  {
    keywords: ["anxious", "anxiety", "stressed", "stress", "panic"],
    response:
      "Thank you for sharing that — stress and anxiety are worth taking seriously. Can you tell me more about what's been triggering it, and how it's been affecting your daily life?",
    redFlags: [],
  },
  {
    keywords: ["sleep", "insomnia", "tired", "fatigue", "can't sleep"],
    response:
      "Sleep trouble and fatigue can affect nearly everything else in your health. Roughly how many hours are you sleeping, and has anything changed recently in your routine or stress levels?",
    redFlags: [],
  },
  {
    keywords: ["back pain", "joint pain", "muscle pain"],
    response:
      "Musculoskeletal pain has many possible causes, from posture to overuse to injury. When did it start, and does anything make it better or worse?",
    redFlags: [],
  },
];

const CLOSING_PROMPTS = [
  "Is there anything else about how you're feeling that you'd like to add?",
  "Would you like me to summarize this for your doctor?",
  "How long has this been going on, and has it been getting better, worse, or staying the same?",
];

const buildSystemPrompt = () => `You are the HealthBridge AI Health Assistant, embedded in a patient-facing wellness app.
Your role is strictly limited to:
1. Helping the patient describe and organize their symptoms/concerns clearly.
2. Offering general, non-diagnostic health education.
3. Encouraging booking a real appointment with a licensed doctor when appropriate.
You must NEVER provide a diagnosis, a prescription, or dosing instructions.
Always be warm, concise (2-4 sentences), and end with a clarifying question unless the situation is urgent.
If the patient describes anything that could be a medical emergency (chest pain, breathing difficulty, stroke symptoms, severe bleeding, suicidal ideation, loss of consciousness, etc.), tell them clearly to seek immediate/emergency medical care and stop asking routine follow-up questions.`;

const detectEmergency = (text) =>
  EMERGENCY_KEYWORDS.some((keyword) => text.includes(keyword));

const ruleBasedResponse = ({ message, conversation }) => {
  const text = message.toLowerCase();

  if (detectEmergency(text)) {
    return {
      response:
        "What you're describing may be a medical emergency. Please contact emergency services or go to the nearest emergency room right away rather than continuing this chat. If you are in the US, call 911; in India, call 112 or your local emergency number.",
      requiresDoctor: true,
      redFlags: ["Potential emergency symptom mentioned"],
    };
  }

  const topic = TOPIC_RESPONSES.find((entry) =>
    entry.keywords.some((keyword) => text.includes(keyword))
  );

  if (topic) {
    return {
      response: topic.response,
      requiresDoctor: false,
      redFlags: topic.redFlags,
    };
  }

  const turnCount = conversation?.filter((m) => m.role === "user").length || 0;

  if (turnCount >= 3) {
    return {
      response:
        "Thanks for the extra detail, this gives a clearer picture. Based on what you've shared, I'd recommend booking a consultation with one of our doctors so a professional can properly assess this. Would you like me to prepare a summary for that appointment?",
      requiresDoctor: true,
      redFlags: [],
    };
  }

  const prompt = CLOSING_PROMPTS[turnCount % CLOSING_PROMPTS.length];

  return {
    response: `I can help you organize your health concern and suggest next steps, though I can't diagnose conditions or replace a qualified healthcare professional. ${prompt}`,
    requiresDoctor: false,
    redFlags: [],
  };
};

const callAnthropic = async ({ message, conversation }) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  const history = (conversation || [])
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content }));

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system: buildSystemPrompt(),
      messages: [...history, { role: "user", content: message }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content
    ?.filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  const text_lower = text?.toLowerCase() || "";

  return {
    response: text || "I'm here to help — could you tell me a bit more about what you're experiencing?",
    requiresDoctor:
      detectEmergency((message || "").toLowerCase()) ||
      text_lower.includes("emergency") ||
      text_lower.includes("see a doctor") ||
      text_lower.includes("consult a doctor") ||
      text_lower.includes("book an appointment"),
    redFlags: detectEmergency((message || "").toLowerCase())
      ? ["Potential emergency symptom mentioned"]
      : [],
  };
};

const generateAIResponse = async ({ message, conversation, patientProfile }) => {
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      return await callAnthropic({ message, conversation, patientProfile });
    } catch (error) {
      console.error("Falling back to rule-based AI engine:", error.message);
    }
  }

  return ruleBasedResponse({ message, conversation, patientProfile });
};

module.exports = {
  generateAIResponse,
};
