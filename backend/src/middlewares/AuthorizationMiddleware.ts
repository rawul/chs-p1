import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";

export const authorizationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.header('authorization');
    if (!authToken) {
        return res.status(403).send({ error: 'Invalid authorization' });
    }

    const user = await User.findOne({ token: authToken });
    if (!user) {
        return res.status(403).send({ error: 'Invalid authorization' });
    }

    res.locals.user = user;
    return next();
}