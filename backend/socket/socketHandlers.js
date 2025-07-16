const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

const socketHandlers = (io, socket) => {
  // Set user online when connected
  const setUserOnline = async () => {
    try {
      await socket.user.setOnlineStatus(true, socket.id);
      socket.broadcast.emit('user-online', {
        userId: socket.user._id,
        username: socket.user.username
      });
    } catch (error) {
      console.error('Error setting user online:', error);
    }
  };

  // Set user offline when disconnected
  const setUserOffline = async () => {
    try {
      await socket.user.setOnlineStatus(false);
      socket.broadcast.emit('user-offline', {
        userId: socket.user._id,
        username: socket.user.username
      });
    } catch (error) {
      console.error('Error setting user offline:', error);
    }
  };

  // Join user to their conversations rooms
  const joinConversations = async () => {
    try {
      const conversations = await Conversation.findByUser(socket.user._id);
      conversations.forEach(conv => {
        socket.join(conv._id.toString());
      });
    } catch (error) {
      console.error('Error joining conversations:', error);
    }
  };

  // Initialize user connection
  setUserOnline();
  joinConversations();

  // Handle new message
  socket.on('send-message', async (data) => {
    try {
      const { conversationId, content, type = 'text' } = data;

      // Verify user is part of conversation
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: socket.user._id
      });

      if (!conversation) {
        socket.emit('error', { message: 'Conversation not found' });
        return;
      }

      // Create message
      const message = new Message({
        sender: socket.user._id,
        conversation: conversationId,
        content,
        type
      });

      await message.save();
      await message.populate('sender', 'username avatar');

      // Update conversation last activity
      await conversation.updateActivity();

      // Emit to all participants
      io.to(conversationId).emit('new-message', message);

      // Mark as delivered to online participants
      const participants = await User.find({
        _id: { $in: conversation.participants },
        isOnline: true,
        _id: { $ne: socket.user._id }
      });

      for (const participant of participants) {
        await message.markAsDelivered(participant._id);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicator
  socket.on('typing-start', async (data) => {
    try {
      const { conversationId } = data;
      
      // Update user typing status
      await User.findByIdAndUpdate(socket.user._id, {
        isTyping: true,
        typingInConversation: conversationId
      });

      socket.to(conversationId).emit('user-typing', {
        userId: socket.user._id,
        username: socket.user.username,
        conversationId
      });
    } catch (error) {
      console.error('Error handling typing start:', error);
    }
  });

  socket.on('typing-stop', async (data) => {
    try {
      const { conversationId } = data;
      
      // Update user typing status
      await User.findByIdAndUpdate(socket.user._id, {
        isTyping: false,
        typingInConversation: null
      });

      socket.to(conversationId).emit('user-stop-typing', {
        userId: socket.user._id,
        username: socket.user.username,
        conversationId
      });
    } catch (error) {
      console.error('Error handling typing stop:', error);
    }
  });

  // Handle message read
  socket.on('mark-read', async (data) => {
    try {
      const { messageId } = data;
      
      const message = await Message.findById(messageId);
      if (message && !message.isReadBy(socket.user._id)) {
        await message.markAsRead(socket.user._id);
        
        // Notify sender about read receipt
        io.to(message.conversation.toString()).emit('message-read', {
          messageId: message._id,
          readBy: socket.user._id,
          readAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  });

  // Handle joining a conversation room
  socket.on('join-conversation', (data) => {
    const { conversationId } = data;
    socket.join(conversationId);
  });

  // Handle leaving a conversation room
  socket.on('leave-conversation', (data) => {
    const { conversationId } = data;
    socket.leave(conversationId);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    setUserOffline();
  });
};

module.exports = socketHandlers;