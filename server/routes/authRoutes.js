import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cloudinary from "../utils/cloudinary.js";
import upload from "../middleware/multer.js"
import userModel from '../models/users.model.js';
import AuthController from '../controllers/auth.contoller.js';

const router = express.Router();


router.post('/register', upload.none(), async (req, res) => {
    try {

        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await userModel.create({
            name: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        const jwtToken = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role, name: newUser.name }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', jwtToken);
        return res.json({ Status: "Success", name: newUser.name, email: newUser.email, _id: newUser._id, role: newUser.role, message: "User Registered Successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



router.post('/login', upload.none(), async (req, res) => {
    try {

        const response = await AuthController.login(req.body);
        res.cookie("token", response.token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
        });

        if (response.success) {
            return res.status(200).json({ message: response.message, name: response.user.name, email: response.user.email, _id: response.user._id, role: response.user.role });
        } else {
            return res.status(401).json({ message: response.message });
        }

    } catch (err) {

        res.status(500).json({ message: err.message });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token').json('Logged out successfully');
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json("Token Not Found");
    }
    else {
        jwt.verify(token, 'jwt-secret-key', (err, decoded) => {
            if (err) {
                return res.json("Error in Token Verification");
            }
            else {
                req.email = decoded.email;
                req._id = decoded.id;
                req.role = decoded.role
                req.name = decoded.name
                next();
            }
        });
    }
}

router.get('/getUser', async (req, res) => {
    const token = req.cookies.token;
    try {
        if (!token) {
            return res.status(401).json({ message: "Invalid Login" });
        } else {

            const response = await AuthController.getUser(token);
            if (response.success) {
                return res.status(200).json({ user: response.user });
            } else {
                return res.status(401).json({ message: response.message });
            }

        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})

router.get('/verifyLogin', async (req, res) => {
    const token = req.cookies.token;
    try {
        if (!token) {
            return res.status(401).json({ message: "Invalid Login" });
        }
        return res.status(200).json({ message: "Valid Login" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})

export default router;