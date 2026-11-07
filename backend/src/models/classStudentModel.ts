import prisma from '../lib/prisma';



export const isStudentEnrolled = async (classId: number, studentId: number) => {
    const enrollment = await prisma.classStudent.findFirst({
        where: { classId, studentId }
    });
    return !!enrollment;
}

export const enrollStudent = async (classId: number, studentId: number) => {
    return await prisma.classStudent.create({
        data: { classId, studentId },
        include: {
            student: {
                include: { person: true }
            },
            class: true
        }
    });
}

export const removeStudent = async (classId: number, studentId: number) => {
    return await prisma.classStudent.deleteMany({
        where: { classId, studentId }
    });
}

export const getClassStudents = async (classId: number) => {
    return await prisma.classStudent.findMany({
        where: { classId },
        include: {
            student: {
                include: { person: true }
            }
        },
        orderBy: { enrolledAt: 'asc' }
    });
}

