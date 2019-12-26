import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import * as _ from 'lodash';
import { Types } from 'mongoose';

import { Survey } from "../models/Survey";
import { SurveyQuestion, SurveryQuestionDocument } from "../models/SurveyQuestion";
import { SurveyCompletion } from "../models/SurveyCompletion";
import { SurveyQuestionAnswer } from "../models/SurveyQuestionAnswer";

export const postCreateSurvey = async (req: Request, res: Response) => {
    await check('name').not().isEmpty().run(req);
    await check('active').optional().isBoolean().run(req);
    await check('questions.*.question').not().isEmpty().run(req);
    await check('questions.*.type').isIn(['Open', 'SingleChoice', 'MultipleChoice']).run(req);
    await check('questions.*.choices').custom((choices, { req, location, path }) => {
        const index = _.toPath(path)[1];
        const type = req[location].questions[index].type;
        if (type === 'Open' && _.isArray(choices)) {
            throw new Error('Open questions cannot have choices')
        } else if ((type === 'SingleChoice' || type === 'MultipleChoice') && !_.isArray(choices)) {
            throw new Error(`${type} questions need to have choices`);
        }
        return true;
    }).run(req)

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(errors);
    }

    const survey = new Survey({
        name: req.body.name,
        description: req.body.description,
        active: req.body.active || true,
        user: res.locals.user
    });

    const surveyQuestions = req.body.questions
        .map((question): SurveryQuestionDocument => {
            let q = new SurveyQuestion({
                question: question.question,
                survey: survey,
                type: question.type,
            });
            if (question.choices) {
                q.choices = question.choices
            }
            q.save();
            return q;
        });

    survey.surveyQuestions = surveyQuestions;
    survey.save();

    return res.send({ success: true });
}

export const getSurvey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Types.ObjectId(req.params.id);

        const survey = await Survey.findOne({ _id: id, active: true }).populate('surveyQuestions');
        if (!survey) {
            return res.status(404).send({ error: 'Survey not found' });
        }

        return res.send(survey);
    } catch (ex) {
        return next(ex);
    }
}

export const getUserSurveys = async (req: Request, res: Response) => {
    const surveys = await Survey.find({ user: res.locals.user }).populate('surveyQuestions');

    return res.send(surveys);
}

export const postAnswers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Types.ObjectId(req.params.id);

        const survey = await Survey.findOne({ active: true, _id: id }).populate('surveyQuestions');
        if (!survey) {
            return res.status(404).send({ error: "No survey found" });
        }

        await check('name').notEmpty().run(req);
        await check('email').isEmail().notEmpty().run(req);

        await check('answers.*.value').notEmpty().run(req);
        await check('answers.*._id').notEmpty().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send(errors);
        }

        let surveyCompletion = new SurveyCompletion({
            name: req.body.name,
            email: req.body.email
        });

        let surveyQuestionsAnswers = [];
        for (let question of survey.surveyQuestions) {
            const answer = req.body.answers.find(a => a._id === question._id.toString());
            if (!answer) {
                return res.status(400).send({ error: `Question ${question._id} was not answered !` });
            }

            if (question.type === 'MultipleChoice' && !_.isArray(answer.value)) {
                return res.status(400).send({ error: `Question ${question._id} has an array answers !` });
            } else if (question.type !== 'MultipleChoice' && _.isArray(answer.value)) {
                return res.status(400).send({ error: `Question ${question._id} has a single value as answer !` });
            }

            if (
                (question.type === 'MultipleChoice' && !answer.value.every(v => question.choices.find(c => c === v))) ||
                (question.type === 'SingleChoice' && !question.choices.find(c => c === answer.value))
            ) {
                return res.status(400).send({ error: `Question ${question._id} has invalid choices !` });
            }

            surveyQuestionsAnswers.push(
                new SurveyQuestionAnswer({
                    value: answer.value,
                    surveyQuestion: answer._id,
                    surveyCompletion: surveyCompletion
                })
            );
        }

        if (surveyQuestionsAnswers.length === 0) {
            throw new Error('Invalid question answers');
        }

        surveyCompletion.surveyQuestionsAnswers = surveyQuestionsAnswers;
        await surveyCompletion.save();
        surveyQuestionsAnswers.forEach(s => s.save());

        return res.send({ success: true })
    } catch (ex) {
        return next(ex);
    }
}