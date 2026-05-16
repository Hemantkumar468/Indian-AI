import { useChat } from './hooks/useChat';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputBar from './components/InputBar';
import { HiOutlineMenu } from 'react-icons/hi';

export default function App() {
  const { activeChat, toggleSidebar } = useChat();

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <header className="main-header">
          <button className="toggle-sidebar-btn" onClick={toggleSidebar} id="toggle-sidebar">
            <HiOutlineMenu size={20} />
          </button>
          <span className="header-title">
            {activeChat?.title || 'IndianAI'}
          </span>
        </header>
        <ChatArea />
        <InputBar />
      </main>
    </div>
  );
}
