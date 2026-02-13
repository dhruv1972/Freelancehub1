import { Schema, model, Types } from 'mongoose';

const ReviewSchema = new Schema({
    projectId: { type: Types.ObjectId, ref: 'Project', required: true },
    reviewerId: { type: Types.ObjectId, ref: 'User', required: true },
    revieweeId: { type: Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    reviewType: { type: String, enum: ['client-to-freelancer', 'freelancer-to-client'], required: true }
}, { timestamps: true });

export const Review = model('Review', ReviewSchema);

