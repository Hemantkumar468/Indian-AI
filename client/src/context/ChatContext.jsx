import { createContext, useContext, useReducer } from 'react';

const ChatContext = createContext(null);

const initialState = {
  chats: [],
  activeChat: null,
  messages: [],
  isLoading: false,
  isSending: false,
  sidebarOpen: true,
  mode: 'text',
};

const ACTIONS = {
  SET_CHATS: 'SET_CHATS',
  SET_ACTIVE_CHAT: 'SET_ACTIVE_CHAT',
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  ADD_CHAT: 'ADD_CHAT',
  REMOVE_CHAT: 'REMOVE_CHAT',
  SET_LOADING: 'SET_LOADING',
  SET_SENDING: 'SET_SENDING',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_MODE: 'SET_MODE',
};

function chatReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_CHATS:
      return { ...state, chats: action.payload };
    case ACTIONS.SET_ACTIVE_CHAT:
      return { ...state, activeChat: action.payload };
    case ACTIONS.SET_MESSAGES:
      return { ...state, messages: action.payload };
    case ACTIONS.ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    case ACTIONS.ADD_CHAT:
      return { ...state, chats: [action.payload, ...state.chats] };
    case ACTIONS.REMOVE_CHAT:
      return {
        ...state,
        chats: state.chats.filter((c) => c._id !== action.payload),
        activeChat: state.activeChat?._id === action.payload ? null : state.activeChat,
        messages: state.activeChat?._id === action.payload ? [] : state.messages,
      };
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTIONS.SET_SENDING:
      return { ...state, isSending: action.payload };
    case ACTIONS.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case ACTIONS.SET_MODE:
      return { ...state, mode: action.payload };
    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  return (
    <ChatContext.Provider value={{ state, dispatch, ACTIONS }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChatContext must be used within ChatProvider');
  return context;
}

export { ACTIONS };
