import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import intoStream from 'into-stream';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadPhotoToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadResult = cloudinary.uploader.upload_stream(
      { public_id: fileBuffer.originalname },
      (error, uploadResult) => {
        if (error) {
          return reject(error);
        }
        return resolve(uploadResult);
      }
    );
    intoStream(fileBuffer.buffer).pipe(uploadResult);
  });
};
