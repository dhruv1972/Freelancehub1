import { Router } from 'express';
import { Notification } from '../models/Notification';

const router = Router();

// get notifications for a user
router.get('/:userId', async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(notifications);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// get unread count
router.get('/:userId/unread', async (req, res) => {
    try {
        const count = await Notification.countDocuments({ 
            userId: req.params.userId, 
            isRead: false 
        });
        res.json({ count });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// mark as read
router.patch('/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        if (!notification) return res.status(404).json({ error: 'Not found' });
        res.json(notification);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// mark all as read
router.patch('/:userId/read-all', async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.params.userId, isRead: false },
            { isRead: true }
        );
        res.json({ message: 'All marked as read' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

