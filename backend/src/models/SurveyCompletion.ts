import { Schema, model } from "mongoose";
import { TimestampedDocument } from "./User";
import { SurveryDocument } from "./Survey";
import { SurveyQuestionAnswerDocument } from "./SurveyQuestionAnswer";

export type SurveyCompletionDocument = TimestampedDocument & {
    uuid: string;
    name: string;
    email: string;
    survey: SurveryDocument;
    surveyQuestionsAnswers: SurveyQuestionAnswerDocument[];
};

const surveyCompletionSchema = new Schema({
    uuid: String,
    name: String,
    email: String,
    survey: {
        type: Schema.Types.ObjectId,
        ref: 'Survey'
    },
    surveyQuestionsAnswers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'SurveyQuestionAnswer'
        }
    ]
}, { timestamps: true });

export const SurveyCompletion = model<SurveyCompletionDocument>('SurveyCompletion', surveyCompletionSchema);