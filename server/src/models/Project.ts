import { Schema, model, Types } from 'mongoose';

const MilestoneSchema = new Schema({
    title: { type: String, required: true },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    dueDate: { type: Date }
}, { _id: true });

const ProjectSchema = new Schema({
    clientId: { type: Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    budget: { type: Number, required: true },
    timeline: { type: String, required: true },
    location: { type: String },
    status: { type: String, enum: ['open', 'in-progress', 'completed'], default: 'open' },
    selectedFreelancer: { type: Types.ObjectId, ref: 'User' },
    requirements: [String],
    milestones: [MilestoneSchema]
}, { timestamps: true });

export const Project = model('Project', ProjectSchema);
