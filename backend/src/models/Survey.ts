import { Schema, model, Document } from "mongoose";
import { UserDocument, TimestampedDocument } from "./User";
import { SurveryQuestionDocument } from "./SurveyQuestion";

export type SurveryDocument = TimestampedDocument & {
    active: boolean;
    name: string;
    description: string;
    user: UserDocument;
    surveyQuestions: SurveryQuestionDocument[];
};

const surveySchema = new Schema({
    active: Boolean,
    name: String,
    description: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    surveyQuestions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'SurveyQuestion'
        }
    ]
}, { timestamps: true });

export const Survey = model<SurveryDocument>('Survey', surveySchema);