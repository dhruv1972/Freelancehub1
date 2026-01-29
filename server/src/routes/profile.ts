import { Router } from 'express';
import { User } from '../models/User';

const router = Router();

// get profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// update profile
router.put('/:id', async (req, res) => {
    try {
        const { firstName, lastName, profile } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, profile },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

