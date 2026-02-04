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

// get messages between two users
router.get('/:userId1/:userId2', async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;
        
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

// get conversations for a user
router.get('/conversations/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // get all messages where user is sender or receiver
        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        })
        .populate('senderId', 'firstName lastName')
        .populate('receiverId', 'firstName lastName')
        .sort({ createdAt: -1 });

        // group by conversation partner
        const conversations: any = {};
        messages.forEach(msg => {
            const partnerId = msg.senderId._id.toString() === userId 
                ? msg.receiverId._id.toString() 
                : msg.senderId._id.toString();
            
            if (!conversations[partnerId]) {
                const partner = msg.senderId._id.toString() === userId 
                    ? msg.receiverId 
                    : msg.senderId;
                conversations[partnerId] = {
                    partnerId,
                    partnerName: `${(partner as any).firstName} ${(partner as any).lastName}`,
                    lastMessage: msg.content,
                    lastMessageTime: msg.createdAt
                };
            }
        });

        res.json(Object.values(conversations));
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

