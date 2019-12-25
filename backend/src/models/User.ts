import { Schema, model, Document } from "mongoose";
import { SurveryDocument } from "./Survey";

export type TimestampedDocument = { createdAt: Date, updatedAt: Date } & Document;

export type UserDocument = TimestampedDocument & {
    email: string;
    password: string;
    token: string;
    role: 'admin' | 'client'
    surveys: SurveryDocument[];
};

const userSchema = new Schema({
    email: String,
    password: String,
    token: String,
    role: {
        type: String,
        enum: ['admin', 'client'],
    },
    surveys: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Survey'
        }
    ]
}, { timestamps: true });

export const User = model<UserDocument>('User', userSchema);