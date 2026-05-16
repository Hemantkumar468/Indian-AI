import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { HiOutlineClipboardCopy, HiCheck } from 'react-icons/hi';

export default function MessageBubble({ message, onImageClick }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`message ${message.role}`}>
      <div className="message-avatar">
        {isUser ? 'U' : 'N'}
      </div>
      <div className="message-body">
        <div className="message-content">
          {message.type === 'image' && message.imageUrl ? (
            <>
              <p style={{ marginBottom: 8, color: 'var(--text-secondary)', fontSize: 13 }}>
                {message.content}
              </p>
              <img
                src={message.imageUrl}
                alt="Generated"
                className="message-image"
                onClick={() => onImageClick(message.imageUrl)}
              />
            </>
          ) : (
            <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');
                  return match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        borderRadius: 8,
                        margin: '8px 0',
                        fontSize: 13,
                      }}
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontSize: 13,
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        {!isUser && (
          <div className="message-actions">
            <button className="message-action-btn" onClick={handleCopy}>
              {copied ? <HiCheck size={14} /> : <HiOutlineClipboardCopy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
