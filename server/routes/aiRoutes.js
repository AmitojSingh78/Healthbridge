const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const allowRoles =
  require("../middleware/roleMiddleware");

const {
  createConversation,
  sendMessage,
  getConversation,
} = require("../controllers/aiController");


router.post(
  "/conversation",
  protect,
  allowRoles("patient"),
  createConversation
);


router.post(
  "/conversation/:id/message",
  protect,
  allowRoles("patient"),
  sendMessage
);


router.get(
  "/conversation/:id",
  protect,
  allowRoles("patient"),
  getConversation
);


module.exports = router;