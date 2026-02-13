import { Router } from 'express';
import { User } from '../models/User';
import { Project } from '../models/Project';

const router = Router();

// get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// suspend user
router.post('/users/:id/suspend', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: 'suspended' },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// activate user
router.post('/users/:id/activate', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: 'active' },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// get all projects
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find({})
            .populate('clientId', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

