import { Schema, model, Document } from "mongoose";
import { UserDocument, TimestampedDocument } from "./User";
import { SurveryDocument } from "./Survey";

export type SurveryQuestionDocument = TimestampedDocument & {
    question: string;
    type: 'Open' | 'SingleChoice' | 'MultipleChoice';
    choices?: string[];
    survey: SurveryDocument;
};

const surveyQuestionSchema = new Schema({
    question: String,
    type: {
        type: String,
        enum: ['Open', 'SingleChoice', 'MultipleChoice'],
    },
    chioces: Schema.Types.Array,
    survey: {
        type: Schema.Types.ObjectId,
        ref: 'Survey'
    }
}, { timestamps: true });

export const SurveyQuestion = model<SurveryQuestionDocument>('SurveyQuestion', surveyQuestionSchema);