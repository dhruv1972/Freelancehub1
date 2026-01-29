import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// register
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, userType } = req.body;

        // check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            userType
        });

        // generate token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userType: user.userType
            },
            token
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // generate token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        res.json({
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userType: user.userType,
                profile: user.profile
            },
            token
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

