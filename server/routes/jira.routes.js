import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cloudinary from "../utils/cloudinary.js";
import upload from "../middleware/multer.js"
import userModel from '../models/users.model.js';
import authRoutes from '../controllers/auth.contoller.js';
import JiraAccountController from '../controllers/jira.controller.js';
const router = express.Router();


router.post('/connectJira', upload.none(), async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Invalid Login" });
        } else {

            const response = await JiraAccountController.connectJira(req.body, token);
            if (response.success) {
                return res.status(200).json({ user: response.user });
            } else {
                return res.status(401).json({ message: response.message });
            }

        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.get('/getConnectedAccounts', async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Invalid Login" });
    }
    try {
        const response = await JiraAccountController.getConnectedAccounts(token);
        if (response.success) {
            return res.status(200).json({ jiraAccount: response.jiraAccount });
        } else {
            return res.status(401).json({ message: response.message });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.get('/getJiraAccountData', async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Invalid Login" });
    }
    try {
        const response = await JiraAccountController.getJiraAccountData(token);
        if (response.success) {
            return res.status(200).json({ jiraAccountData: response.jiraAccountData });
        } else {
            return res.status(401).json({ message: response.message });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});


router.get('/getJiraData', async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Invalid Login" });
    }
    try {
        const response = await JiraAccountController.getJiraData(token);
        if (response.success) {
            return res.status(200).json({ data: response.data });
        } else {
            return res.status(401).json({ message: response.message });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.put('/updateJiraData',upload.none(), async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Invalid Login" });
    }
    console.log( req.body, "body");

    try {
        const response = await JiraAccountController.updateJiraData(req.body, token);
        if (response.success) {
            return res.status(200).json({ message: response.message });
        } else {
            return res.status(401).json({ message: response.message });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

export default router;