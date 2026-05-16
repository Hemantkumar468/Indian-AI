import { useEffect, useRef, useState } from 'react';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineSearch } from 'react-icons/hi';
import { useChat } from '../hooks/useChat';
import gsap from 'gsap';

export default function Sidebar() {
  const { chats, activeChat, sidebarOpen, loadChats, selectChat, createNewChat, removeChat } = useChat();
  const [search, setSearch] = useState('');
  const sidebarRef = useRef(null);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    if (sidebarRef.current && sidebarOpen) {
      const items = sidebarRef.current.querySelectorAll('.chat-item');
      if (items.length > 0) {
        gsap.fromTo(items,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, stagger: 0.03, duration: 0.3, ease: 'power2.out' }
        );
      }
    }
  }, [chats, sidebarOpen]);

  const filtered = chats.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (e, id) => {
    e.stopPropagation();
    removeChat(id);
  };

  return (
    <aside ref={sidebarRef} className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={createNewChat} id="new-chat-btn">
          <HiOutlinePlus size={18} />
          New Chat
        </button>
      </div>

      <div className="sidebar-search">
        <div style={{ position: 'relative' }}>
          <HiOutlineSearch
            size={14}
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 30 }}
            id="search-chats"
          />
        </div>
      </div>

      <div className="chat-list">
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: 20 }}>
            {search ? 'No results found' : 'No chats yet'}
          </p>
        )}
        {filtered.map((chat) => (
          <div
            key={chat._id}
            className={`chat-item ${activeChat?._id === chat._id ? 'active' : ''}`}
            onClick={() => selectChat(chat._id)}
          >
            <span className="chat-item-title">{chat.title}</span>
            <button
              className="chat-item-delete"
              onClick={(e) => handleDelete(e, chat._id)}
              aria-label="Delete chat"
            >
              <HiOutlineTrash size={14} />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
