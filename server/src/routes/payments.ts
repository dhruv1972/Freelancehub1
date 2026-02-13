import { Router } from 'express';

const router = Router();

// create payment intent (Stripe)
router.post('/intent', async (req, res) => {
    try {
        // TODO: integrate Stripe when keys are ready
        const { amount, description } = req.body;
        
        // for now return a mock response
        res.json({
            client_secret: 'mock_secret_' + Date.now(),
            amount,
            description,
            status: 'pending'
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

