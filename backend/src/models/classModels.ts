import prisma from "../lib/prisma";
import {
    ClassResponse,
    CreateClassData,
    UpdateClassData,
} from "../interfaces/classInterface";

export const getAllClasses = async (): Promise<ClassResponse[]> => {
    const classes = await prisma.class.findMany({
        include: {
            teacher: {
                include: {
                    person: true
                }
            },
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
    });
    return classes;
}

export const getClassById = async (classId: number): Promise<ClassResponse | null> => {
    
    const classData = await prisma.class.findUnique({
        where: { id: classId },
        include: {
            teacher: {
                include: {
                    person: true
                }
            },
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
    });
    return  classData;
}

export const createClass = async (classData: CreateClassData): Promise<ClassResponse> => {
    const newClass = await prisma.class.create({
        data: {
            name: classData.name,
            description: classData.description,
            teacherId: classData.teacherId,
            schedule: classData.schedule,
            startDate: classData.startDate ? new Date(classData.startDate) : new Date(),
            endDate: classData.endDate ? new Date(classData.endDate) : null,
        },
        include: {
            teacher: {
                include: {
                    person: true
                }
            },
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
    });
    return newClass;
    
} 

export const updateClass = async (classId: number, classData: UpdateClassData): Promise<ClassResponse> => {
   const updatedClass = await prisma.class.update({
    where: { id: classId },
    data: {
        name: classData.name,
        description: classData.description,
        teacherId: classData.teacherId,
        schedule: classData.schedule,
        startDate: classData.startDate ? new Date(classData.startDate) : undefined,
        endDate: classData.endDate === undefined ? undefined : (classData.endDate ? new Date(classData.endDate) : null),
        isActive: classData.isActive,
    },
    include: {
        teacher: {
            include: {
                person: true
            }
        },
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
   });
   return updatedClass;
}

    export const deleteClass = async (classId: number): Promise<ClassResponse> => {
    const deletedClass = await prisma.class.delete({
        where: { id: classId },
        include: {
            teacher: {
                include: {
                    person: true
                }
            },
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
    });
    return deletedClass;
}

export const getAllClassesByTeacherId = async (teacherId: number): Promise<ClassResponse[]> => {
    const classes = await prisma.class.findMany({
        where: { teacherId },
        include: {
            teacher: {
                include: {
                    person: true
                }
            },
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
    });
    return classes;
}


export const isStudentEnrolled = async (classId: number, studentId: number) => {
    const enrollment = await prisma.classStudent.findFirst({
        where: {
            classId,
            studentId
        }
    });
    return !!enrollment;
}


export const enrollStudent = async (classId: number, studentId: number) => {
    const enrollment = await prisma.classStudent.create({
        data: {
            classId,
            studentId
        },
        include: {
            student: {
                include: {
                    person: true
                }
            },
            class: {
                include: {
                    teacher: {
                        include: {
                            person: true
                        }
                    }
                }
            }
        }
    });
    return enrollment;
}


export const removeStudent = async (classId: number, studentId: number) => {
    const enrollment = await prisma.classStudent.deleteMany({
        where: {
            classId,
            studentId
        }
    });
    return enrollment;
}

export const getClassStudents = async (classId: number) => {
    const enrollments = await prisma.classStudent.findMany({
        where: { classId },
        include: {
            student: {
                include: {
                    person: true
                }
            }
        },
        orderBy: {
            enrolledAt: 'desc'
        }
    });
    return enrollments;
}

export const countEnrolledStudents = async (classId: number) => {
    const count = await prisma.classStudent.count({
        where: { classId }
    });
    return count;
}

