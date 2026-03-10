import { Schema, model, Types } from 'mongoose';

const InvitationSchema = new Schema({
    projectId: { type: Types.ObjectId, ref: 'Project', required: true },
    clientId: { type: Types.ObjectId, ref: 'User', required: true },
    freelancerId: { type: Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

InvitationSchema.index({ projectId: 1, freelancerId: 1 }, { unique: true });

export const Invitation = model('Invitation', InvitationSchema);
