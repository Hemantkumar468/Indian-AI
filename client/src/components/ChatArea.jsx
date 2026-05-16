import { useEffect, useRef, useState } from 'react';
import { useChat } from '../hooks/useChat';
import MessageBubble from './MessageBubble';
import WelcomeScreen from './WelcomeScreen';
import ImagePreview from './ImagePreview';

export default function ChatArea() {
  const { messages, activeChat, isSending } = useChat();
  const bottomRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  if (!activeChat) {
    return <WelcomeScreen />;
  }

  return (
    <>
      <div className="chat-area">
        <div className="chat-messages">
          {messages.length === 0 && (
            <p style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: 14,
              padding: '60px 0',
            }}>
              Start a conversation...
            </p>
          )}
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              message={msg}
              onImageClick={(url) => setPreviewImage(url)}
            />
          ))}
          {isSending && (
            <div className="message assistant">
              <div className="message-avatar">N</div>
              <div className="message-body">
                <div className="message-content">
                  <div className="loading-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
      {previewImage && (
        <ImagePreview imageUrl={previewImage} onClose={() => setPreviewImage(null)} />
      )}
    </>
  );
}
