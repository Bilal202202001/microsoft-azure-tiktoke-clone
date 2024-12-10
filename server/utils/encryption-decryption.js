import crypto from 'crypto';
const algorithm = 'aes-256-cbc';
const key = Buffer.from('12345678901234567890123456789012');
const iv = Buffer.from('1234567890123456');
export const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

export const decrypt = (encryptedData) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
