const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Message = require('../models/Message');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user's messages (inbox)
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('type').optional().isIn(['inbox', 'sent'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { page = 1, limit = 20, type = 'inbox' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {
      isDeleted: false,
      ...(type === 'inbox' 
        ? { recipient: req.user.userId }
        : { sender: req.user.userId }
      )
    };

    const [messages, total] = await Promise.all([
      Message.find(filter)
        .populate('sender', 'firstName lastName avatar')
        .populate('recipient', 'firstName lastName avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Message.countDocuments(filter)
    ]);

    res.json({
      messages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalMessages: total
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send new message
router.post('/', auth, [
  body('recipient').isMongoId(),
  body('subject').trim().isLength({ min: 1, max: 200 }),
  body('content').trim().isLength({ min: 1, max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { recipient, subject, content } = req.body;

    // Check if recipient exists
    const recipientUser = await User.findById(recipient);
    if (!recipientUser) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Prevent self-messaging
    if (recipient === req.user.userId) {
      return res.status(400).json({ message: 'Cannot send message to yourself' });
    }

    const message = new Message({
      sender: req.user.userId,
      recipient,
      subject,
      content
    });

    await message.save();

    // Populate sender info for response
    await message.populate('sender', 'firstName lastName avatar');
    await message.populate('recipient', 'firstName lastName avatar');

    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single message
router.get('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'firstName lastName avatar')
      .populate('recipient', 'firstName lastName avatar');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is sender or recipient
    if (message.sender._id.toString() !== req.user.userId && 
        message.recipient._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Mark as read if user is recipient and message is unread
    if (message.recipient._id.toString() === req.user.userId && !message.isRead) {
      message.isRead = true;
      message.readAt = new Date();
      await message.save();
    }

    res.json({ message });
  } catch (error) {
    console.error('Get message error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete message
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is sender or recipient
    if (message.sender.toString() !== req.user.userId && 
        message.recipient.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Soft delete - mark as deleted for this user
    const existingDelete = message.deletedBy.find(d => d.user.toString() === req.user.userId);
    if (!existingDelete) {
      message.deletedBy.push({
        user: req.user.userId,
        deletedAt: new Date()
      });
    }

    // If both users have deleted, mark as deleted
    if (message.deletedBy.length >= 2) {
      message.isDeleted = true;
    }

    await message.save();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread message count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      recipient: req.user.userId,
      isRead: false,
      isDeleted: false
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;