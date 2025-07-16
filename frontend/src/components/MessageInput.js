import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Send,
  EmojiEmotions,
  AttachFile,
  Mic,
} from '@mui/icons-material';
import EmojiPicker from 'emoji-picker-react';

import { useSocket } from '../contexts/SocketContext';

const MessageInput = ({ onSendMessage, conversationId, disabled = false }) => {
  const { startTyping, stopTyping } = useSocket();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Handle typing indicators
  useEffect(() => {
    if (message.trim() && !isTyping) {
      setIsTyping(true);
      startTyping(conversationId);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        stopTyping(conversationId);
      }
    }, 1000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, conversationId, startTyping, stopTyping, isTyping]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isTyping) {
        stopTyping(conversationId);
      }
    };
  }, [isTyping, conversationId, stopTyping]);

  const handleSend = () => {
    if (!message.trim() || disabled) return;

    onSendMessage(message.trim());
    setMessage('');
    setShowEmojiPicker(false);
    
    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      stopTyping(conversationId);
    }

    // Focus back to input
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '100%',
            right: 0,
            zIndex: 1000,
            mb: 1,
          }}
        >
          <Paper
            elevation={8}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              background: 'rgba(30, 41, 59, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme="dark"
              height={400}
              width={350}
              searchDisabled={false}
              skinTonesDisabled={false}
              previewConfig={{
                showPreview: false,
              }}
            />
          </Paper>
        </Box>
      )}

      {/* Message Input */}
      <Box sx={{ p: 2 }}>
        <TextField
          ref={inputRef}
          fullWidth
          multiline
          maxRows={4}
          placeholder={disabled ? 'User is offline...' : 'Type a message...'}
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Tooltip title="Attach file">
                  <IconButton
                    size="small"
                    disabled={disabled}
                    sx={{
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    <AttachFile />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Tooltip title="Emoji">
                    <IconButton
                      size="small"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      disabled={disabled}
                      sx={{
                        color: showEmojiPicker ? 'primary.main' : 'text.secondary',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      <EmojiEmotions />
                    </IconButton>
                  </Tooltip>

                  {message.trim() ? (
                    <Tooltip title="Send message">
                      <IconButton
                        onClick={handleSend}
                        disabled={disabled}
                        sx={{
                          color: 'primary.main',
                          '&:hover': {
                            background: 'rgba(99, 102, 241, 0.1)',
                          },
                        }}
                      >
                        <Send />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Voice message">
                      <IconButton
                        size="small"
                        disabled={disabled}
                        sx={{
                          color: 'text.secondary',
                          '&:hover': { color: 'primary.main' },
                        }}
                      >
                        <Mic />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </InputAdornment>
            ),
            sx: {
              borderRadius: 3,
              background: 'rgba(15, 23, 42, 0.5)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(99, 102, 241, 0.2)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(99, 102, 241, 0.4)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            },
          }}
          sx={{
            '& .MuiInputBase-input': {
              fontSize: '1rem',
              lineHeight: 1.5,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default MessageInput;