import { Router } from 'express';
import { Review } from '../models/Review';
import { User } from '../models/User';

const router = Router();

// create review
router.post('/', async (req, res) => {
    try {
        const { projectId, reviewerId, revieweeId, rating, comment, reviewType } = req.body;

        const review = await Review.create({
            projectId,
            reviewerId,
            revieweeId,
            rating,
            comment,
            reviewType
        });

        // when a client reviews a freelancer, update the freelancer's profile.rating (average of all client-to-freelancer reviews)
        if (reviewType === 'client-to-freelancer' && revieweeId) {
            const reviews = await Review.find({ revieweeId, reviewType: 'client-to-freelancer' });
            const sum = reviews.reduce((s, r) => s + (r.rating || 0), 0);
            const average = reviews.length ? sum / reviews.length : 0;
            await User.findByIdAndUpdate(revieweeId, { 'profile.rating': Math.round(average * 10) / 10 });
        }

        res.status(201).json(review);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// get reviews for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const reviews = await Review.find({ revieweeId: req.params.userId })
            .populate('reviewerId', 'firstName lastName')
            .populate('projectId', 'title')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// get reviews for a project
router.get('/project/:projectId', async (req, res) => {
    try {
        const reviews = await Review.find({ projectId: req.params.projectId })
            .populate('reviewerId', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

