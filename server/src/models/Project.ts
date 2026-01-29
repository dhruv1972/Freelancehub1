import { Schema, model, Types } from 'mongoose';

const ProjectSchema = new Schema({
    clientId: { type: Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    budget: { type: Number, required: true },
    timeline: { type: String, required: true },
    status: { type: String, enum: ['open', 'in-progress', 'completed'], default: 'open' },
    requirements: [String]
}, { timestamps: true });

export const Project = model('Project', ProjectSchema);
