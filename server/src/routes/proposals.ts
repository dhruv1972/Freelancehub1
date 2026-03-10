import { Router } from 'express';
import mongoose from 'mongoose';
import { Proposal } from '../models/Proposal';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { Notification } from '../models/Notification';

const router = Router();

// submit proposal for a project
router.post('/:projectId', async (req, res) => {
    try {
        const { freelancerId, coverLetter, proposedBudget, timeline } = req.body;

        // check if already applied
        const existing = await Proposal.findOne({
            projectId: req.params.projectId,
            freelancerId
        });
        if (existing) {
            return res.status(400).json({ error: 'You already submitted a proposal' });
        }

        const proposal = await Proposal.create({
            projectId: req.params.projectId,
            freelancerId,
            coverLetter,
            proposedBudget,
            timeline
        });

        // notify project client about new proposal
        try {
            const project = await Project.findById(req.params.projectId).select('clientId title');
            if (project?.clientId) {
                await Notification.create({
                    userId: project.clientId,
                    title: 'New proposal received',
                    message: 'You received a new proposal for your project "' + (project.title || 'Untitled Project') + '".',
                    type: 'proposal_received',
                    relatedId: project._id,
                });
            }
        } catch {
            // ignore notification errors
        }

        res.status(201).json(proposal);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// get proposals for a project (for client)
router.get('/project/:projectId', async (req, res) => {
    try {
        const proposals = await Proposal.find({ projectId: req.params.projectId })
            .populate('freelancerId', 'firstName lastName email profile')
            .sort({ createdAt: -1 });
        res.json(proposals);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// get my proposals (for freelancer)
router.get('/my/:freelancerId', async (req, res) => {
    try {
        const proposals = await Proposal.find({ freelancerId: req.params.freelancerId })
            .populate('projectId', 'title budget status category')
            .sort({ createdAt: -1 });
        res.json(proposals);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// accept proposal
router.post('/:id/accept', async (req, res) => {
    try {
        const proposal = await Proposal.findByIdAndUpdate(
            req.params.id,
            { status: 'accepted' },
            { new: true }
        );
        if (!proposal) {
            return res.status(404).json({ error: 'Proposal not found' });
        }

        // update project: set status and selected freelancer so it appears in freelancer's "My Projects"
        const projectId = new mongoose.Types.ObjectId(String(proposal.projectId));
        const freelancerId = new mongoose.Types.ObjectId(String(proposal.freelancerId));
        await Project.findByIdAndUpdate(projectId, {
            status: 'in-progress',
            selectedFreelancer: freelancerId
        });

        // notify freelancer that their proposal was accepted
        try {
            const project = await Project.findById(projectId).select('title').lean();
            const projectTitle = project?.title || 'the project';
            await Notification.create({
                userId: freelancerId,
                title: 'Proposal accepted',
                message: 'The client approved your proposal for "' + projectTitle + '". You can view and manage it in My Projects.',
                type: 'proposal_accepted',
                relatedId: projectId,
            });
        } catch {
            // ignore notification errors
        }

        res.json(proposal);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// reject proposal
router.post('/:id/reject', async (req, res) => {
    try {
        const proposal = await Proposal.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected' },
            { new: true }
        );
        if (!proposal) {
            return res.status(404).json({ error: 'Proposal not found' });
        }
        res.json(proposal);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// delete / withdraw proposal (freelancer)
router.delete('/:id', async (req, res) => {
    try {
        const { freelancerId } = req.body;
        const proposal = await Proposal.findById(req.params.id);

        if (!proposal) {
            return res.status(404).json({ error: 'Proposal not found' });
        }

        if (String(proposal.freelancerId) !== String(freelancerId)) {
            return res.status(403).json({ error: 'Not authorized to delete this proposal' });
        }

        await Proposal.deleteOne({ _id: proposal._id });
        res.json({ message: 'Proposal withdrawn successfully' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

