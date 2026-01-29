import { Schema, model } from 'mongoose';

const ProfileSchema = new Schema({
    bio: String,
    skills: [String],
    experience: String,
    location: String,
    rating: { type: Number, default: 0 }
});

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userType: { type: String, enum: ['freelancer', 'client'], required: true },
    profile: { type: ProfileSchema, default: {} }
}, { timestamps: true });

export const User = model('User', UserSchema);
