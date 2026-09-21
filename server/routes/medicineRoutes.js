const express = require("express");
const router = express.Router();

const {
  searchMedicine,
  getSuggestions,
} = require("../controllers/medicineController");

// Public or authenticated endpoints for medicine search
router.post("/search", searchMedicine);
router.get("/suggestions", getSuggestions);

module.exports = router;
