import { useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import gsap from 'gsap';

export default function WelcomeScreen() {
  const { createNewChat, sendTextMessage, setMode } = useChat();
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      const logo = ref.current.querySelector('.welcome-logo');
      const subtitle = ref.current.querySelector('.welcome-subtitle');
      const cards = ref.current.querySelectorAll('.suggestion-card');

      if (logo) {
        gsap.fromTo(logo,
          { opacity: 0, y: -20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
        );
      }
      if (subtitle) {
        gsap.fromTo(subtitle,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: 'power2.out' }
        );
      }
      if (cards.length > 0) {
        gsap.fromTo(cards,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, delay: 0.3, ease: 'power2.out' }
        );
      }
    }
  }, []);

  const suggestions = [
    { icon: '💡', title: 'Explain a concept', desc: 'Break down complex topics simply', prompt: 'Explain quantum computing in simple terms' },
    { icon: '✍️', title: 'Help me write', desc: 'Essays, emails, stories & more', prompt: 'Write a professional email requesting a meeting' },
    { icon: '💻', title: 'Write code', desc: 'Any language, any framework', prompt: 'Write a React custom hook for debouncing' },
    { icon: '🎨', title: 'Generate an image', desc: 'Create stunning visuals with AI', prompt: 'A futuristic city at sunset with flying cars', isImage: true },
  ];

  const handleSuggestion = async (s) => {
    const chat = await createNewChat();
    if (!chat) return;
    if (s.isImage) {
      setMode('image');
    }
  };

  return (
    <div className="welcome-screen" ref={ref}>
      <h1 className="welcome-logo">IndianAI</h1>
      <p className="welcome-subtitle">Your ultra-advanced AI assistant</p>
      <div className="suggestion-grid">
        {suggestions.map((s, i) => (
          <div key={i} className="suggestion-card" onClick={() => handleSuggestion(s)}>
            <div className="suggestion-icon">{s.icon}</div>
            <div className="suggestion-title">{s.title}</div>
            <div className="suggestion-desc">{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
