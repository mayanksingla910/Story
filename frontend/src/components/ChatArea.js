import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import {
  MoreVert,
  Circle,
  Phone,
  VideoCall,
} from '@mui/icons-material';
import moment from 'moment';

import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { chatService } from '../services/chatService';

import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

const ChatArea = ({ conversation, onConversationUpdate }) => {
  const { user } = useAuth();
  const { 
    joinConversation, 
    leaveConversation, 
    sendMessage, 
    on, 
    off, 
    onlineUsers, 
    typingUsers 
  } = useSocket();
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Get the other participant
  const otherUser = conversation?.participants?.find(p => p._id !== user._id);
  const isOnline = onlineUsers.some(u => u.userId === otherUser?._id);
  const typingInThisConversation = typingUsers[conversation?._id] || [];

  // Load messages when conversation changes
  useEffect(() => {
    if (!conversation?._id) return;

    const loadMessages = async () => {
      try {
        setLoading(true);
        const response = await chatService.getMessages(conversation._id);
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
    
    // Join conversation room
    joinConversation(conversation._id);

    // Cleanup on unmount or conversation change
    return () => {
      if (conversation._id) {
        leaveConversation(conversation._id);
      }
    };
  }, [conversation?._id, joinConversation, leaveConversation]);

  // Socket event handlers
  useEffect(() => {
    const handleNewMessage = (message) => {
      if (message.conversation === conversation?._id) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
        
        // Mark as read if not from current user
        if (message.sender._id !== user._id) {
          setTimeout(() => {
            chatService.markMessagesAsRead(conversation._id);
          }, 500);
        }
      }
    };

    const handleMessageRead = (data) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === data.messageId
            ? {
                ...msg,
                readBy: [
                  ...(msg.readBy || []),
                  { user: data.readBy, readAt: data.readAt }
                ]
              }
            : msg
        )
      );
    };

    on('new-message', handleNewMessage);
    on('message-read', handleMessageRead);

    return () => {
      off('new-message', handleNewMessage);
      off('message-read', handleMessageRead);
    };
  }, [conversation?._id, user._id, on, off]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message handler
  const handleSendMessage = (content, type = 'text') => {
    if (!content.trim() || !conversation?._id) return;

    sendMessage(conversation._id, content.trim(), type);
  };

  if (!conversation) {
    return null;
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)',
      }}
    >
      {/* Chat Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={otherUser?.avatar}
              sx={{
                width: 48,
                height: 48,
                border: '2px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              {otherUser?.username?.[0]?.toUpperCase()}
            </Avatar>
            
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                {otherUser?.username}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Circle
                  sx={{
                    width: 8,
                    height: 8,
                    color: isOnline ? 'success.main' : 'text.secondary',
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {isOnline ? 'Online' : `Last seen ${moment(otherUser?.lastSeen).fromNow()}`}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <Phone />
            </IconButton>
            <IconButton
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <VideoCall />
            </IconButton>
            <IconButton
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <MoreVert />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MessageList
          messages={messages}
          currentUser={user}
          otherUser={otherUser}
          loading={loading}
        />
        
        {/* Typing Indicator */}
        {typingInThisConversation.length > 0 && (
          <Box sx={{ px: 2, pb: 1 }}>
            <TypingIndicator users={typingInThisConversation} />
          </Box>
        )}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Box
        sx={{
          borderTop: '1px solid rgba(99, 102, 241, 0.2)',
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <MessageInput
          onSendMessage={handleSendMessage}
          conversationId={conversation._id}
          disabled={!isOnline}
        />
      </Box>
    </Box>
  );
};

export default ChatArea;