// JWT Authentication middleware
import jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'freelancehub-secret-key',
        { expiresIn: '7d' }
    );
};

