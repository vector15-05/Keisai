import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../DB/connection.db';
import { BadRequestError, UnauthorisedAccess } from '../errors/appErrors';
import { logger } from '../shared/logger';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';


const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_67'
const COOKIE_NAME = 'auth_token';

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * (24 * 60 * 60 * 1000), 
}

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            throw new BadRequestError("Name, email and password are required");
        }

        const normalisedEmail = email.trim().toLowerCase();

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const existingUser = await prisma.user.findUnique({ where: { email: normalisedEmail } });
        if(existingUser){
            throw new BadRequestError("Email already in use");
        }

        const user = await prisma.user.create({
            data: {
                name,
                email: normalisedEmail,
                password: hashedPassword
            }
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.cookie(COOKIE_NAME, token, cookieOptions);
        res.status(201).json({ message: "User registered successfully", user: { id: user.id, name: user.name, email: user.email }, token });
    } catch (error) {
        logger.error(`Error in registerController: ${error}`);
        next(error);
    }
}

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            throw new BadRequestError("Email and password are required");
        }

        const normalisedEmail = email.trim().toLowerCase();

        const user = await prisma.user.findUnique({ where: { email: normalisedEmail } });
        if(!user){
            throw new UnauthorisedAccess("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            throw new UnauthorisedAccess("Invalid email or password");
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.cookie(COOKIE_NAME, token, cookieOptions);
        res.status(200).json({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email }, token });
    } catch (error) {
        logger.error(`Error in loginController: ${error}`);
        next(error);
    }
}

export const logoutController = (req: Request, res: Response, next: NextFunction) => {
    try{
        res.clearCookie(COOKIE_NAME, cookieOptions);
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        logger.error(`Error in logoutController: ${error}`);
        next(error);
    }
}