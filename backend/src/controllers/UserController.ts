import { Request, Response } from "express";
import { check, validationResult } from 'express-validator';

import { User } from "../models/User";
import { compare, hash } from "../utils/Crypto";

const uuid = require('uuid/v4');


export const postLogin = async (req: Request, res: Response) => {
    await check('email', 'Invalid Email').isEmail().run(req);
    await check('password', 'Password cannot be blank').isLength({ min: 1 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(errors);
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send({ error: 'Invalid credentials' })
    }

    const passwordsMatch = await compare(req.body.password, user.password);
    if (!passwordsMatch) {
        return res.status(400).send({ error: 'Invalid credentials' })
    }

    user.token = uuid();
    await user.save();

    return res.send({ token: user.token, email: user.email, role: user.role });
}

export const postCreateClient = async (req: Request, res: Response) => {
    await check('email', 'Invalid Email').isEmail().run(req);
    await check('password', 'Password cannot be blank').isLength({ min: 1 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(errors);
    }

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
        return res.status(400).send({ error: 'Client with email already existent' });
    }

    const user = await User.create({
        email: req.body.email,
        password: await hash(req.body.password),
        role: 'client'
    });

    return res.send({
        email: user.email,
        _id: user._id
    });
}

export const deleteClient = async (req: Request, res: Response) => {
    const user = await User.findOneAndDelete({ email: req.body.email, role: 'client' });
    if (!user) {
        return res.status(400).send({ error: 'Client with email not existent' });
    }

    return res.send({ success: true });
}