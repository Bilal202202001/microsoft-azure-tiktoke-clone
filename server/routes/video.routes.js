import express from 'express';
import multer from 'multer';
import fs, { stat } from 'fs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } from '@azure/storage-blob';
import videoModel from '../models/video.model.js';
import userModel from '../models/users.model.js';
import { log, timeStamp } from 'console';
dotenv.config();

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.CONTAINER_NAME;
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Invalid Login" });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userData = await userModel.findById(user.id);
        const { title, location, hashtags } = req.body;




        // const containerClient = blobServiceClient.getContainerClient(containerName);
        // const blobName = new Date().getTime() + '-' + req.file.originalname;
        // const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // await blockBlobClient.uploadFile(req.file.path, {
        //     blobHTTPHeaders: { blobContentType: req.file.mimetype }
        // });
        // const sasPermissions = BlobSASPermissions.parse('r');
        // const expiresOn = new Date();
        // expiresOn.setFullYear(expiresOn.getFullYear() + 1);
        // const sasOptions = {
        //     containerName,
        //     blobName,
        //     permissions: sasPermissions.toString(),
        //     startsOn: new Date(),
        //     expiresOn,
        // };

        // const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
        // const blobUrlWithSAS = `${blockBlobClient.url}?${sasToken}`;

        // fs.unlink(req.file.path, err => {
        //     if (err) console.error('Error deleting file:', err);
        // });


        const video = await videoModel.create({
            userId: userData._id,
            title,
            location,
            hashtags,
            url: "blobUrlWithSAS"
        })
        res.status(200).json({
            status: "Success",
            message: "Video uploaded successfully",
        });

    } catch (err) {
        console.error('Error:', err);
        if (err.name === 'JsonWebTokenError') {
            res.status(401).json({ message: "Invalid token" });
        } else {
            res.status(500).json({ message: err.message });
        }
    }
});

router.get('/getVideos', async (req, res) => {
    try {
        const searchQuery = req.query.search;
        let filter = {};

        if (searchQuery) {
            filter.title = { $regex: searchQuery, $options: 'i' };
            console.log("Filter being applied:", filter);
        }

        const videos = await videoModel.find(filter).populate('userId').populate('comments.userId').sort({ timestamp: -1 });

        res.status(200).json({ videos });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: err.message });
    }
});

router.get('/getMyVideos', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Invalid Login" });

        }
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const videos = await videoModel.find(
            { userId: user.id }
        ).sort({ timestamp: -1 });

        res.status(200).json({ videos });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: err.message });
    }
});


router.post('/addComment', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "To comment on video,Please Login !" });
        }
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { videoId, comment } = req.body;
        const video = await videoModel.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        video.comments.push({ userId: user.id, comment });
        await video.save();
        res.status(200).json({ message: "Comment added successfully" });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: err.message });
    }
});

router.post('/likeVideo', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "To like the video,Please Login" });
        }
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const userData = await userModel.findById(user.id);
        if (!userData) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { videoId } = req.body;
        console.log(videoId);

        const video = await videoModel.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const existingLike = video.likes.find((like) => like.userId.toString() === user.id);
        if (existingLike) {
            video.likes.pull(existingLike);
        } else {
            video.likes.push({ userId: user.id});
        }


        await video.save();
        res.status(200).json({ message: "Like added successfully" });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: err.message });
    }

});



export default router;
