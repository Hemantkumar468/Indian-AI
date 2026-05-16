const express = require('express');
const router = express.Router();
const {
  getChats,
  getChatById,
  createChat,
  addMessage,
  updateChat,
  deleteChat,
} = require('../controllers/chatController');

router.get('/', getChats);
router.get('/:id', getChatById);
router.post('/', createChat);
router.post('/:id/messages', addMessage);
router.put('/:id', updateChat);
router.delete('/:id', deleteChat);

module.exports = router;
