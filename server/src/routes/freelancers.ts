import { Router } from 'express';
import { User } from '../models/User';

const router = Router();

// search freelancers
router.get('/', async (req, res) => {
    try {
        const { q, skills, experience, location, minRating } = req.query;

        const filter: any = { userType: 'freelancer' };

        // text search: name (first, last, full), email, bio
        if (q) {
            const qStr = (q as string).trim();
            filter.$or = [
                { firstName: { $regex: qStr, $options: 'i' } },
                { lastName: { $regex: qStr, $options: 'i' } },
                { email: { $regex: qStr, $options: 'i' } },
                { 'profile.bio': { $regex: qStr, $options: 'i' } }
            ];
        }

        // skills filter (comma-separated; match any of the listed skills)
        if (skills) {
            const skillsArr = (skills as string).split(',').map(s => s.trim()).filter(Boolean);
            if (skillsArr.length > 0) {
                filter['profile.skills'] = { $in: skillsArr.map(s => new RegExp(s, 'i')) };
            }
        }

        // experience filter: search inside profile.experience text
        if (experience) {
            filter['profile.experience'] = { $regex: experience, $options: 'i' };
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

