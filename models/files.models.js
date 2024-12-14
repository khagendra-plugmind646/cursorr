const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    // bucketId: { type: String, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    publicUrl: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null }, // Optional: reference to User model
    uploadedAt: { type: Date, default: Date.now }, // Timestamp for upload
});

module.exports = mongoose.model('File', fileSchema);