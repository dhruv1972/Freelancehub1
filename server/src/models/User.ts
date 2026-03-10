import { Schema, model } from 'mongoose';

const ProfileSchema = new Schema({
    bio: String,
    skills: [String],
    experience: String,
    location: String,
    rating: { type: Number, default: 0 },
    resume: String,      // data URL (base64) for freelancer resume
    resumeFileName: String,  // original filename for download
    portfolio: [
        {
            title: String,
            description: String,
            link: String
        }
    ]
});

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userType: { type: String, enum: ['freelancer', 'client'], required: true },
    isAdmin: { type: Boolean, default: false },
    status: { type: String, default: 'active' },
    profile: { type: ProfileSchema, default: {} }
}, { timestamps: true });

export const User = model('User', UserSchema);
