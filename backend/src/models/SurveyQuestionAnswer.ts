import { Schema, model } from "mongoose";

import { TimestampedDocument } from "./User";
import { SurveryQuestionDocument } from "./SurveyQuestion";
import { SurveyCompletionDocument } from "./SurveyCompletion";

export type SurveyQuestionAnswerDocument = TimestampedDocument & {
    value: string;
    surveyCompletion: SurveyCompletionDocument;
    surveyQuestion: SurveryQuestionDocument;
};

const surveyQuestionAnswerSchema = new Schema({
    value: Schema.Types.Mixed,
    surveyCompletion: {
        type: Schema.Types.ObjectId,
        ref: 'SurveyCompletion'
    },
    surveyQuestion: {
        type: Schema.Types.ObjectId,
        ref: 'SurveyQuestion'
    }
}, { timestamps: true });

export const SurveyQuestionAnswer = model<SurveyQuestionAnswerDocument>('SurveyQuestionAnswer', surveyQuestionAnswerSchema);