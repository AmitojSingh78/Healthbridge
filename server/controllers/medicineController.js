const axios = require("axios");

const AGENT_SERVICE_URL = process.env.AGENT_SERVICE_URL || "http://localhost:8000";

// Curated fallback suggestions
const DEFAULT_SUGGESTIONS = [
  { name: "Dolo 650", category: "Fever & Pain Relief", generic: "Paracetamol 650mg" },
  { name: "Augmentin 625 Duo", category: "Antibiotic", generic: "Amoxicillin + Clavulanic Acid" },
  { name: "Pantocid 40", category: "Acidity & GERD", generic: "Pantoprazole 40mg" },
  { name: "Allegra 120", category: "Allergy Relief", generic: "Fexofenadine 120mg" },
  { name: "Metformin 500 SR", category: "Diabetes Care", generic: "Metformin Hydrochloride" },
  { name: "Telmisartan 40", category: "Blood Pressure", generic: "Telmisartan 40mg" },
  { name: "Combiflam", category: "Pain & Inflammation", generic: "Ibuprofen + Paracetamol" },
  { name: "Azithral 500", category: "Antibiotic", generic: "Azithromycin 500mg" },
];

/**
 * Searches for medicine details, indications, warnings, substitutes,
 * and verified pharmacy purchase links via the Python LangChain agent service.
 */
exports.searchMedicine = async (req, res) => {
  try {
    const { query, country } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Medicine search query is required",
      });
    }

    try {
      const response = await axios.post(
        `${AGENT_SERVICE_URL}/medicine/search`,
        {
          query: query.trim(),
          country: country || "India",
        },
        { timeout: 35000 }
      );

      return res.status(200).json(response.data);
    } catch (agentError) {
      console.warn(
        `Agent service call failed (${agentError.message}). Generating intelligent fallback...`
      );

      // Graceful fallback if python service is offline or timeout
      const cleanQ = query.trim();
      const encodedQ = encodeURIComponent(cleanQ);

      const fallbackData = {
        query: cleanQ,
        medicine_name: cleanQ,
        generic_name: `${cleanQ} Pharmaceutical Formulation`,
        manufacturer: "Certified Pharmaceutical Manufacturers",
        category: "Therapeutic Healthcare Product",
        prescription_required: true,
        description: `${cleanQ} is a healthcare formulation commonly prescribed for symptomatic management. Please follow the instructions provided by your doctor or pharmacist.`,
        uses: [
          `Symptomatic management related to ${cleanQ}`,
          "Therapeutic treatment under medical supervision",
          "Relief of targeted health symptoms",
        ],
        dosage_forms: ["Oral Tablet", "Capsule", "Suspension"],
        warnings: [
          "Prescription is required for scheduled medications.",
          "Do not exceed the recommended dosage without physician approval.",
          "Keep away from sunlight and out of reach of children.",
        ],
        side_effects: [
          "Mild stomach upset or nausea",
          "Dizziness or drowsiness",
          "Dry mouth",
        ],
        substitutes: [
          {
            name: `Generic ${cleanQ}`,
            composition: `${cleanQ} formulation`,
            manufacturer: "Generic Pharma",
            price_comparison: "Cost-effective alternative",
          },
        ],
        buy_links: [
          {
            title: `Buy ${cleanQ} online on Tata 1mg`,
            url: `https://www.1mg.com/search/all?name=${encodedQ}`,
            source: "Tata 1mg",
            badge: "Verified Pharmacy",
            icon: "💊",
            type: "pharmacy",
            snippet: "Search verified stock and discounts on Tata 1mg",
            price_estimate: "Check Live Price",
          },
          {
            title: `Order ${cleanQ} on Apollo Pharmacy`,
            url: `https://www.apollopharmacy.in/search-medicines/${encodedQ}`,
            source: "Apollo Pharmacy",
            badge: "24/7 Delivery",
            icon: "🏥",
            type: "pharmacy",
            snippet: "Doorstep delivery from Apollo Pharmacy network",
            price_estimate: "Check Live Price",
          },
          {
            title: `Buy ${cleanQ} on Netmeds`,
            url: `https://www.netmeds.com/catalogsearch/result/${encodedQ}/all`,
            source: "Netmeds",
            badge: "Trusted Online Pharmacy",
            icon: "📦",
            type: "pharmacy",
            snippet: "Browse genuine medicine stock on Netmeds India",
            price_estimate: "Check Live Price",
          },
          {
            title: `Order ${cleanQ} on PharmEasy`,
            url: `https://pharmeasy.in/search/all?name=${encodedQ}`,
            source: "PharmEasy",
            badge: "Fast Delivery",
            icon: "⚡",
            type: "pharmacy",
            snippet: "Flat discount and quick delivery on PharmEasy",
            price_estimate: "Check Live Price",
          },
        ],
        info_links: [
          {
            title: `${cleanQ} Drug Overview - Drugs.com`,
            url: `https://www.drugs.com/search.php?searchterm=${encodedQ}`,
            source: "Drugs.com",
            badge: "Clinical Drug Guide",
            icon: "📚",
            type: "medical_info",
            snippet: "Complete drug guide, interactions, and pharmacology.",
          },
        ],
        disclaimer:
          "HealthBridge Medical Disclaimer: The information and pharmacy links provided are for educational and convenience purposes only. Prescription medicines require a valid doctor's prescription.",
      };

      return res.status(200).json({
        success: true,
        data: fallbackData,
        source: "fallback",
      });
    }
  } catch (error) {
    console.error("Medicine search controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during medicine search",
      error: error.message,
    });
  }
};

/**
 * Returns list of popular / trending medicine suggestions
 */
exports.getSuggestions = async (req, res) => {
  try {
    try {
      const response = await axios.get(
        `${AGENT_SERVICE_URL}/medicine/suggestions`,
        { timeout: 3000 }
      );
      return res.status(200).json(response.data);
    } catch {
      return res.status(200).json({
        success: true,
        suggestions: DEFAULT_SUGGESTIONS,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to load suggestions",
    });
  }
};
