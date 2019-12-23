import { Schema, model, Document } from "mongoose";

export type UserDocument = Document & {
    email: string;
    password: string;
    token: string;
    role: 'admin' | 'client'
};

const userSchema = new Schema({
    email: String,
    password: String,
    token: String,
    role: {
        type: String,
        enum: ['admin', 'client'],
    }
});

export const User = model<UserDocument>('User', userSchema);