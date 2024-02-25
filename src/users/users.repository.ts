import { prisma } from '../db';

const findUser = async () => {
    const users = await prisma.users.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            address: true
        }
    })

    return users
}

const findUserByEmail = async (email: any) => {
    const user = await prisma.users.findUnique({
        where: {
            email: email
        }
    })

    return user
}

const insertUser = async (newUser: { name: any; email: any; password: any; }) => {
    const result = await prisma.users.create({
        data: {
            name: newUser.name,
            email: newUser.email,
            password: newUser.password
        }
    })

    return result
}

const editUser = async (email: any, userData: { name: any; address: any; }) => {
    const user = await prisma.users.update({
        data: {
            name: userData.name,
            address: userData.address
        },

        where: {
            email: email
        }
    })

    return user
}

const deleteUser = async (email: any) => {
    const user = await prisma.users.delete({
        where: {
            email:email
        }
    })

    return user
}

export { findUser, findUserByEmail, insertUser, editUser, deleteUser }