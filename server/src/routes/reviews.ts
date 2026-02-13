import { Router } from 'express';
import { Review } from '../models/Review';

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

