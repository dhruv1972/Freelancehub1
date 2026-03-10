import { Router } from 'express';
import { SavedJob } from '../models/SavedJob';
import { Project } from '../models/Project';

const router = Router();

// list saved project IDs for a user
router.get('/:userId', async (req, res) => {
    try {
        const saved = await SavedJob.find({ userId: req.params.userId })
            .select('projectId')
            .sort({ createdAt: -1 });
        const projectIds = saved.map(s => s.projectId);
        const projects = await Project.find({ _id: { $in: projectIds }, status: 'open' })
            .populate('clientId', 'firstName lastName')
            .lean();
        const order = projectIds.map(id => id.toString());
        const sorted = projects.slice().sort((a, b) => order.indexOf(String(a._id)) - order.indexOf(String(b._id)));
        res.json(sorted);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// list only saved project IDs (for client to check which are saved)
router.get('/:userId/ids', async (req, res) => {
    try {
        const saved = await SavedJob.find({ userId: req.params.userId }).select('projectId').lean();
        res.json(saved.map(s => s.projectId));
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// save a job (add to favorites)
router.post('/', async (req, res) => {
    try {
        const { userId, projectId } = req.body;
        if (!userId || !projectId) return res.status(400).json({ error: 'Missing userId or projectId' });
        const existing = await SavedJob.findOne({ userId, projectId });
        if (existing) return res.json(existing);
        const saved = await SavedJob.create({ userId, projectId });
        res.status(201).json(saved);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// unsave a job (remove from favorites)
router.delete('/:userId/:projectId', async (req, res) => {
    try {
        await SavedJob.deleteOne({ userId: req.params.userId, projectId: req.params.projectId });
        res.json({ message: 'Removed from saved' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
