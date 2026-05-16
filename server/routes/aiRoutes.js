const express = require('express');
const router = express.Router();
const { chatWithAI, generateImage } = require('../controllers/aiController');

router.post('/chat', chatWithAI);
router.post('/image', generateImage);

module.exports = router;
