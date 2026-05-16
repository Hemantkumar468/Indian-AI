const Chat = require('../models/Chat');

// @desc    Get all chats (metadata only, no messages)
// @route   GET /api/chats
const getChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single chat with all messages
// @route   GET /api/chats/:id
const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create a new chat
// @route   POST /api/chats
const createChat = async (req, res) => {
  try {
    const chat = await Chat.create({
      title: req.body.title || 'New Chat',
      messages: [],
    });
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Add a message to a chat
// @route   POST /api/chats/:id/messages
const addMessage = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const { role, content, type, imageUrl } = req.body;
    chat.messages.push({ role, content, type: type || 'text', imageUrl });

    // Auto-generate title from first user message
    if (chat.messages.length === 1 && role === 'user') {
      chat.title = content.substring(0, 40) + (content.length > 40 ? '...' : '');
    }

    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update chat title
// @route   PUT /api/chats/:id
const updateChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true }
    );
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a chat
// @route   DELETE /api/chats/:id
const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndDelete(req.params.id);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getChats,
  getChatById,
  createChat,
  addMessage,
  updateChat,
  deleteChat,
};
