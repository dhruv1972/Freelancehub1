import { Router } from 'express';
import { User } from '../models/User';

const router = Router();

// list users for messaging (basic directory)
router.get('/', async (req, res) => {
    try {
        const { q, role } = req.query;
        const filter: any = {};

        if (role && (role === 'freelancer' || role === 'client')) {
            filter.userType = role;
        }

        if (q) {
            const search = q as string;
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const users = await User.find(filter)
            .select('firstName lastName email userType profile')
            .sort({ firstName: 1, lastName: 1 });

        res.json(users);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

