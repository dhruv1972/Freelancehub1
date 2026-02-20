import { Schema, model, Types } from 'mongoose';

const NotificationSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['proposal_received', 'proposal_accepted', 'proposal_rejected', 'payment_received', 'project_completed', 'message_received'],
        required: true 
    },
    relatedId: { type: Types.ObjectId },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

export const Notification = model('Notification', NotificationSchema);

