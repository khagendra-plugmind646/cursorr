const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const supabase = createClient('https://dyuxximbgmusahizzejz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5dXh4aW1iZ211c2FoaXp6ZWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxNjIxMDMsImV4cCI6MjA0OTczODEwM30.Xj0XX7h-hT6bGRdulmmMzzT7Yn74GT5hJ9qIcAP69-8');

// File upload function to Supabase storage
const uploadFileToSupabase = async (file) => {
  const { data, error } = await supabase.storage
    .from('drive') // Ensure this matches your Supabase bucket
    .upload(path.basename(file.originalname), file.buffer, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw error;
  }
  return data;
};

module.exports = uploadFileToSupabase;