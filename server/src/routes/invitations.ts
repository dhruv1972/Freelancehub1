import { Router } from 'express';
import { Invitation } from '../models/Invitation';
import { Project } from '../models/Project';
import { Notification } from '../models/Notification';

const router = Router();

// client invites freelancer to apply for a project
router.post('/', async (req, res) => {
    try {
        const { projectId, clientId, freelancerId } = req.body;
        if (!projectId || !clientId || !freelancerId) {
            return res.status(400).json({ error: 'Missing projectId, clientId, or freelancerId' });
        }

        const project = await Project.findById(projectId).lean();
        if (!project) return res.status(404).json({ error: 'Project not found' });
        if (String(project.clientId) !== String(clientId)) {
            return res.status(403).json({ error: 'Only the project client can invite freelancers' });
        }
        if (project.status !== 'open') {
            return res.status(400).json({ error: 'Project is not open for applications' });
        }

        const existing = await Invitation.findOne({ projectId, freelancerId });
        if (existing) return res.status(201).json(existing);

        const invitation = await Invitation.create({ projectId, clientId, freelancerId });

        try {
            const projectTitle = (project as any).title || 'a project';
            await Notification.create({
                userId: freelancerId,
                title: 'Invitation to apply',
                message: `You were invited to apply for "${projectTitle}". Click to view the project and submit your proposal.`,
                type: 'invitation_to_apply',
                relatedId: projectId,
            });
        } catch {
            // ignore notification errors
        }

        res.status(201).json(invitation);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// list invitations for a freelancer (projects they were invited to)
router.get('/freelancer/:freelancerId', async (req, res) => {
    try {
        const invitations = await Invitation.find({ freelancerId: req.params.freelancerId })
            .populate('projectId', 'title status')
            .populate('clientId', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json(invitations);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// list invited freelancers for a project (for client)
router.get('/project/:projectId', async (req, res) => {
    try {
        const invitations = await Invitation.find({ projectId: req.params.projectId })
            .populate('freelancerId', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.json(invitations);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
