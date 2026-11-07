import prisma from "../lib/prisma";

export const getUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            person: {
                include: {
                    studentProfile: true,
                    teacherProfile: true
                }
            }
        }
    });
    return user;
}

export const getUserById = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            person: {
                include: {
                    studentProfile: true,
                    teacherProfile: true
                }
            }
        }
    });
    return user;
}

export const updateLastLogin = async (userId: number) => {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            lastLoginAt: new Date()
        }
    });
}

export const getUserByCpf = async (cpf: string) => {
    const user = await prisma.user.findFirst({
        where: {
            person: {
                cpf
            }
        }
    });
    return user;
}