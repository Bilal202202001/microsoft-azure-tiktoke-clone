
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
    register: async () => {
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