import { Schema, model, Types } from 'mongoose';

const SavedJobSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    projectId: { type: Types.ObjectId, ref: 'Project', required: true },
}, { timestamps: true });

SavedJobSchema.index({ userId: 1, projectId: 1 }, { unique: true });

export const SavedJob = model('SavedJob', SavedJobSchema);
