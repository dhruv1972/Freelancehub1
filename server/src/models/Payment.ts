import { Schema, model, Types } from 'mongoose';

const PaymentSchema = new Schema({
    projectId: { type: Types.ObjectId, ref: 'Project', required: true },
    clientId: { type: Types.ObjectId, ref: 'User', required: true },
    freelancerId: { type: Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true }, // in cents
    stripePaymentIntentId: { type: String },
    status: { type: String, enum: ['pending', 'succeeded', 'failed'], default: 'pending' }
}, { timestamps: true });

export const Payment = model('Payment', PaymentSchema);
