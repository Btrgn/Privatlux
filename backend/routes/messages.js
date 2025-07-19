const express = require('express');
const Message = require('../models/Message');
const { authenticateToken } = require('./auth');
const router = express.Router();

// Get conversations for user
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
          isDeleted: false
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversation',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$recipient', userId] }, { $eq: ['$isRead', false] }] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lastMessage.sender',
          foreignField: '_id',
          as: 'senderInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lastMessage.recipient',
          foreignField: '_id',
          as: 'recipientInfo'
        }
      }
    ]);

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages in a conversation
router.get('/conversation/:conversationId', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      conversation: conversationId,
      isDeleted: false
    })
      .populate('sender', 'firstName lastName profilePicture')
      .populate('recipient', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: conversationId,
        recipient: req.user.userId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/send', authenticateToken, async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.user.userId;

    if (!recipientId || !content) {
      return res.status(400).json({ message: 'Recipient and content are required' });
    }

    const conversationId = Message.generateConversationId(senderId, recipientId);

    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      conversation: conversationId,
      content: content.trim()
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName profilePicture')
      .populate('recipient', 'firstName lastName profilePicture');

    res.status(201).json({ message: populatedMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;