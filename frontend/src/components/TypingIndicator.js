import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  keyframes,
} from '@mui/material';

// Animated dots keyframes
const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
`;

const TypingIndicator = ({ users }) => {
  if (!users || users.length === 0) return null;

  const userNames = users.map(u => u.username);
  const displayText = userNames.length === 1 
    ? `${userNames[0]} is typing...`
    : `${userNames.join(', ')} are typing...`;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 1,
        px: 2,
        py: 1,
      }}
    >
      {/* Avatar for single user */}
      {users.length === 1 && (
        <Avatar
          sx={{
            width: 24,
            height: 24,
            fontSize: '0.7rem',
          }}
        >
          {users[0].username[0].toUpperCase()}
        </Avatar>
      )}

      {/* Typing bubble */}
      <Paper
        elevation={0}
        sx={{
          px: 2,
          py: 1,
          borderRadius: 3,
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderBottomLeftRadius: users.length === 1 ? 1 : 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: '0.8rem' }}
        >
          {displayText}
        </Typography>

        {/* Animated dots */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.3,
          }}
        >
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={{
                width: 4,
                height: 4,
                backgroundColor: 'primary.main',
                borderRadius: '50%',
                animation: `${bounce} 1.5s infinite`,
                animationDelay: `${index * 0.2}s`,
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default TypingIndicator;