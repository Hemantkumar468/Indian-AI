const OpenAI = require('openai');
const Chat = require('../models/Chat');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  defaultHeaders: {
    "HTTP-Referer": "https://indian-ai-gules.vercel.app", // Site URL
    "X-Title": "IndianAI", // Site Name
  }
});

// @desc    Send text message and get AI response
// @route   POST /api/ai/chat
const chatWithAI = async (req, res) => {
  try {
    const { chatId, message } = req.body;

    if (!chatId || !message) {
      return res.status(400).json({ error: 'chatId and message are required' });
    }

    // Find the chat and get message history for context
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Add user message to chat
    chat.messages.push({ role: 'user', content: message, type: 'text' });

    // Auto-generate title from first user message
    if (chat.messages.length === 1) {
      chat.title = message.substring(0, 40) + (message.length > 40 ? '...' : '');
    }

    // Build message history for OpenAI (last 20 messages for context window)
    const contextMessages = chat.messages
      .filter(m => m.type === 'text')
      .slice(-20)
      .map(m => ({
        role: m.role,
        content: m.content,
      }));

    // Add system prompt
    const messages = [
      {
        role: 'system',
        content: 'You are IndianAI, an advanced and helpful AI assistant. Provide clear, accurate, and well-formatted responses. Use markdown formatting when appropriate.',
      },
      ...contextMessages,
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'meta-llama/llama-3-8b-instruct:free',
      messages,
      max_tokens: 4096,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    // Add AI response to chat
    chat.messages.push({ role: 'assistant', content: aiResponse, type: 'text' });
    await chat.save();

    res.json({
      message: aiResponse,
      chat,
    });
  } catch (error) {
    console.error('AI Chat Error:', error);

    if (error?.status === 429) {
      return res.status(429).json({ error: `Rate limit exceeded (OpenRouter): ${error.error?.message || error.message || 'Please wait and try again.'}` });
    }

    res.status(500).json({ error: error.message || 'Failed to get AI response' });
  }
};

// @desc    Generate an image from prompt
// @route   POST /api/ai/image
const generateImage = async (req, res) => {
  try {
    const { chatId, prompt } = req.body;

    if (!chatId || !prompt) {
      return res.status(400).json({ error: 'chatId and prompt are required' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Add user prompt to chat
    chat.messages.push({ role: 'user', content: prompt, type: 'image' });

    // Auto-generate title
    if (chat.messages.length === 1) {
      chat.title = `🎨 ${prompt.substring(0, 35)}...`;
    }

    // OpenRouter free models don't support DALL-E image generation.
    // Instead of failing, we return a mock response explaining this.
    const messageContent = "⚠️ **Image Generation Disabled**\n\nYou are currently using the free OpenRouter API (`openai/gpt-oss-120b:free`), which only supports text chat. Image generation requires a premium OpenAI API key with DALL-E 3 support.\n\nTo enable images, you can switch back to a paid OpenAI key in the future.";

    chat.messages.push({
      role: 'assistant',
      content: messageContent,
      type: 'text', // Fallback to text since we can't generate an image
    });
    
    await chat.save();

    res.json({
      message: messageContent,
      chat,
    });
  } catch (error) {
    console.error('Image Generation Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate image' });
  }
};

module.exports = { chatWithAI, generateImage };
