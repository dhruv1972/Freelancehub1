import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import profileRoutes from './routes/profile';
import proposalRoutes from './routes/proposals';
import messageRoutes from './routes/messages';
import timeRoutes from './routes/time';
import reviewRoutes from './routes/reviews';
import adminRoutes from './routes/admin';
import paymentRoutes from './routes/payments';
import notificationRoutes from './routes/notifications';
import freelancerRoutes from './routes/freelancers';

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || '';

// health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/time', timeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/freelancers', freelancerRoutes);

// connect to database and start server
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
