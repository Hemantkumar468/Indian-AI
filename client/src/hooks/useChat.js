import { useCallback } from 'react';
import { useChatContext } from '../context/ChatContext';
import * as api from '../utils/api';

export function useChat() {
  const { state, dispatch, ACTIONS } = useChatContext();

  const loadChats = useCallback(async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const { data } = await api.fetchChats();
      dispatch({ type: ACTIONS.SET_CHATS, payload: data });
    } catch (err) {
      console.error('Failed to load chats:', err);
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, [dispatch, ACTIONS]);

  const selectChat = useCallback(async (chatId) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const { data } = await api.fetchChatById(chatId);
      dispatch({ type: ACTIONS.SET_ACTIVE_CHAT, payload: data });
      dispatch({ type: ACTIONS.SET_MESSAGES, payload: data.messages || [] });
    } catch (err) {
      console.error('Failed to load chat:', err);
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, [dispatch, ACTIONS]);

  const createNewChat = useCallback(async () => {
    try {
      const { data } = await api.createChat('New Chat');
      dispatch({ type: ACTIONS.ADD_CHAT, payload: data });
      dispatch({ type: ACTIONS.SET_ACTIVE_CHAT, payload: data });
      dispatch({ type: ACTIONS.SET_MESSAGES, payload: [] });
      return data;
    } catch (err) {
      console.error('Failed to create chat:', err);
    }
  }, [dispatch, ACTIONS]);

  const removeChat = useCallback(async (chatId) => {
    try {
      await api.deleteChat(chatId);
      dispatch({ type: ACTIONS.REMOVE_CHAT, payload: chatId });
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  }, [dispatch, ACTIONS]);

  const sendTextMessage = useCallback(async (message) => {
    if (!state.activeChat) return;
    try {
      dispatch({ type: ACTIONS.SET_SENDING, payload: true });
      dispatch({
        type: ACTIONS.ADD_MESSAGE,
        payload: { role: 'user', content: message, type: 'text' },
      });
      const { data } = await api.sendMessage(state.activeChat._id, message);
      dispatch({
        type: ACTIONS.ADD_MESSAGE,
        payload: { role: 'assistant', content: data.message, type: 'text' },
      });
      // Update chat list with new title
      loadChats();
    } catch (err) {
      dispatch({
        type: ACTIONS.ADD_MESSAGE,
        payload: { role: 'assistant', content: '❌ Error: ' + (err.response?.data?.error || err.message), type: 'text' },
      });
    } finally {
      dispatch({ type: ACTIONS.SET_SENDING, payload: false });
    }
  }, [state.activeChat, dispatch, ACTIONS, loadChats]);

  const sendImagePrompt = useCallback(async (prompt) => {
    if (!state.activeChat) return;
    try {
      dispatch({ type: ACTIONS.SET_SENDING, payload: true });
      dispatch({
        type: ACTIONS.ADD_MESSAGE,
        payload: { role: 'user', content: prompt, type: 'image' },
      });
      const { data } = await api.generateImage(state.activeChat._id, prompt);
      dispatch({
        type: ACTIONS.ADD_MESSAGE,
        payload: {
          role: 'assistant',
          content: `Image generated for: "${prompt}"`,
          type: 'image',
          imageUrl: data.imageUrl,
        },
      });
      loadChats();
    } catch (err) {
      dispatch({
        type: ACTIONS.ADD_MESSAGE,
        payload: { role: 'assistant', content: '❌ Error: ' + (err.response?.data?.error || err.message), type: 'text' },
      });
    } finally {
      dispatch({ type: ACTIONS.SET_SENDING, payload: false });
    }
  }, [state.activeChat, dispatch, ACTIONS, loadChats]);

  return {
    ...state,
    loadChats,
    selectChat,
    createNewChat,
    removeChat,
    sendTextMessage,
    sendImagePrompt,
    toggleSidebar: () => dispatch({ type: ACTIONS.TOGGLE_SIDEBAR }),
    setMode: (mode) => dispatch({ type: ACTIONS.SET_MODE, payload: mode }),
  };
}
