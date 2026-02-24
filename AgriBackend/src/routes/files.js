const express = require('express');
const filesRouter = express.Router();
const fileController = require('../controllers/fileController');
const { uploadFile, uploadProfilePic } = require('../config/cloudinary');

// GET all file objects for a user
filesRouter.post('/', fileController.getAllFiles);

// Redirect client to Cloudinary URL
filesRouter.get('/:userId/:storedName', fileController.getFileByStoredName);

// GET a file object via shared route
filesRouter.get('/shared/:userId/:fileId', fileController.getSharedFile);

// Upload a file
filesRouter.post('/fileUpload', uploadFile.single("file"), fileController.uploadFile);

// Get directory size (stubbed)
filesRouter.post('/directorySize', fileController.getDirectorySize);

// Update shared list
filesRouter.put('/shared/', fileController.updateSharedList);

// Get files in bin
filesRouter.post('/bin', fileController.getBinFiles);

// Move to bin
filesRouter.post('/delete/:fileName', fileController.moveToBin);

// Restore from bin
filesRouter.post('/bin/:fileName', fileController.restoreFromBin);

// Permanently delete
filesRouter.delete('/permanentDelete', fileController.permanentDelete);

// Upload profile picture
filesRouter.post('/uploadProfilePic', uploadProfilePic.single("file"), fileController.uploadProfilePicV2);

// Get profile pic redirect
filesRouter.get('/get/profilePic/:fileName', fileController.getProfilePicRedirect);

module.exports = filesRouter;
