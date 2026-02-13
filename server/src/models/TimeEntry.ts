import { Schema, model, Types } from 'mongoose';

const TimeEntrySchema = new Schema({
    freelancerId: { type: Types.ObjectId, ref: 'User', required: true },
    projectId: { type: Types.ObjectId, ref: 'Project', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    description: { type: String },
    durationMinutes: { type: Number }
}, { timestamps: true });

export const TimeEntry = model('TimeEntry', TimeEntrySchema);

