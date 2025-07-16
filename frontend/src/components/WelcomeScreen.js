import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  Chip,
} from '@mui/material';
import {
  ChatBubble,
  Message,
  People,
  Notifications,
  Security,
} from '@mui/icons-material';

const WelcomeScreen = ({ user }) => {
  const features = [
    {
      icon: <Message />,
      title: 'Real-time Messaging',
      description: 'Send and receive messages instantly',
    },
    {
      icon: <People />,
      title: 'Online Status',
      description: 'See who\'s online and available to chat',
    },
    {
      icon: <Notifications />,
      title: 'Typing Indicators',
      description: 'Know when someone is typing a message',
    },
    {
      icon: <Security />,
      title: 'Secure & Private',
      description: 'Your conversations are safe and secure',
    },
  ];

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)',
      }}
    >
      <Box
        sx={{
          maxWidth: 600,
          textAlign: 'center',
        }}
      >
        {/* Welcome Header */}
        <Box sx={{ mb: 6 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              mx: 'auto',
              mb: 3,
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            }}
          >
            <ChatBubble sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome to ZYNC
          </Typography>
          
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 3, lineHeight: 1.6 }}
          >
            Hey {user?.username}! 👋 Select a conversation from the sidebar to start chatting, 
            or find new people to connect with.
          </Typography>

          <Chip
            label="🚀 Ready to chat!"
            color="primary"
            variant="outlined"
            sx={{
              fontSize: '1rem',
              py: 2,
              px: 3,
              borderRadius: 3,
              border: '2px solid',
              borderColor: 'primary.main',
            }}
          />
        </Box>

        {/* Features Grid */}
        <Stack spacing={3}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: 'text.primary',
            }}
          >
            What you can do with ZYNC
          </Typography>
          
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
            }}
          >
            {features.map((feature, index) => (
              <Paper
                key={index}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: 'primary.main',
                    mb: 2,
                    mx: 'auto',
                  }}
                >
                  {feature.icon}
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: 'text.primary',
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Stack>

        {/* Getting Started */}
        <Box sx={{ mt: 6 }}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}
          >
            💡 <strong>Tip:</strong> Click on "Users" tab in the sidebar to discover people you can chat with, 
            or check your existing conversations in the "Chats" tab.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default WelcomeScreen;