import prisma from "../lib/prisma";


export const getAllStudents = async () => {
    const students = await prisma.studentProfile.findMany({
        include: {
            person: {
                include: {
                    user: true
                }
            }
        }
    });
    return students;
}

export const getStudentById = async (studentId: number) => {
    const student = await prisma.studentProfile.findUnique({
        where: { id: studentId },
        include: {
            person: {
                include: {
                    user: true
                }
            },
            attendances: {
                include: {
                    lesson: {
                        include: {
                            class: true
                        }
                    }
                }
            }
        }
    });
    return student;
}

// Criar aluno (Person + StudentProfile) - SEM LOGIN
export const createStudent = async (data: any) => {
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

        const student = await tx.studentProfile.create({
            data: {
                personId: person.id,
                registrationNumber: data.registrationNumber,
                photo: data.photo,
                responsibleName: data.responsibleName,
                responsiblePhone: data.responsiblePhone,
                emergencyContact: data.emergencyContact,
            },
            include: {
                person: true
            }
        });

        return student;
    });
}

export const updateStudent = async (studentId: number, data: any) => {
    return await prisma.$transaction(async (tx) => {
        const student = await tx.studentProfile.findUnique({
            where: { id: studentId }
        });

        if (!student) {
            throw new Error("Student not found");
        }
        if (data.name || data.email || data.phone) {
            await tx.person.update({
                where: { id: student.personId },
                data: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                }
            });
        }

        const updatedStudent = await tx.studentProfile.update({
            where: { id: studentId },
            data: {
                photo: data.photo,
                responsibleName: data.responsibleName,
                responsiblePhone: data.responsiblePhone,
                emergencyContact: data.emergencyContact,
                status: data.status,
            },
            include: {
                person: {
                    include: {
                        user: true
                    }
                }
            }
        });

        return updatedStudent;
    });
}

export const deleteStudent = async (studentId: number) => {
    const student = await prisma.studentProfile.findUnique({
        where: { id: studentId }
    });

    if (!student) {
        throw new Error("Student not found");
    }

    await prisma.person.delete({
        where: { id: student.personId }
    });

    return { message: "Student deleted successfully" };
}


export const activateStudentAccess = async (studentId: number, data: any) => {
    return await prisma.$transaction(async (tx) => {
        const student = await tx.studentProfile.findUnique({
            where: { id: studentId },
            include: {
                person: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!student) {
            throw new Error("Student not found");
        }

        if (student.person.user) {
            throw new Error("Student already has login access");
        }

        await tx.person.update({
            where: { id: student.personId },
            data: { email: data.email }
        });

        const user = await tx.user.create({
            data: {
                personId: student.personId,
                email: data.email,
                password: data.password,
                role: "STUDENT"
            }
        });

        return user;
    });
}
