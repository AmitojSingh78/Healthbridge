const AIConversation = require("../models/AIConversation");

const { generateAIResponse } = require("../services/aiService");

exports.createConversation = async (req, res) => {
  try {
    const conversation = await AIConversation.create({
      patient: req.user._id,

      messages: [],
    });

    res.status(201).json({
      conversation,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to create AI conversation",
    });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const conversation = await AIConversation.findOne({
      _id: req.params.id,

      patient: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    conversation.messages.push({
      role: "user",

      content: message.trim(),
    });

    const aiResult = await generateAIResponse({
      message,

      conversation: conversation.messages,
    });

    conversation.messages.push({
      role: "assistant",

      content: aiResult.response,
    });

    conversation.requiresDoctor = aiResult.requiresDoctor;

    conversation.redFlags = aiResult.redFlags;

    await conversation.save();

    res.json({
      response: aiResult.response,

      requiresDoctor: aiResult.requiresDoctor,

      redFlags: aiResult.redFlags,

      conversation,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "AI assistant failed",
    });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const conversation = await AIConversation.findOne({
      _id: req.params.id,

      patient: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    res.json({
      conversation,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to fetch conversation",
    });
  }
};
