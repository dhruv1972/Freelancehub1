import { Router } from 'express';
import { Message } from '../models/Message';

const router = Router();

// send message
router.post('/', async (req, res) => {
    try {
        const { senderId, receiverId, content, projectId, attachments } = req.body;

        const message = await Message.create({
            senderId,
            receiverId,
            content,
            projectId,
            attachments: attachments || []
        });

        const populated = await Message.findById(message._id)
            .populate('senderId', 'firstName lastName')
            .populate('receiverId', 'firstName lastName');

        res.status(201).json(populated);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// get unread message count for a user (MUST be before /:userId1/:userId2)
router.get('/unread/:userId', async (req, res) => {
    try {
        const count = await Message.countDocuments({
            receiverId: req.params.userId,
            read: false
        });
        res.json({ count });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// get conversations for a user (MUST be before /:userId1/:userId2)
router.get('/conversations/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        })
        .populate('senderId', 'firstName lastName')
        .populate('receiverId', 'firstName lastName')
        .sort({ createdAt: -1 });

        const conversations: any = {};
        messages.forEach(msg => {
            const sender = msg.senderId as any;
            const receiver = msg.receiverId as any;
            const partnerId = sender._id.toString() === userId
                ? receiver._id.toString()
                : sender._id.toString();

            if (!conversations[partnerId]) {
                const partner = sender._id.toString() === userId ? receiver : sender;
                conversations[partnerId] = {
                    partnerId,
                    partnerName: `${(partner as any).firstName} ${(partner as any).lastName}`,
                    lastMessage: msg.content,
                    lastMessageTime: msg.createdAt
                };
            }
        });

        const sorted = Object.values(conversations).sort((a: any, b: any) =>
            new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
        );
        res.json(sorted);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// get messages between two users (and mark incoming as read)
router.get('/:userId1/:userId2', async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;

        await Message.updateMany(
            { senderId: userId2, receiverId: userId1, read: false },
            { read: true }
        );

        const messages = await Message.find({
            $or: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 }
            ]
        })
        .populate('senderId', 'firstName lastName')
        .populate('receiverId', 'firstName lastName')
        .sort({ createdAt: 1 });

        res.json(messages);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
