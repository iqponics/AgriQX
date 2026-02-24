const fileRepository = require('../repositories/fileRepository');
const userRepository = require('../repositories/userRepository');
const { cloudinary } = require('../config/cloudinary');

const fileController = {
    // From uploadRouter.js
    uploadUserProfilePic: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            const imageUrl = req.file.path;
            const userId = req.params.userId;
            const updatedUser = await userRepository.findByIdAndUpdate(
                userId,
                { profilePic: imageUrl }
            );
            if (!updatedUser) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json({ message: "Image uploaded and saved successfully!", url: imageUrl, user: updatedUser });
        } catch (error) {
            console.error("Upload error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    uploadDoc: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            res.json({
                message: "Document uploaded successfully!",
                url: req.file.path,
                name: req.file.originalname
            });
        } catch (error) {
            console.error("Doc upload error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    // From files.js
    getAllFiles: async (req, res) => {
        try {
            const fileObjects = await fileRepository.find({ owner: req.body.userId, inBin: false });
            res.status(200).send(fileObjects);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getFileByStoredName: async (req, res) => {
        try {
            const fileObj = await fileRepository.findOne({ storedName: req.params.storedName });
            if (!fileObj) return res.status(404).json({ error: "File not found" });
            if (fileObj.owner === req.params.userId || (fileObj.sharedWith && fileObj.sharedWith.includes(req.params.userId))) {
                res.redirect(fileObj.url);
            } else {
                res.status(401).json({ error: "Cannot access this file!" });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getSharedFile: async (req, res) => {
        try {
            const fileObj = await fileRepository.findById(req.params.fileId);
            if (fileObj && (fileObj.owner === req.params.userId || (fileObj.sharedWith && fileObj.sharedWith.includes(req.params.userId)))) {
                res.status(200).json(fileObj);
            } else {
                res.status(401).json({ error: "Cannot access this file!" });
            }
        } catch (err) {
            res.status(500).json({ error: 'Invalid' });
        }
    },

    uploadFile: async (req, res) => {
        const userId = req.body.userId;
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        try {
            const savedFile = await fileRepository.create({
                owner: userId,
                fileName: req.file.originalname,
                storedName: req.file.filename,
                url: req.file.path,
                createdAt: new Date(),
                inBin: false,
            });
            res.status(200).json(savedFile);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getDirectorySize: async (req, res) => {
        res.status(200).json({ size: 0 });
    },

    updateSharedList: async (req, res) => {
        try {
            const file = await fileRepository.findById(req.body.fileId);
            if (file.owner === req.body.userId) {
                await file.updateOne({ $set: { sharedWith: req.body.sharedWith } });
                res.status(200).json(file);
            } else {
                res.status(401).json({ error: 'Unauthorized access' });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getBinFiles: async (req, res) => {
        try {
            const fileObjects = await fileRepository.find({ owner: req.body.userId, inBin: true });
            res.status(200).send(fileObjects);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    moveToBin: async (req, res) => {
        try {
            const file = await fileRepository.findOne({ storedName: req.params.fileName });
            if (file && file.owner === req.body.userId) {
                file.inBin = true;
                await fileRepository.save(file);
                res.status(200).json(file);
            } else {
                res.status(401).json({ error: "Unauthorized access" });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    restoreFromBin: async (req, res) => {
        try {
            const file = await fileRepository.findOne({ storedName: req.params.fileName });
            if (file && file.owner === req.body.userId) {
                file.inBin = false;
                await fileRepository.save(file);
                res.status(200).json(file);
            } else {
                res.status(401).json({ error: "Unauthorized access" });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    permanentDelete: async (req, res) => {
        try {
            const { fileId, userId } = req.query;
            if (!fileId || !userId) return res.status(400).json({ error: 'Missing fileId or userId' });

            const fileObj = await fileRepository.findById(fileId);
            if (!fileObj) return res.status(404).json({ error: 'File not found' });
            if (fileObj.owner.toString() !== userId) return res.status(403).json({ error: 'Unauthorized' });

            cloudinary.uploader.destroy(fileObj.storedName, async (error, result) => {
                if (error) return res.status(500).json(error);
                await fileRepository.deleteOne({ _id: fileId });
                res.status(200).send('Deleted!');
            });
        } catch (err) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    uploadProfilePicV2: async (req, res) => {
        const userId = req.body.userId;
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const profilePic = req.file.path;
        try {
            const updatedUser = await userRepository.findByIdAndUpdate(
                userId,
                { $set: { profilePic } }
            );
            if (!updatedUser) return res.status(404).json({ error: "User not found" });
            res.status(200).json({ profilePic });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getProfilePicRedirect: async (req, res) => {
        try {
            const user = await userRepository.findOne({ profilePic: req.params.fileName });
            if (user) {
                res.redirect(user.profilePic);
            } else {
                res.status(404).json({ error: 'Profile pic not found' });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }
};

module.exports = fileController;
