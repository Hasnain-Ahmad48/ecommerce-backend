import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
const cloudinary_v2 = cloudinary.v2;

cloudinary_v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary_v2,
  params: async (req, file) => {
    // Customize folder and public_id if needed
    return {
      folder: 'mern-ecommerce',
      format: 'jpg', // or use file.mimetype to detect
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
    };
  }
});

export { cloudinary_v2 as cloudinary, storage };
