import { Router } from 'express';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import { Payment } from '../models/Payment';
import { Project } from '../models/Project';
import { Notification } from '../models/Notification';

const router = Router();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

// create payment intent (client pays freelancer for a project)
router.post('/intent', async (req, res) => {
    try {
        const { projectId, amount, clientId } = req.body;
        if (!projectId || amount == null || amount <= 0 || !clientId) {
            return res.status(400).json({ error: 'Missing or invalid projectId, amount, or clientId' });
        }

        const project = await Project.findById(projectId)
            .populate('clientId', '_id')
            .populate('selectedFreelancer', '_id');
        if (!project) return res.status(404).json({ error: 'Project not found' });
        const projectClientId = (project.clientId as any)?._id ?? project.clientId;
        if (String(projectClientId) !== String(clientId)) {
            return res.status(403).json({ error: 'Only the project client can create a payment' });
        }
        const freelancerId = (project.selectedFreelancer as any)?._id ?? project.selectedFreelancer;
        if (!freelancerId) return res.status(400).json({ error: 'Project has no assigned freelancer' });

        const amountDollars = Number(amount);
        if (!Number.isFinite(amountDollars) || amountDollars < 0.5) return res.status(400).json({ error: 'Minimum payment is $0.50' });
        const amountCentsClamped = Math.min(Math.max(Math.round(amountDollars * 100), 50), 99999999);

        if (stripe) {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amountCentsClamped,
                currency: 'usd',
                automatic_payment_methods: { enabled: true },
                metadata: { projectId: String(projectId), clientId: String(clientId), freelancerId: String(freelancerId) },
            });

            const payment = await Payment.create({
                projectId,
                clientId,
                freelancerId,
                amount: amountCentsClamped,
                stripePaymentIntentId: paymentIntent.id,
                status: 'pending',
            });

            return res.json({
                client_secret: paymentIntent.client_secret,
                paymentId: payment._id,
                paymentIntentId: paymentIntent.id,
            });
        }

        // mock when Stripe is not configured
        const payment = await Payment.create({
            projectId,
            clientId,
            freelancerId,
            amount: amountCentsClamped,
            stripePaymentIntentId: 'mock_pi_' + Date.now(),
            status: 'pending',
        });
        res.json({
            client_secret: 'mock_secret_' + Date.now(),
            paymentId: payment._id,
            paymentIntentId: payment.stripePaymentIntentId,
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Payment intent failed' });
    }
});

// confirm payment after client successfully pays (Stripe.js confirmCardPayment)
router.post('/confirm', async (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        if (!paymentIntentId) return res.status(400).json({ error: 'Missing paymentIntentId' });

        const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
        if (!payment) return res.status(404).json({ error: 'Payment not found' });
        if (payment.status === 'succeeded') return res.json({ payment, message: 'Already confirmed' });

        if (stripe) {
            const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
            if (pi.status !== 'succeeded') {
                return res.status(400).json({ error: 'Payment has not succeeded yet' });
            }
        }

        payment.status = 'succeeded';
        await payment.save();

        try {
            const project = await Project.findById(payment.projectId).select('title').lean();
            const title = project?.title || 'a project';
            await Notification.create({
                userId: payment.freelancerId,
                title: 'Payment received',
                message: `You received a payment of $${(payment.amount / 100).toFixed(2)} for "${title}".`,
                type: 'payment_received',
                relatedId: payment.projectId,
            });
        } catch {
            // ignore notification errors
        }

        res.json({ payment });
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Confirm failed' });
    }
});

// list payments for a project (so client UI can show "Paid" or allow payment)
router.get('/project/:projectId', async (req, res) => {
    try {
        const payments = await Payment.find({ projectId: req.params.projectId })
            .sort({ createdAt: -1 });
        res.json(payments);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
