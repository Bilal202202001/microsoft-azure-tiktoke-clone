
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/users.model.js';
import { createJWT, verifyJWT } from '../middleware/auth.middleware.js';
const AuthController = {
    login: async (body) => {
        const { email, password } = body;
        try {
            const user = await userModel.findOne({ email });

            if (!user) {
                return { error: true, message: 'User not found' };
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return { error: true, message: 'Incorrect password' };
            }

            const token = createJWT(user);
            return { success: true, user: user.toObject(), token, message: 'Login successful' };

        } catch (error) {
            console.error(error);
            return { error: 'Internal server error' };
        }
    },
    register: async (body) => {
        const { username, email, password } = body;

        try {
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return { success: false, message: 'Email already exists' };
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await userModel.create({
                name: username,
                email: email,
                password: hashedPassword,
            });

            const token = createJWT(newUser);
            return {
                success: true,
                user: newUser.toObject(),
                token,
                message: 'User Registered Successfully',
            };
        } catch (err) {
            console.error(err);
            return { success: false, message: 'Registration failed', error: err.message };
        }
    },
    getUser: async (token) => {
        try {
            const userId = await verifyJWT(token)
            if (!userId)
                return false
            const user = await userModel.findOne({ _id: userId.id })
            return { success: true, user: user };
        } catch (err) {
            console.error(err)
            return false
        }
    }

}

export default AuthController;