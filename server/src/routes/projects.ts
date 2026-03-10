import { Router } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project';
import { Proposal } from '../models/Proposal';
import { User } from '../models/User';
import { Notification } from '../models/Notification';

const router = Router();

// create project
router.post('/', async (req, res) => {
    try {
        const { clientId, title, description, category, budget, timeline, requirements, location } = req.body;

        const project = await Project.create({
            clientId,
            title,
            description,
            category,
            budget,
            timeline,
            requirements,
            location
        });

        // create notification for client
        try {
            await Notification.create({
                userId: clientId,
                title: 'Project posted successfully',
                message: `Your project "${title}" was posted successfully.`,
                type: 'project_posted',
                relatedId: project._id,
            });
        } catch {
            // ignore notification errors so project creation still succeeds
        }

        res.status(201).json(project);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// get projects belonging to current user (client: posted projects, freelancer: accepted projects)
router.get('/my', async (req, res) => {
    try {
        const emailHeader = req.headers['x-user-email'];
        const email = Array.isArray(emailHeader) ? emailHeader[0] : emailHeader;

        if (!email) {
            return res.status(400).json({ error: 'User email header is missing' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.userType === 'client') {
            const projects = await Project.find({ clientId: user._id })
                .populate('clientId', 'firstName lastName email')
                .sort({ createdAt: -1 });
            return res.json(projects);
        }

        // freelancer: projects where selectedFreelancer = user, OR where they have an accepted proposal (fallback)
        const userId = new mongoose.Types.ObjectId(String(user._id));
        const bySelected = await Project.find({ selectedFreelancer: userId })
            .populate('clientId', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .lean();

        const acceptedProposals = await Proposal.find({ freelancerId: userId, status: 'accepted' })
            .select('projectId')
            .lean();
        const projectIdsFromProposals = acceptedProposals
            .map((p: any) => p.projectId)
            .filter(Boolean);

        if (projectIdsFromProposals.length === 0) {
            return res.json(bySelected);
        }

        const byProposals = await Project.find({ _id: { $in: projectIdsFromProposals } })
            .populate('clientId', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .lean();

        // merge and dedupe by _id, and backfill selectedFreelancer on any project that was missing it
        const seen = new Set(bySelected.map((p: any) => String(p._id)));
        const merged = [...bySelected];
        for (const p of byProposals) {
            const idStr = String(p._id);
            if (seen.has(idStr)) continue;
            seen.add(idStr);
            merged.push(p);
            if (!p.selectedFreelancer) {
                await Project.findByIdAndUpdate(p._id, { selectedFreelancer: userId, status: 'in-progress' });
            }
        }
        merged.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        res.json(merged);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// get all projects (with search)
router.get('/', async (req, res) => {
    try {
        const { q, category, minBudget, maxBudget, skills } = req.query;
        
        let filter: any = { status: 'open' };

        // search by title or description
        if (q) {
            filter.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ];
        }

        // filter by category (case-insensitive so "Mobile Apps" matches "mobile apps" etc.)
        if (category) {
            filter.category = { $regex: new RegExp('^' + String(category).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') };
        }

        // filter by required skills (comma separated)
        if (skills) {
            const skillList = String(skills)
                .split(',')
                .map(s => s.trim())
                .filter(Boolean);
            if (skillList.length > 0) {
                // match projects that require ALL of the provided skills
                filter.requirements = { $all: skillList };
            }
        }

        // filter by budget range
        if (minBudget || maxBudget) {
            filter.budget = {};
            if (minBudget) filter.budget.$gte = Number(minBudget);
            if (maxBudget) filter.budget.$lte = Number(maxBudget);
        }

        const projects = await Project.find(filter)
            .populate('clientId', 'firstName lastName')
            .sort({ createdAt: -1 });

        res.json(projects);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// get single project
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('clientId', 'firstName lastName email');
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// update project (e.g. status) – client or assigned freelancer only
router.put('/:id', async (req, res) => {
    try {
        const emailHeader = req.headers['x-user-email'];
        const email = Array.isArray(emailHeader) ? emailHeader[0] : emailHeader;
        if (!email) {
            return res.status(400).json({ error: 'User email header is missing' });
        }
        const currentUser = await User.findOne({ email });
        if (!currentUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const isClient = String(project.clientId) === String(currentUser._id);
        const isFreelancer = project.selectedFreelancer && String(project.selectedFreelancer) === String(currentUser._id);
        if (!isClient && !isFreelancer) {
            return res.status(403).json({ error: 'Only the client or assigned freelancer can update this project' });
        }

        const { status, milestones } = req.body;
        if (status !== undefined) {
            if (!['open', 'in-progress', 'completed'].includes(status)) {
                return res.status(400).json({ error: 'Invalid status' });
            }
            project.status = status;
        }
        if (milestones !== undefined) {
            if (!Array.isArray(milestones)) {
                return res.status(400).json({ error: 'milestones must be an array' });
            }
            const mapped = milestones.map((m: any) => ({
                _id: m._id,
                title: typeof m.title === 'string' ? m.title : 'Milestone',
                status: ['pending', 'in-progress', 'completed'].includes(m.status) ? m.status : 'pending',
                dueDate: m.dueDate ? new Date(m.dueDate) : undefined
            }));
            project.set('milestones', mapped);
        }

        await project.save();
        const updated = await Project.findById(project._id).populate('clientId', 'firstName lastName email');
        res.json(updated);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

