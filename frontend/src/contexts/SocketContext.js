import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    if (token && user) {
      // Initialize socket connection
      socketRef.current = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
        auth: {
          token: token,
        },
        transports: ['websocket'],
      });

      const socket = socketRef.current;

      // Connection event handlers
      socket.on('connect', () => {
        console.log('✅ Connected to server');
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('❌ Disconnected from server');
        setIsConnected(false);
      });

      socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        toast.error('Connection failed. Please refresh the page.');
      });

      // User status events
      socket.on('user-online', (data) => {
        setOnlineUsers(prev => {
          const updated = prev.filter(u => u.userId !== data.userId);
          return [...updated, data];
        });
        toast.success(`${data.username} is now online`, { autoClose: 2000 });
      });

      socket.on('user-offline', (data) => {
        setOnlineUsers(prev => prev.filter(u => u.userId !== data.userId));
        setTypingUsers(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(conversationId => {
            updated[conversationId] = updated[conversationId].filter(
              u => u.userId !== data.userId
            );
          });
          return updated;
        });
      });

      // Typing events
      socket.on('user-typing', (data) => {
        setTypingUsers(prev => ({
          ...prev,
          [data.conversationId]: [
            ...(prev[data.conversationId] || []).filter(u => u.userId !== data.userId),
            data
          ]
        }));
      });

      socket.on('user-stop-typing', (data) => {
        setTypingUsers(prev => ({
          ...prev,
          [data.conversationId]: (prev[data.conversationId] || []).filter(
            u => u.userId !== data.userId
          )
        }));
      });

      // Error handling
      socket.on('error', (error) => {
        console.error('Socket error:', error);
        toast.error(error.message || 'An error occurred');
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [token, user]);

  // Socket utility functions
  const emit = (event, data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event, handler) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
  };

  const off = (event, handler) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler);
    }
  };

  // Message functions
  const sendMessage = (conversationId, content, type = 'text') => {
    emit('send-message', { conversationId, content, type });
  };

  const joinConversation = (conversationId) => {
    emit('join-conversation', { conversationId });
  };

  const leaveConversation = (conversationId) => {
    emit('leave-conversation', { conversationId });
  };

  const startTyping = (conversationId) => {
    emit('typing-start', { conversationId });
  };

  const stopTyping = (conversationId) => {
    emit('typing-stop', { conversationId });
  };

  const markAsRead = (messageId) => {
    emit('mark-read', { messageId });
  };

  const value = {
    socket: socketRef.current,
    isConnected,
    onlineUsers,
    typingUsers,
    emit,
    on,
    off,
    sendMessage,
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    markAsRead,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};