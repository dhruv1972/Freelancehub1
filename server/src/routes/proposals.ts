import { Router } from 'express';
import { Proposal } from '../models/Proposal';
import { Project } from '../models/Project';
import { User } from '../models/User';

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

        // update project status
        await Project.findByIdAndUpdate(proposal.projectId, {
            status: 'in-progress',
            selectedFreelancer: proposal.freelancerId
        });

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

export default router;

