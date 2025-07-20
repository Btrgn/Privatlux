const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  attachments: [{
    filename: String,
    url: String,
    mimetype: String,
    size: Number
  }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    deletedAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient message queries
messageSchema.index({ recipient: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ conversation: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);