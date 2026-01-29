import { Router } from 'express';
import { Project } from '../models/Project';
import { User } from '../models/User';

const router = Router();

// create project
router.post('/', async (req, res) => {
    try {
        const { clientId, title, description, category, budget, timeline, requirements } = req.body;
        
        const project = await Project.create({
            clientId,
            title,
            description,
            category,
            budget,
            timeline,
            requirements
        });

        res.status(201).json(project);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// get all projects (with search)
router.get('/', async (req, res) => {
    try {
        const { q, category, minBudget, maxBudget } = req.query;
        
        let filter: any = { status: 'open' };

        // search by title or description
        if (q) {
            filter.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ];
        }

        // filter by category
        if (category) {
            filter.category = category;
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

export default router;

