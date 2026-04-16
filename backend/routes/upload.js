const express = require('express');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// @desc    Upload an image and return a Cloudinary URL
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an image file' });
        }
        
        if (!process.env.CLOUDINARY_CLOUD_NAME || 
            !process.env.CLOUDINARY_API_KEY || 
            !process.env.CLOUDINARY_API_SECRET || 
            process.env.CLOUDINARY_API_SECRET === '**********') {
            return res.status(500).json({ success: false, message: 'Cloudinary credentials (API Secret) are not properly configured in .env' });
        }

        // Upload to Cloudinary using a readable stream of the incoming buffer
        const uploadStream = cloudinary.uploader.upload_stream(
            { 
                folder: 'finedine_assets',
                resource_type: 'image'
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Storage Error:', error);
                    return res.status(500).json({ success: false, message: 'Failed to upload to Cloudinary' });
                }

                res.status(200).json({
                    success: true,
                    data: {
                        url: result.secure_url
                    }
                });
            }
        );

        // Convert memory buffer to stream and pipe it to Cloudinary
        const readableStream = new Readable({
            read() {
                this.push(req.file.buffer);
                this.push(null);
            }
        });
        
        readableStream.pipe(uploadStream);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error uploading image' });
    }
});

module.exports = router;
