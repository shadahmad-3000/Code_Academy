import { v2 as cloudinary } from 'cloudinary';
import { API_KEY, API_SECRET, CLOUD_NAME } from '../config.js';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

export const deleteImage = async (id) => {
  return await cloudinary.uploader.destroy(id);
};

export const uploadImage = async (fileBuffer) => {
  try {
    const stream = Readable.from(fileBuffer);
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'chat_images' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url); 
          }
        }
      ).end(fileBuffer);
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const uploadDocuments = async (fileBuffer) => {
  try {
    const stream = Readable.from(fileBuffer);
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'chat_documents' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url); 
          }
        }
      ).end(fileBuffer);
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error; 
  }
};

export const uploadAudio = async (fileBuffer) => {
  try {
    const stream = Readable.from(fileBuffer);
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: "chat_audios",
          resource_type: "video" // Cloudinary treats audio as 'video'
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url); 
          }
        }
      ).end(fileBuffer);
    });
  } catch (error) {
    console.error("Error uploading audio:", error);
    throw error;
  }
};
