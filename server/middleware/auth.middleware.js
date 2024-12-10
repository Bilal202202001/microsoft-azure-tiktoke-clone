import jwt from "jsonwebtoken";

export function createJWT(user) {
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
    return token;
}
export async function verifyJWT(token) {
    if (!token) {
        return false;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return {
            id: decoded?.id,
        };
    } catch (error) {
        console.error("JWT verification failed:", error);
        return false;
    }
}
