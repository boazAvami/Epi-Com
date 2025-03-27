import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IUser, userModel } from '../models/User';
import mongoose, { Document } from 'mongoose';

export const hashPassword = async (password: string) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch {
        throw new Error('Error With Hash Password');
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { password, userName, email, phone_number, allergies, emergencyContacts, firstName, lastName, date_of_birth, profile_picture_uri, gender } = req.body;
        const hashedPassword = await hashPassword(password);
        const user: IUser = await userModel.create({
            email,
            password: hashedPassword,
            userName,
            phone_number,
            allergies: allergies || [],
            emergencyContacts: emergencyContacts || [],
            firstName: firstName || null,
            lastName: lastName || null,
            date_of_birth: date_of_birth || null,
            profile_picture_uri: profile_picture_uri || null,
            gender: gender || '',
        });
        res.status(201).send(user);
    } catch (err: unknown) {
        // Handle duplicate key error (MongoDB unique constraint)
        if (typeof err === "object" && err !== null && "code" in err && (err as any).code === 11000) {
            const field = Object.keys((err as any).keyPattern)[0];

            // Mapping MongoDB field names to human-friendly labels
            const fieldLabels: Record<string, string> = {
                username: "Username",
                email: "Email",
            };

            const prettyField = fieldLabels[field] || field; // Default to field name if not mapped

            res.status(400).json({ message: `${prettyField} already exists` });
            return;
        }

        // Handle Mongoose validation errors
        if (err instanceof mongoose.Error.ValidationError) {
            const errors = Object.values(err.errors).map((e) => (e as mongoose.Error.ValidatorError).message);
            res.status(400).json({ message: errors.join(", ") });
            return;
        }
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
};

type tTokens = {
    accessToken: string;
    refreshToken: string;
};

export const generateToken = (userId: string): tTokens | null => {
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
        return null;
    }
    const random = Math.random().toString();
    const accessToken = jwt.sign(
        { _id: userId, random },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_TOKEN_EXPIRATION as string }
    );

    const refreshToken = jwt.sign(
        { _id: userId, random },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION as string }
    );
    return { accessToken, refreshToken };
};

export const login = async (req: Request, res: Response) => {
    try {
        console.log(req.body)
        const user = await userModel.findOne({ email: req.body.email });
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            res.status(400).send('wrong email or password');
            return;
        }
        if (!process.env.ACCESS_TOKEN_SECRET) {
            res.status(500).send('Server Error');
            return;
        }
        // generate tokens
        const tokens = generateToken(user._id);
        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [tokens.refreshToken];
        } else {
            user.refreshToken.push(tokens.refreshToken);
        }

        await user.save();
        res.status(200).send({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            _id: user._id,
        });
    } catch (err) {
        res.status(400).send(err.message);
    }
};

export type tUser = Document<unknown, object, IUser> &
    IUser &
    Required<{
        _id: string;
    }> & {
        __v: number;
    };

export const verifyRefreshToken = (refreshToken: string | undefined) => {
    return new Promise<tUser>((resolve, reject) => {
        //get refresh token from body
        if (!refreshToken) {
            reject('fail');
            return;
        }
        //verify token
        if (!process.env.REFRESH_TOKEN_SECRET) {
            reject('fail');
            return;
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err: Error, payload: { _id: string }) => {
            if (err) {
                reject('fail');
                return;
            }
            //get the user id fromn token
            const userId = payload._id;

            try {
                //get the user form the db
                const user = await userModel.findById(userId);
                if (!user) {
                    reject('fail');
                    return;
                }

                if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
                    user.refreshToken = [];
                    await user.save();

                    reject('fail');
                    return;
                }
                const tokens = user.refreshToken!.filter((token) => token !== refreshToken);
                user.refreshToken = tokens;

                resolve(user);
            } catch {
                reject('fail');
                return;
            }
        });
    });
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);
        if (!user) {
            res.status(400).send('fail');
            return;
        }   
        const tokens = generateToken(user._id);
        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(200).send({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, _id: user._id });
    } catch {
        res.status(500).send('fail');
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);

        await user.save();
        res.status(200).send('success');
    } catch {
        res.status(400).send('fail');
    }
};