const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth, escortAuth } = require('../middleware/auth');
const Escort = require('../models/Escort');
const User = require('../models/User');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/';
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Upload escort images
router.post('/escort-images/:escortId', escortAuth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const escort = await Escort.findById(req.params.escortId);
    if (!escort) {
      return res.status(404).json({ message: 'Escort not found' });
    }

    // Check ownership or admin
    if (escort.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Process uploaded files
    const newImages = req.files.map((file, index) => ({
      url: `/uploads/${file.filename}`,
      isMain: index === 0 && escort.images.length === 0, // First image is main if no existing images
      isVerified: false
    }));

    // Add to escort images
    escort.images.push(...newImages);
    await escort.save();

    res.json({
      message: 'Images uploaded successfully',
      images: newImages,
      totalImages: escort.images.length
    });

  } catch (error) {
    console.error('Upload escort images error:', error);
    
    // Clean up uploaded files in case of error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// Upload user avatar
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old avatar if exists
    if (user.avatar && user.avatar.startsWith('/uploads/')) {
      const oldPath = path.join(process.cwd(), user.avatar);
      fs.unlink(oldPath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error('Error deleting old avatar:', err);
        }
      });
    }

    // Update user avatar
    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({
      message: 'Avatar uploaded successfully',
      avatar: user.avatar
    });

  } catch (error) {
    console.error('Upload avatar error:', error);
    
    // Clean up uploaded file in case of error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// Delete escort image
router.delete('/escort-image/:escortId/:imageIndex', escortAuth, async (req, res) => {
  try {
    const { escortId, imageIndex } = req.params;
    const index = parseInt(imageIndex);

    const escort = await Escort.findById(escortId);
    if (!escort) {
      return res.status(404).json({ message: 'Escort not found' });
    }

    // Check ownership or admin
    if (escort.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (index < 0 || index >= escort.images.length) {
      return res.status(400).json({ message: 'Invalid image index' });
    }

    const imageToDelete = escort.images[index];
    
    // Delete file from filesystem
    if (imageToDelete.url.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), imageToDelete.url);
      fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error('Error deleting image file:', err);
        }
      });
    }

    // Remove from array
    escort.images.splice(index, 1);

    // If deleted image was main and there are other images, make first one main
    if (imageToDelete.isMain && escort.images.length > 0) {
      escort.images[0].isMain = true;
    }

    await escort.save();

    res.json({
      message: 'Image deleted successfully',
      remainingImages: escort.images.length
    });

  } catch (error) {
    console.error('Delete escort image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Set main image
router.put('/escort-image/:escortId/:imageIndex/main', escortAuth, async (req, res) => {
  try {
    const { escortId, imageIndex } = req.params;
    const index = parseInt(imageIndex);

    const escort = await Escort.findById(escortId);
    if (!escort) {
      return res.status(404).json({ message: 'Escort not found' });
    }

    // Check ownership or admin
    if (escort.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (index < 0 || index >= escort.images.length) {
      return res.status(400).json({ message: 'Invalid image index' });
    }

    // Set all images as not main
    escort.images.forEach(img => img.isMain = false);
    
    // Set selected image as main
    escort.images[index].isMain = true;

    await escort.save();

    res.json({
      message: 'Main image updated successfully',
      mainImage: escort.images[index]
    });

  } catch (error) {
    console.error('Set main image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Too many files or unexpected field name.' });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ message: 'Only image files are allowed!' });
  }

  res.status(500).json({ message: 'Upload error occurred.' });
});

module.exports = router;