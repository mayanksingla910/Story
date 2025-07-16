const express = require('express');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's conversations
router.get('/', auth, async (req, res) => {
  try {
    const conversations = await Conversation.findByUser(req.user._id);
    res.json({ conversations });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or get conversation with another user
router.post('/private', auth, async (req, res) => {
  try {
    const { userId } = req.body;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot create conversation with yourself' });
    }

    // Check if other user exists
    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findBetweenUsers(req.user._id, userId);

    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        participants: [req.user._id, userId],
        type: 'private'
      });
      await conversation.save();
      await conversation.populate('participants', 'username avatar isOnline lastSeen');
    }

    res.json({ conversation });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific conversation
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      participants: req.user._id
    }).populate('participants', 'username avatar isOnline lastSeen')
      .populate('lastMessage');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json({ conversation });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;