import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Badge,
  Chip,
  Divider,
  Menu,
  MenuItem,
  Paper,
} from '@mui/material';
import {
  Search,
  Add,
  MoreVert,
  ChatBubble,
  People,
  Settings,
  Logout,
  Circle,
} from '@mui/icons-material';
import moment from 'moment';

import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';

const Sidebar = ({
  conversations,
  users,
  selectedConversation,
  onConversationSelect,
  onNewConversation,
  loading,
}) => {
  const { user, logout } = useAuth();
  const { onlineUsers, isConnected } = useSocket();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSearchQuery('');
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p._id !== user._id);
  };

  const isUserOnline = (userId) => {
    return onlineUsers.some(u => u.userId === userId);
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const otherUser = getOtherParticipant(conv);
    return otherUser?.username?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredUsers = users.filter(u => {
    if (!searchQuery) return true;
    return u.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const ConversationItem = ({ conversation }) => {
    const otherUser = getOtherParticipant(conversation);
    const isSelected = selectedConversation?._id === conversation._id;
    const isOnline = isUserOnline(otherUser?._id);

    return (
      <ListItem disablePadding sx={{ mb: 0.5 }}>
        <ListItemButton
          onClick={() => onConversationSelect(conversation)}
          selected={isSelected}
          sx={{
            borderRadius: 2,
            mx: 1,
            '&.Mui-selected': {
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            },
            '&:hover': {
              background: 'rgba(99, 102, 241, 0.1)',
            },
          }}
        >
          <ListItemAvatar>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                isOnline ? (
                  <Circle
                    sx={{
                      width: 12,
                      height: 12,
                      color: 'success.main',
                    }}
                  />
                ) : null
              }
            >
              <Avatar
                src={otherUser?.avatar}
                sx={{
                  width: 48,
                  height: 48,
                  border: '2px solid rgba(99, 102, 241, 0.2)',
                }}
              >
                {otherUser?.username?.[0]?.toUpperCase()}
              </Avatar>
            </Badge>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {otherUser?.username}
              </Typography>
            }
            secondary={
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    mb: 0.5,
                  }}
                >
                  {conversation.lastMessage?.content || 'Start a conversation...'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {conversation.lastActivity ? moment(conversation.lastActivity).fromNow() : ''}
                </Typography>
              </Box>
            }
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const UserItem = ({ user: userItem }) => {
    const isOnline = isUserOnline(userItem._id);

    return (
      <ListItem disablePadding sx={{ mb: 0.5 }}>
        <ListItemButton
          onClick={() => onNewConversation(userItem._id)}
          sx={{
            borderRadius: 2,
            mx: 1,
            '&:hover': {
              background: 'rgba(236, 72, 153, 0.1)',
            },
          }}
        >
          <ListItemAvatar>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                isOnline ? (
                  <Circle
                    sx={{
                      width: 12,
                      height: 12,
                      color: 'success.main',
                    }}
                  />
                ) : null
              }
            >
              <Avatar
                src={userItem.avatar}
                sx={{
                  width: 48,
                  height: 48,
                  border: '2px solid rgba(236, 72, 153, 0.2)',
                }}
              >
                {userItem.username[0].toUpperCase()}
              </Avatar>
            </Badge>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                {userItem.username}
              </Typography>
            }
            secondary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {userItem.bio || 'No bio yet'}
                </Typography>
                {isOnline && (
                  <Chip
                    label="Online"
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.75rem' }}
                  />
                )}
              </Box>
            }
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
          background: 'rgba(99, 102, 241, 0.05)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'primary.main',
              }}
            >
              <ChatBubble />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ZYNC
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Circle
                  sx={{
                    width: 8,
                    height: 8,
                    color: isConnected ? 'success.main' : 'error.main',
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </Typography>
              </Box>
            </Box>
          </Box>
          <IconButton
            onClick={(e) => setProfileMenuAnchor(e.currentTarget)}
            size="small"
          >
            <MoreVert />
          </IconButton>
        </Box>

        {/* User Profile */}
        <Paper
          sx={{
            p: 2,
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={user?.avatar}
              sx={{
                width: 36,
                height: 36,
                border: '2px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              {user?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user?.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.bio || 'No bio yet'}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Search */}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder={tabValue === 0 ? 'Search conversations...' : 'Search users...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              background: 'rgba(30, 41, 59, 0.5)',
            },
          }}
        />
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              fontWeight: 600,
            },
          }}
        >
          <Tab
            icon={<ChatBubble />}
            label="Chats"
            iconPosition="start"
          />
          <Tab
            icon={<People />}
            label="Users"
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {tabValue === 0 ? (
          <List sx={{ py: 1 }}>
            {loading ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="text.secondary">Loading conversations...</Typography>
              </Box>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation._id}
                  conversation={conversation}
                />
              ))
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  {searchQuery ? 'No conversations found' : 'No conversations yet'}
                </Typography>
              </Box>
            )}
          </List>
        ) : (
          <List sx={{ py: 1 }}>
            {loading ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="text.secondary">Loading users...</Typography>
              </Box>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((userItem) => (
                <UserItem key={userItem._id} user={userItem} />
              ))
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  {searchQuery ? 'No users found' : 'No users available'}
                </Typography>
              </Box>
            )}
          </List>
        )}
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={() => setProfileMenuAnchor(null)}
        PaperProps={{
          sx: {
            background: 'rgba(30, 41, 59, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          },
        }}
      >
        <MenuItem onClick={() => setProfileMenuAnchor(null)}>
          <Settings sx={{ mr: 2 }} />
          Settings
        </MenuItem>
        <MenuItem onClick={logout}>
          <Logout sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Sidebar;