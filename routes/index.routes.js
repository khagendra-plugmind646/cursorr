const express = require('express');
const router = express.Router();
const { upload, supabaseUpload } = require('../config/multer.config'); // Import multer and Supabase upload
const File = require('../models/files.models'); // Corrected import path for the File model
const authMiddleware=require('../middlewares/authe');
// Route to render the home page
router.get('/home',authMiddleware, (req, res) => {
    res.render('home'); // Render `home.ejs`
});

// Route to handle file uploads
router.post('/upload',authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded!' }); // Handle missing file
        }

        // Upload the file to Supabase bucket
        const fileData = await supabaseUpload(req.file);

        // Construct the public URL (ensure the bucket is public)
        const publicUrl = `https://dyuxximbgmusahizzejz.supabase.co/storage/v1/object/public/${fileData.path}`;

        // Save file details in the MongoDB database
        const newFile = new File({
            fileName: req.file.originalname,
            filePath: fileData.path,
            bucketId: fileData.bucket_id,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            publicUrl: publicUrl,
            uploadedBy: req.user.userId ? req.user.userId : null, // Optional: if user info is available
        });

        const savedFile = await newFile.save();

        // Return the response with database details and Supabase response
        res.status(200).json({
            message: 'File uploaded successfully!',
            fileDetails: savedFile, // Saved file details from MongoDB
            supabaseResponse: fileData, // Full response from Supabase
        });
    } catch (error) {
        res.status(500).json({ message: 'File upload failed!', error: error.message });
    }
});

module.exports = router;