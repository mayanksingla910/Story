const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text'
  },
  fileUrl: {
    type: String,
    default: null
  },
  fileName: {
    type: String,
    default: null
  },
  fileSize: {
    type: Number,
    default: null
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date,
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  deliveredTo: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    deliveredAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for better query performance
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ createdAt: -1 });

// Virtual for checking if message is read by specific user
messageSchema.methods.isReadBy = function(userId) {
  return this.readBy.some(read => read.user.toString() === userId.toString());
};

// Virtual for checking if message is delivered to specific user
messageSchema.methods.isDeliveredTo = function(userId) {
  return this.deliveredTo.some(delivery => delivery.user.toString() === userId.toString());
};

// Method to mark as read by user
messageSchema.methods.markAsRead = async function(userId) {
  if (!this.isReadBy(userId)) {
    this.readBy.push({
      user: userId,
      readAt: new Date()
    });
    return await this.save();
  }
  return this;
};

// Method to mark as delivered to user
messageSchema.methods.markAsDelivered = async function(userId) {
  if (!this.isDeliveredTo(userId)) {
    this.deliveredTo.push({
      user: userId,
      deliveredAt: new Date()
    });
    return await this.save();
  }
  return this;
};

// Method to edit message content
messageSchema.methods.editContent = async function(newContent) {
  this.content = newContent;
  this.isEdited = true;
  this.editedAt = new Date();
  return await this.save();
};

// Method to soft delete message
messageSchema.methods.softDelete = async function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.content = 'This message was deleted';
  return await this.save();
};

// Static method to get messages for a conversation
messageSchema.statics.getByConversation = function(conversationId, page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  return this.find({ 
    conversation: conversationId,
    isDeleted: false 
  })
  .populate('sender', 'username avatar')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
};

// Pre-save middleware to update conversation last activity
messageSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const Conversation = mongoose.model('Conversation');
      await Conversation.findByIdAndUpdate(
        this.conversation,
        { 
          lastMessage: this._id,
          lastActivity: new Date()
        }
      );
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  }
  next();
});

module.exports = mongoose.model('Message', messageSchema);