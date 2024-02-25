import { prisma } from '../db';
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from 'jsonwebtoken';
import express, { NextFunction, Request, Response } from 'express';
import { deleteUser, editUser, findUser, findUserByEmail, insertUser } from './users.repository';
import { UserDataJWT, UserData } from '../helper/user.interface';


const accessValidation = (req: Request, res: Response, next: NextFunction) => {
    const validationReq = req as UserDataJWT
    const { authorization } = validationReq.headers;
    
    if (!authorization) {
        return res.status(401).json({
            message: 'Token diperlukan'
        })
    }
    const token = authorization.split(' ')[1];
    const secret = process.env.JWT_SECRET!;
    
    try {
        const jwtDecode = jwt.verify(token, secret);
        if (typeof jwtDecode !== 'string') {
            validationReq.userData = jwtDecode as UserData
        }
    } catch (err) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }

    next()
}

const getToken = (user: UserData) => {
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
    }

    const secret = process.env.JWT_SECRET!;
    const expiresIn = 60 * 60 * 1;
    const token = jwt.sign(payload, secret, { expiresIn: expiresIn })

    return token
}

const getUser = async () => {
    const users = await findUser();

    return users
}

const getUserById = async (email: any) => {
    const user = await findUserByEmail(email);

    return user
}

const createUser = async (newUser: { name: any; email: any; password: any; }) => {
    newUser.password = await bcrypt.hash(newUser.password, 10);
    const user = await insertUser(newUser)

    return user
}

const editProductById = async (email: any, userData: { name: any;  address: any; }) => {
    const user = await editUser(email, userData)

    return user
}

const deleteProductById = async (email: any) => {
    const user = await deleteUser(email)
    
    return user
}

export { createUser, getUserById, getUser, editProductById, deleteProductById, accessValidation, getToken }