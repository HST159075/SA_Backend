import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// আপনার .env থেকে কনফিগারেশন লোড করা হচ্ছে
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'share_app_uploads', // ক্লাউডিনারিতে এই ফোল্ডারে ফাইল জমা হবে
      resource_type: 'auto',       // ভিডিও, ইমেজ বা পিডিএফ যাই হোক অটো ডিটেক্ট করবে
      allowed_formats: ['jpg', 'png', 'pdf', 'mp4', 'zip', 'txt'], // কোন কোন ফাইল এলাউ করবেন
    };
  },
});

export const upload = multer({ storage: storage });