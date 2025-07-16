import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Done,
  DoneAll,
} from '@mui/icons-material';
import moment from 'moment';

const MessageList = ({ messages, currentUser, otherUser, loading }) => {
  if (loading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (messages.length === 0) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            No messages yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start the conversation by sending a message!
          </Typography>
        </Box>
      </Box>
    );
  }

  const MessageBubble = ({ message, isOwn, showAvatar, isFirst, isLast }) => {
    const isRead = message.readBy?.some(read => read.user !== currentUser._id);

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: isOwn ? 'flex-end' : 'flex-start',
          mb: isLast ? 2 : 0.5,
          mt: isFirst ? 1 : 0,
          px: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 1,
            maxWidth: '70%',
            flexDirection: isOwn ? 'row-reverse' : 'row',
          }}
        >
          {/* Avatar */}
          {showAvatar && !isOwn && (
            <Avatar
              src={otherUser?.avatar}
              sx={{
                width: 32,
                height: 32,
                alignSelf: 'flex-end',
              }}
            >
              {otherUser?.username?.[0]?.toUpperCase()}
            </Avatar>
          )}

          {/* Message Content */}
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                px: 2,
                borderRadius: 3,
                background: isOwn
                  ? 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)'
                  : 'rgba(30, 41, 59, 0.8)',
                border: isOwn
                  ? 'none'
                  : '1px solid rgba(99, 102, 241, 0.2)',
                backdropFilter: 'blur(10px)',
                borderBottomLeftRadius: !isOwn && showAvatar ? 1 : 3,
                borderBottomRightRadius: isOwn && showAvatar ? 1 : 3,
                position: 'relative',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: isOwn ? 'white' : 'text.primary',
                  lineHeight: 1.4,
                  wordBreak: 'break-word',
                }}
              >
                {message.content}
              </Typography>

              {message.isEdited && (
                <Chip
                  label="edited"
                  size="small"
                  sx={{
                    height: 16,
                    fontSize: '0.7rem',
                    mt: 0.5,
                    opacity: 0.7,
                  }}
                />
              )}
            </Paper>

            {/* Message info */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isOwn ? 'flex-end' : 'flex-start',
                gap: 0.5,
                mt: 0.5,
                px: 1,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '0.7rem' }}
              >
                {moment(message.createdAt).format('HH:mm')}
              </Typography>

              {isOwn && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {isRead ? (
                    <DoneAll
                      sx={{
                        width: 14,
                        height: 14,
                        color: 'primary.main',
                      }}
                    />
                  ) : (
                    <Done
                      sx={{
                        width: 14,
                        height: 14,
                        color: 'text.secondary',
                      }}
                    />
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  const DateDivider = ({ date }) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        my: 2,
      }}
    >
      <Chip
        label={moment(date).calendar(null, {
          sameDay: '[Today]',
          lastDay: '[Yesterday]',
          lastWeek: 'dddd',
          sameElse: 'MMMM Do, YYYY'
        })}
        size="small"
        sx={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          color: 'text.secondary',
        }}
      />
    </Box>
  );

  // Group messages by date and consecutive sender
  const groupedMessages = [];
  let currentGroup = null;
  let currentDate = null;

  messages.forEach((message, index) => {
    const messageDate = moment(message.createdAt).format('YYYY-MM-DD');
    const isOwn = message.sender._id === currentUser._id;
    
    // Add date divider if date changed
    if (messageDate !== currentDate) {
      if (currentGroup) {
        groupedMessages.push(currentGroup);
      }
      groupedMessages.push({ type: 'date', date: message.createdAt });
      currentDate = messageDate;
      currentGroup = null;
    }

    // Check if we should start a new group
    const shouldStartNewGroup = 
      !currentGroup ||
      currentGroup.isOwn !== isOwn ||
      moment(message.createdAt).diff(moment(currentGroup.messages[currentGroup.messages.length - 1].createdAt), 'minutes') > 5;

    if (shouldStartNewGroup) {
      if (currentGroup) {
        groupedMessages.push(currentGroup);
      }
      currentGroup = {
        type: 'messages',
        isOwn,
        messages: [message],
      };
    } else {
      currentGroup.messages.push(message);
    }
  });

  if (currentGroup) {
    groupedMessages.push(currentGroup);
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        py: 1,
      }}
    >
      {groupedMessages.map((group, groupIndex) => {
        if (group.type === 'date') {
          return <DateDivider key={`date-${groupIndex}`} date={group.date} />;
        }

        return (
          <Box key={`group-${groupIndex}`}>
            {group.messages.map((message, messageIndex) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={group.isOwn}
                showAvatar={messageIndex === group.messages.length - 1}
                isFirst={messageIndex === 0}
                isLast={messageIndex === group.messages.length - 1}
              />
            ))}
          </Box>
        );
      })}
    </Box>
  );
};

export default MessageList;