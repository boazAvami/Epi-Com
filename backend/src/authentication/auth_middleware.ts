import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

type Payload = {
    _id: string;
};

export default (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header('Authorization');
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
        res.status(401).send('Access Denied');
        return;
    }
    if (!process.env.ACCESS_TOKEN_SECRET) {
        res.status(500).send('Server Error');
        return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.status(401).send('Access Denied');
            return;
        }
        (req as any).user = { _id: (payload as any)._id }; // ✅ Store user in req.user
        
        next();
    });
};