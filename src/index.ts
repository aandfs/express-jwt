import express, { NextFunction, Request, Response } from 'express';
import { userController } from './users/users.controller';

const app = express();
const PORT = 5000;

app.use(express.json())

app.use('/users', userController);

app.listen(PORT, () => {
    console.log(`Server running in PORT: ${PORT}`);
})
