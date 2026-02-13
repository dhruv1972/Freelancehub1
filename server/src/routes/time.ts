import { Router } from 'express';
import { TimeEntry } from '../models/TimeEntry';

const router = Router();

// start timer
router.post('/start', async (req, res) => {
    try {
        const { freelancerId, projectId, description } = req.body;

        // check if already has active timer
        const active = await TimeEntry.findOne({ freelancerId, endTime: null });
        if (active) {
            return res.status(400).json({ error: 'You already have an active timer' });
        }

        const entry = await TimeEntry.create({
            freelancerId,
            projectId,
            startTime: new Date(),
            description: description || ''
        });

        res.status(201).json(entry);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// stop timer
router.post('/stop', async (req, res) => {
    try {
        const { timeEntryId } = req.body;

        const entry = await TimeEntry.findById(timeEntryId);
        if (!entry) {
            return res.status(404).json({ error: 'Time entry not found' });
        }

        if (entry.endTime) {
            return res.status(400).json({ error: 'Timer already stopped' });
        }

        const endTime = new Date();
        const durationMs = endTime.getTime() - entry.startTime.getTime();
        const durationMinutes = Math.floor(durationMs / (1000 * 60));

        entry.endTime = endTime;
        entry.durationMinutes = durationMinutes;
        await entry.save();

        res.json(entry);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// get time entries for a project
router.get('/project/:projectId', async (req, res) => {
    try {
        const entries = await TimeEntry.find({ projectId: req.params.projectId })
            .sort({ createdAt: -1 });
        res.json(entries);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// get time entries for a freelancer
router.get('/user/:freelancerId', async (req, res) => {
    try {
        const entries = await TimeEntry.find({ freelancerId: req.params.freelancerId })
            .populate('projectId', 'title')
            .sort({ createdAt: -1 });
        res.json(entries);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

