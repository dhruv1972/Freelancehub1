import { Schema, model, Types } from 'mongoose';

const MessageSchema = new Schema({
    senderId: { type: Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Types.ObjectId, ref: 'User', required: true },
    projectId: { type: Types.ObjectId, ref: 'Project' },
    content: { type: String, required: true },
    attachments: [String],
    read: { type: Boolean, default: false }
}, { timestamps: true });

export const Message = model('Message', MessageSchema);

