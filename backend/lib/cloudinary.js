import {v2 as cloudinary} from 'cloudinary';

const connectCloudinary = ()=>{
    if (
        !process.env.CLOUDINARY_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_SECRET_KEY
    ) {
        console.warn(
            "Cloudinary is not configured. File uploads will be unavailable."
        );
        return false;
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    });

    console.log("Cloudinary configured");
    return true;
}

export default connectCloudinary;
