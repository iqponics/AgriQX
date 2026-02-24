const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createStorage = (folder, allowedFormats = ["jpg", "png", "jpeg", "gif"]) => {
    return new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: folder,
            allowedFormats: allowedFormats,
        },
    });
};

// Post storage
const postStorage = createStorage("yourapp/posts");
const uploadPost = multer({ storage: postStorage });

// Uploads storage (from uploadRouter.js)
const uploadsStorage = createStorage("uploads");
const uploadGeneral = multer({ storage: uploadsStorage });

// Generic file storage (from files.js)
const fileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const userId = req.body.userId || 'default';
        let resource_type = file.mimetype.startsWith('video/') ? 'video' : 'auto';
        return {
            folder: `yourapp/${userId}`,
            allowedFormats: ["jpg", "png", "jpeg", "webp", "pdf", "mp4", "mov", "3gp", "doc", "docx"],
            resource_type,
        };
    },
});
const uploadFile = multer({ storage: fileStorage });

// Profile Picture storage
const profilePicStorage = createStorage("yourapp/profilePics");
const uploadProfilePic = multer({ storage: profilePicStorage });

module.exports = {
    cloudinary,
    uploadPost,
    uploadGeneral,
    uploadFile,
    uploadProfilePic
};
