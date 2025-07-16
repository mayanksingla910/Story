import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChatBubble,
} from '@mui/icons-material';

import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { chatService } from '../services/chatService';

import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import WelcomeScreen from '../components/WelcomeScreen';

const drawerWidth = 340;

const ChatPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const { isConnected } = useSocket();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [conversationsRes, usersRes] = await Promise.all([
          chatService.getConversations(),
          chatService.getUsers(),
        ]);
        
        setConversations(conversationsRes.data.conversations || []);
        setUsers(usersRes.data.users || []);
      } catch (error) {
        console.error('Error loading chat data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleNewConversation = async (userId) => {
    try {
      const response = await chatService.createPrivateConversation(userId);
      const newConversation = response.data.conversation;
      
      // Add to conversations if not already there
      setConversations(prev => {
        const exists = prev.find(c => c._id === newConversation._id);
        if (exists) return prev;
        return [newConversation, ...prev];
      });
      
      setSelectedConversation(newConversation);
      if (isMobile) {
        setMobileOpen(false);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const sidebarContent = (
    <Sidebar
      conversations={conversations}
      users={users}
      selectedConversation={selectedConversation}
      onConversationSelect={handleConversationSelect}
      onNewConversation={handleNewConversation}
      loading={loading}
    />
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar for mobile */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <ChatBubble sx={{ mr: 2 }} />
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              ZYNC
            </Typography>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: isConnected ? 'success.main' : 'error.main',
                mr: 1,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {isConnected ? 'Connected' : 'Disconnected'}
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              borderRight: '1px solid rgba(99, 102, 241, 0.2)',
            },
          }}
        >
          {sidebarContent}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              borderRight: '1px solid rgba(99, 102, 241, 0.2)',
            },
          }}
          open
        >
          {sidebarContent}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          height: '100vh',
          mt: { xs: isMobile ? 8 : 0, md: 0 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {selectedConversation ? (
          <ChatArea
            conversation={selectedConversation}
            onConversationUpdate={(updatedConversation) => {
              setConversations(prev =>
                prev.map(c =>
                  c._id === updatedConversation._id ? updatedConversation : c
                )
              );
            }}
          />
        ) : (
          <WelcomeScreen user={user} />
        )}
      </Box>
    </Box>
  );
};

export default ChatPage;