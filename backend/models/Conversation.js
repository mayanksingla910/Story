const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  type: {
    type: String,
    enum: ['private', 'group'],
    default: 'private'
  },
  name: {
    type: String,
    trim: true,
    maxlength: [50, 'Conversation name cannot exceed 50 characters']
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastActivity: -1 });
conversationSchema.index({ type: 1 });

// Ensure private conversations have exactly 2 participants
conversationSchema.pre('save', function(next) {
  if (this.type === 'private' && this.participants.length !== 2) {
    return next(new Error('Private conversations must have exactly 2 participants'));
  }
  next();
});

// Static method to find conversation between two users
conversationSchema.statics.findBetweenUsers = function(userId1, userId2) {
  return this.findOne({
    type: 'private',
    participants: { $all: [userId1, userId2] }
  }).populate('participants', 'username avatar isOnline lastSeen')
    .populate('lastMessage');
};

// Static method to find all conversations for a user
conversationSchema.statics.findByUser = function(userId) {
  return this.find({
    participants: userId,
    isActive: true
  })
  .populate('participants', 'username avatar isOnline lastSeen')
  .populate('lastMessage')
  .sort({ lastActivity: -1 });
};

// Method to update last activity
conversationSchema.methods.updateActivity = async function() {
  this.lastActivity = new Date();
  return await this.save();
};

module.exports = mongoose.model('Conversation', conversationSchema);