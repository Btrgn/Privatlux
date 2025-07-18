const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const { authenticateToken, requireEscort } = require('../middleware/auth');
const Escort = require('../models/Escort');
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Max 10 files at once
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Image processing configuration
const IMAGE_CONFIG = {
  escort: {
    main: { width: 800, height: 1200, quality: 85 },
    thumbnail: { width: 300, height: 450, quality: 75 },
    blur: { blur: 20, quality: 60 }
  },
  verification: {
    document: { width: 1200, height: 1600, quality: 90 }
  }
};

// Helper function to process and upload image
async function processAndUploadImage(imageBuffer, options = {}) {
  try {
    const { width, height, quality = 85, blur = 0 } = options;
    
    let processedImage = sharp(imageBuffer);
    
    // Resize if dimensions provided
    if (width || height) {
      processedImage = processedImage.resize(width, height, {
        fit: 'cover',
        position: 'center'
      });
    }
    
    // Apply blur if specified
    if (blur > 0) {
      processedImage = processedImage.blur(blur);
    }
    
    // Convert to JPEG with specified quality
    const processed = await processedImage
      .jpeg({ quality })
      .toBuffer();
    
    // Upload to Cloudinary
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          format: 'jpg',
          folder: 'privatlux',
          transformation: {
            flags: 'progressive'
          }
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(processed);
    });
    
  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`);
  }
}

// POST /api/upload/escort-photos - Upload escort photos
router.post('/escort-photos',
  authenticateToken,
  requireEscort,
  upload.array('photos', 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      // Find escort profile
      const escort = await Escort.findOne({ userId: req.user._id });
      if (!escort) {
        return res.status(404).json({ message: 'Escort profile not found' });
      }

      const uploadedPhotos = [];
      const errors = [];

      // Process each uploaded file
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        
        try {
          // Create main version
          const mainUpload = await processAndUploadImage(
            file.buffer, 
            IMAGE_CONFIG.escort.main
          );

          // Create blurred version for non-members
          const blurredUpload = await processAndUploadImage(
            file.buffer, 
            { ...IMAGE_CONFIG.escort.main, blur: 20 }
          );

          const photoData = {
            url: mainUpload.secure_url,
            cloudinaryId: mainUpload.public_id,
            blurredUrl: blurredUpload.secure_url,
            blurredCloudinaryId: blurredUpload.public_id,
            isMain: i === 0 && escort.photos.length === 0, // First photo is main if no existing photos
            uploadedAt: new Date()
          };

          escort.photos.push(photoData);
          uploadedPhotos.push(photoData);

        } catch (uploadError) {
          console.error('Photo upload error:', uploadError);
          errors.push({
            filename: file.originalname,
            error: uploadError.message
          });
        }
      }

      // Save escort profile with new photos
      await escort.save();

      res.json({
        message: `Successfully uploaded ${uploadedPhotos.length} photos`,
        photos: uploadedPhotos,
        errors: errors.length > 0 ? errors : undefined
      });

    } catch (error) {
      console.error('Upload escort photos error:', error);
      res.status(500).json({ message: 'Failed to upload photos' });
    }
  }
);

// DELETE /api/upload/escort-photos/:photoId - Delete escort photo
router.delete('/escort-photos/:photoId',
  authenticateToken,
  requireEscort,
  async (req, res) => {
    try {
      const escort = await Escort.findOne({ userId: req.user._id });
      if (!escort) {
        return res.status(404).json({ message: 'Escort profile not found' });
      }

      const photoIndex = escort.photos.findIndex(
        photo => photo._id.toString() === req.params.photoId
      );

      if (photoIndex === -1) {
        return res.status(404).json({ message: 'Photo not found' });
      }

      const photo = escort.photos[photoIndex];

      // Delete from Cloudinary
      try {
        if (photo.cloudinaryId) {
          await cloudinary.uploader.destroy(photo.cloudinaryId);
        }
        if (photo.blurredCloudinaryId) {
          await cloudinary.uploader.destroy(photo.blurredCloudinaryId);
        }
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error:', cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }

      // Remove from escort photos array
      escort.photos.splice(photoIndex, 1);

      // If deleted photo was main, make first remaining photo main
      if (photo.isMain && escort.photos.length > 0) {
        escort.photos[0].isMain = true;
      }

      await escort.save();

      res.json({ message: 'Photo deleted successfully' });

    } catch (error) {
      console.error('Delete escort photo error:', error);
      res.status(500).json({ message: 'Failed to delete photo' });
    }
  }
);

// PUT /api/upload/escort-photos/:photoId/main - Set photo as main
router.put('/escort-photos/:photoId/main',
  authenticateToken,
  requireEscort,
  async (req, res) => {
    try {
      const escort = await Escort.findOne({ userId: req.user._id });
      if (!escort) {
        return res.status(404).json({ message: 'Escort profile not found' });
      }

      const photo = escort.photos.find(
        p => p._id.toString() === req.params.photoId
      );

      if (!photo) {
        return res.status(404).json({ message: 'Photo not found' });
      }

      // Remove main flag from all photos
      escort.photos.forEach(p => p.isMain = false);
      
      // Set selected photo as main
      photo.isMain = true;

      await escort.save();

      res.json({ message: 'Main photo updated successfully' });

    } catch (error) {
      console.error('Set main photo error:', error);
      res.status(500).json({ message: 'Failed to set main photo' });
    }
  }
);

// POST /api/upload/verification-documents - Upload verification documents
router.post('/verification-documents',
  authenticateToken,
  requireEscort,
  upload.array('documents', 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No documents uploaded' });
      }

      const escort = await Escort.findOne({ userId: req.user._id });
      if (!escort) {
        return res.status(404).json({ message: 'Escort profile not found' });
      }

      const uploadedDocuments = [];
      const errors = [];

      // Process each uploaded document
      for (const file of req.files) {
        try {
          const upload = await processAndUploadImage(
            file.buffer,
            IMAGE_CONFIG.verification.document
          );

          const documentData = {
            type: req.body.documentType || 'id_document',
            url: upload.secure_url,
            cloudinaryId: upload.public_id,
            uploadedAt: new Date()
          };

          escort.verification.documents.push(documentData);
          uploadedDocuments.push(documentData);

        } catch (uploadError) {
          console.error('Document upload error:', uploadError);
          errors.push({
            filename: file.originalname,
            error: uploadError.message
          });
        }
      }

      await escort.save();

      res.json({
        message: `Successfully uploaded ${uploadedDocuments.length} documents`,
        documents: uploadedDocuments,
        errors: errors.length > 0 ? errors : undefined
      });

    } catch (error) {
      console.error('Upload verification documents error:', error);
      res.status(500).json({ message: 'Failed to upload verification documents' });
    }
  }
);

// GET /api/upload/escort-photos - Get escort's photos
router.get('/escort-photos',
  authenticateToken,
  requireEscort,
  async (req, res) => {
    try {
      const escort = await Escort.findOne({ userId: req.user._id });
      if (!escort) {
        return res.status(404).json({ message: 'Escort profile not found' });
      }

      res.json({
        photos: escort.photos.map(photo => ({
          id: photo._id,
          url: photo.url,
          isMain: photo.isMain,
          uploadedAt: photo.uploadedAt
        }))
      });

    } catch (error) {
      console.error('Get escort photos error:', error);
      res.status(500).json({ message: 'Failed to get photos' });
    }
  }
);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Maximum is 10 files.' });
    }
  }
  
  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({ message: 'Only image files are allowed' });
  }

  next(error);
});

module.exports = router;