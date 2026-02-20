import { Router } from 'express';
import { User } from '../models/User';

const router = Router();

// search freelancers
router.get('/', async (req, res) => {
    try {
        const { q, skills, location, minRating } = req.query;

        const filter: any = { userType: 'freelancer' };

        // text search
        if (q) {
            filter.$or = [
                { firstName: { $regex: q, $options: 'i' } },
                { lastName: { $regex: q, $options: 'i' } },
                { 'profile.bio': { $regex: q, $options: 'i' } }
            ];
        }

        // skills filter
        if (skills) {
            const skillsArr = (skills as string).split(',').map(s => s.trim());
            filter['profile.skills'] = { $in: skillsArr.map(s => new RegExp(s, 'i')) };
        }

        // location filter
        if (location) {
            filter['profile.location'] = { $regex: location, $options: 'i' };
        }

        // rating filter
        if (minRating) {
            filter['profile.rating'] = { $gte: Number(minRating) };
        }

        const freelancers = await User.find(filter)
            .select('-password')
            .sort({ 'profile.rating': -1 })
            .limit(50);

        res.json(freelancers);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

