import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import * as _ from 'lodash';
import { Types } from 'mongoose';

import { Survey } from "../models/Survey";
import { SurveyQuestion, SurveryQuestionDocument } from "../models/SurveyQuestion";

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
        if (!id) {
            return res.status(400).send({ error: 'Invalid id format' });
        }

        const survey = await Survey.findOne({ _id: id, active: true }).populate('surveyQuestions');
        if (!survey) {
            return res.status(404).send({ error: 'Survey not found' });
        }

        return res.send(survey);
    } catch (ex) {
        return next(ex);
    }
}