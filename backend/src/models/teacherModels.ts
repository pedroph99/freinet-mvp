import prisma from "../lib/prisma";
import bcrypt from "bcrypt";

export const getAllTeachers = async () => {
    const teachers = await prisma.teacherProfile.findMany({
        include: {
            person: {
                include: {
                    user: true
                }
            }
        }
    });
    return teachers;
}

export const getTeacherById = async (teacherId: number) => {
    const teacher = await prisma.teacherProfile.findUnique({
        where: { id: teacherId },
        include: {
            person: {
                include: {
                    user: true
                }
            },
            classes: {
                include: {
                    students: {
                        include: {
                            student: {
                                include: {
                                    person: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    return teacher;
}

export const createTeacher = async (data: any) => {
    return await prisma.$transaction(async (tx) => {
        const person = await tx.person.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                cpf: data.cpf,
                birthDate: data.birthDate ? new Date(data.birthDate) : null,
            }
        });

        const teacher = await tx.teacherProfile.create({
            data: {
                personId: person.id,
                specialization: data.specialization,
            }
        });

        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        const user = await tx.user.create({
            data: {
                personId: person.id,
                email: data.email,
                password: hashedPassword,
                role: "TEACHER"
            }
        });

        return await tx.teacherProfile.findUnique({
            where: { id: teacher.id },
            include: {
                person: {
                    include: {
                        user: true
                    }
                }
            }
        });
    });
}

export const updateTeacher = async (teacherId: number, data: any) => {
    return await prisma.$transaction(async (tx) => {
        const teacher = await tx.teacherProfile.findUnique({
            where: { id: teacherId }
        });

        if (!teacher) {
            throw new Error("Teacher not found");
        }

        if (data.name || data.email || data.phone) {
            await tx.person.update({
                where: { id: teacher.personId },
                data: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                }
            });
        }

        const updatedTeacher = await tx.teacherProfile.update({
            where: { id: teacherId },
            data: {
                specialization: data.specialization,
            },
            include: {
                person: {
                    include: {
                        user: true
                    }
                }
            }
        });

        return updatedTeacher;
    });
}

export const deleteTeacher = async (teacherId: number) => {
    const teacher = await prisma.teacherProfile.findUnique({
        where: { id: teacherId }
    });

    if (!teacher) {
        throw new Error("Teacher not found");
    }

    await prisma.person.delete({
        where: { id: teacher.personId }
    });

    return { message: "Teacher deleted successfully" };
}

// Buscar todos os alunos únicos que estão em turmas do professor
export const getStudentsByTeacherId = async (teacherId: number) => {
    return await prisma.studentProfile.findMany({
        where: {
            classEnrollments: {
                some: {
                    class: {
                        teacherId
                    }
                }
            }
        },
        include: {
            person: true,
            classEnrollments: {
                where: {
                    class: { teacherId }
                },
                include: {
                    class: {
                        select: {
                            id: true,
                            name: true,
                            schedule: true
                        }
                    }
                }
            }
        },
        orderBy: {
            person: {
                name: 'asc'
            }
        }
    });
}