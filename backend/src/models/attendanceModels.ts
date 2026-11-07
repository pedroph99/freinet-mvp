import prisma from "../lib/prisma";
import {
    AttendanceResponse,
    CreateAttendanceData,
    UpdateAttendanceData,
} from "../interfaces/attedanceInterface";


export const getAllAttendance = async (): Promise<AttendanceResponse[]> => {
    const attendanceRecords = await prisma.attendance.findMany({
        include: {
            student: {
                include: {
                    person: true
                }
            },
            lesson: {
                include: {
                    class: true
                }
            }
        }
    });
    return attendanceRecords;
}

export const getAttendanceById = async (attendanceId: number): Promise<AttendanceResponse | null> => {
    const attendanceRecord = await prisma.attendance.findUnique({
        where: { id: attendanceId },
        include: {
            student: {
                include: {
                    person: true
                }
            },
            lesson: {
                include: {
                    class: true
                }
            }
        }
    });
    return attendanceRecord;
}

export const createAttendance = async (attendanceData: CreateAttendanceData): Promise<AttendanceResponse> => {
    const newAttendance = await prisma.attendance.create({
        data: {
            studentId: attendanceData.studentId,
            lessonId: attendanceData.lessonId,
            status: attendanceData.status,
            notes: attendanceData.notes,
            checkedAt: attendanceData.checkedAt ? new Date(attendanceData.checkedAt) : new Date()
        },
        include: {
            student: {
                include: {
                    person: true
                }
            },
            lesson: {
                include: {
                    class: true
                }
            }
        }
    });
    return newAttendance;
}

export const updateAttendance = async (attendanceId: number, attendanceData: UpdateAttendanceData): Promise<AttendanceResponse> => {
    const updatedAttendance = await prisma.attendance.update({
        where: { id: attendanceId },
        data: {
            status: attendanceData.status,
            notes: attendanceData.notes,
            checkedAt: attendanceData.checkedAt ? new Date(attendanceData.checkedAt) : new Date()
        },
        include: {
            student: {
                include: {
                    person: true
                }
            },
            lesson: {
                include: {
                    class: true
                }
            }
        }
    });
    return updatedAttendance;
}

export const deleteAttendance = async (attendanceId: number): Promise<AttendanceResponse> => {
    const deletedAttendance = await prisma.attendance.delete({
        where: { id: attendanceId },
        include: {
            student: {
                include: {
                    person: true
                }
            },
            lesson: {
                include: {
                    class: true
                }
            }
        }
    });
    return deletedAttendance;
}

export const countLessonsAttendedByStudent = async (studentId: number): Promise<number> => {
    const count = await prisma.attendance.count({
        where: {
            studentId,
            status: 'PRESENT'
        }
    });
    return count;
}

export const countLessonsMissedByStudent = async (studentId: number): Promise<number> => {
    const count = await prisma.attendance.count({
        where: {
            studentId,
            status: 'ABSENT'
        }
    });
    return count;
}
