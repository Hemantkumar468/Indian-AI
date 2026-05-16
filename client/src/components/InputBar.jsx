import { useRef, useState } from 'react';
import { HiOutlinePaperAirplane } from 'react-icons/hi';
import { HiOutlineChatBubbleLeftRight, HiOutlinePhoto } from 'react-icons/hi2';
import { useChat } from '../hooks/useChat';

export default function InputBar() {
  const { mode, isSending, activeChat, sendTextMessage, sendImagePrompt, setMode, createNewChat } = useChat();
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    // Auto-create chat if none active
    let chat = activeChat;
    if (!chat) {
      chat = await createNewChat();
      if (!chat) return;
    }

    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    if (mode === 'image') {
      sendImagePrompt(trimmed);
    } else {
      sendTextMessage(trimmed);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
  };

  return (
    <div className="input-area">
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'image' ? 'Describe the image you want...' : 'Type your message...'}
            disabled={isSending}
            id="message-input"
          />
          <div className="input-controls">
            <div className="mode-toggle">
              <button
                className={`mode-btn ${mode === 'text' ? 'active' : ''}`}
                onClick={() => setMode('text')}
                title="Text mode"
              >
                <HiOutlineChatBubbleLeftRight size={14} />
                Text
              </button>
              <button
                className={`mode-btn ${mode === 'image' ? 'active' : ''}`}
                onClick={() => setMode('image')}
                title="Image mode"
              >
                <HiOutlinePhoto size={14} />
                Image
              </button>
            </div>
            <button
              className="send-btn"
              onClick={handleSubmit}
              disabled={!text.trim() || isSending}
              id="send-btn"
            >
              {isSending ? (
                <div className="loading-dots">
                  <span></span><span></span><span></span>
                </div>
              ) : (
                <HiOutlinePaperAirplane size={16} />
              )}
            </button>
          </div>
        </div>
        <p className="input-hint">
          {mode === 'image' ? '🎨 Image generation mode' : 'IndianAI — Created by Hemant Kushwaha'}
        </p>
      </div>
    </div>
  );
}
