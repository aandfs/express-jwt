import express, { NextFunction, Request, Response } from 'express';
import bcrypt from "bcrypt";
import { createUser, deleteProductById, getUserById, editProductById, accessValidation, getToken } from './users.service';
import { UserDataJWT } from '../helper/user.interface';

const userController = express.Router();

//register
userController.post('/register', async (req, res) => {
    try {
        const newUser = req.body;

        if (
            !(
                newUser.name &&
                newUser.email &&
                newUser.password
            )) {
            return res.status(400).json({
                message: 'Some fields are missing'
            })
        }

        const checkUser = await getUserById(newUser.email);

        if (checkUser) {
            return res.status(409).json({
                message: 'User already exists'
            })
        }

        const result = await createUser(newUser);
        res.json({
            message: 'User Created'
        })
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error'
        });
    }
})

//login
userController.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await getUserById(email);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        if (!user.password) {
            return res.status(404).json({
                message: 'Password not set'
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (isPasswordValid) {
            const token = getToken(user);

            return res.json({
                data: {
                    id: user.id,
                    name: user.name,
                    address: user.address
                },
                token: token
            })
        } else {
            return res.status(403).json({
                message: 'Wrong Password'
            })
        };
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error'
        });
    }
})

//read
userController.get('/', accessValidation, async (req: UserDataJWT, res) => {
    try {
        const email = req.userData?.email;
        const result = await getUserById(email);

        if (!result) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json({
            data: result,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});


//update
userController.patch('/', accessValidation, async (req: UserDataJWT, res) => {
    try {
        const user = req.body;
        const email = req.userData?.email;
        const checkUser = await getUserById(email);

        if (!checkUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const result = await editProductById(email, user);

        res.json({
            data: result,
            message: 'User updated successfully'
        })
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error'
        });
    }
})

//delete
userController.delete('/', accessValidation, async (req: UserDataJWT, res) => {
    try {
        const email = req.userData?.email;
        const checkUser = await getUserById(email);

        if (!checkUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const result = await deleteProductById(email);

        res.json({
            message: `${email} deleted successfully`
        })
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error'
        });
    }
})

export { userController };