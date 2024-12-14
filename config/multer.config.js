const multer = require('multer');

// Configure Multer to store files temporarily in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Supabase upload helper function
const supabaseUpload = async (file) => {
  const uploadFileToSupabase = require('./supabase.config'); // Import the Supabase client

  try {
    const data = await uploadFileToSupabase(file); // Upload the file
    return data; // Return the uploaded file data
  } catch (error) {
    console.error("File upload failed:", error.message); // Log the error
    throw error; // Rethrow the error to be caught in the route handler
  }
};

module.exports = { upload, supabaseUpload };